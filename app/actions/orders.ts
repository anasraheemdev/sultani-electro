"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get cart items
    const { data: cart } = await supabase
        .from("carts")
        .select(`
            id,
            cart_items (
                id,
                quantity,
                product:products (id, name, sku, price, discounted_price)
            )
        `)
        .eq("user_id", user.id)
        .single();

    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
        return { error: "Cart is empty" };
    }

    // Calculate totals
    const cartItems = cart.cart_items as any[];
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.discounted_price || item.product.price;
        return sum + (price * item.quantity);
    }, 0);

    const deliveryCost = subtotal >= 50000 ? 0 : 500;
    const total = subtotal + deliveryCost;

    // Get form data
    const addressId = formData.get("addressId") as string;
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const notes = formData.get("notes") as string;

    // Generate order number
    const orderNumber = `SE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.id,
            order_number: orderNumber,
            status: "pending",
            subtotal,
            delivery_cost: deliveryCost,
            total,
            delivery_address_id: addressId || null,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            notes: notes || null,
        })
        .select()
        .single();

    if (orderError || !order) {
        return { error: "Failed to create order" };
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.discounted_price || item.product.price,
        total_price: (item.product.discounted_price || item.product.price) * item.quantity,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        // Rollback order if items creation fails
        await supabase.from("orders").delete().eq("id", order.id);
        return { error: "Failed to create order items" };
    }

    // Update inventory
    for (const item of cartItems) {
        await supabase.rpc("decrement_inventory", {
            product_id: item.product.id,
            quantity: item.quantity,
        });
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);

    revalidatePath("/cart");
    revalidatePath("/orders");

    redirect(`/orders/${order.id}?success=true`);
}

export async function updateOrderStatus(orderId: string, formData: FormData): Promise<void> {
    const supabase = await createClient();

    const status = formData.get("status") as string;

    if (!status) {
        console.error("Status is required");
        return;
    }

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
        console.error("Failed to update order status:", error.message);
        return;
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}
