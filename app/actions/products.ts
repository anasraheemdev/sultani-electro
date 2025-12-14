"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const productData = {
        name: formData.get("name") as string,
        slug: (formData.get("name") as string)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        sku: formData.get("sku") as string,
        category_id: formData.get("category_id") as string,
        brand_id: formData.get("brand_id") as string || null,
        price: parseFloat(formData.get("price") as string),
        discounted_price: formData.get("discounted_price")
            ? parseFloat(formData.get("discounted_price") as string)
            : null,
        is_featured: formData.get("is_featured") === "on",
        is_active: formData.get("is_active") === "on",
    };

    const { data: product, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    // Create inventory record
    await supabase.from("inventory").insert({
        product_id: product.id,
        quantity: parseInt(formData.get("quantity") as string) || 0,
        low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 10,
    });

    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
    const supabase = await createClient();

    const productData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        sku: formData.get("sku") as string,
        category_id: formData.get("category_id") as string,
        brand_id: formData.get("brand_id") as string || null,
        price: parseFloat(formData.get("price") as string),
        discounted_price: formData.get("discounted_price")
            ? parseFloat(formData.get("discounted_price") as string)
            : null,
        is_featured: formData.get("is_featured") === "on",
        is_active: formData.get("is_active") === "on",
    };

    const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", productId);

    if (error) {
        return { error: error.message };
    }

    // Update inventory
    await supabase
        .from("inventory")
        .update({
            quantity: parseInt(formData.get("quantity") as string) || 0,
            low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 10,
        })
        .eq("product_id", productId);

    revalidatePath("/admin/products");
    revalidatePath(`/products/${productData.slug}`);
    return { success: true };
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_active: !isActive })
        .eq("id", productId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
}
