"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number = 1) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to add items to cart" };
    }

    // Get or create cart
    let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!cart) {
        const { data: newCart, error: cartError } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select("id")
            .single();

        if (cartError) {
            return { error: cartError.message };
        }
        cart = newCart;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .single();

    if (existingItem) {
        // Update quantity
        const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existingItem.quantity + quantity })
            .eq("id", existingItem.id);

        if (error) {
            return { error: error.message };
        }
    } else {
        // Add new item
        const { error } = await supabase
            .from("cart_items")
            .insert({
                cart_id: cart.id,
                product_id: productId,
                quantity,
            });

        if (error) {
            return { error: error.message };
        }
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function removeFromCart(cartItemId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    const supabase = await createClient();

    if (quantity <= 0) {
        return removeFromCart(cartItemId);
    }

    const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function clearCart() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in" };
    }

    const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!cart) {
        return { success: true };
    }

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/cart");
    return { success: true };
}
