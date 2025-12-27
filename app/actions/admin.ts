"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient();

    // Verify user is admin
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!admin) {
        return { error: "Not authorized" };
    }

    // Update order status
    const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
}

export async function updateProduct(productId: string, data: any) {
    const supabase = await createClient();

    // Verify user is admin
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!admin) {
        return { error: "Not authorized" };
    }

    // Update product
    const { error } = await supabase
        .from("products")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", productId);

    if (error) {
        console.error("Error updating product:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);

    return { success: true };
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    // Verify user is admin
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!admin) {
        return { error: "Not authorized" };
    }

    // Soft delete - set is_active to false
    const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", productId);

    if (error) {
        console.error("Error deleting product:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/products");

    return { success: true };
}
