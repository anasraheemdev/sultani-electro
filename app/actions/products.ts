"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const supabase = createAdminClient();

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
        console.error("Create product error:", error);
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

export async function updateProduct(productId: string, formData: FormData): Promise<void> {
    const supabase = createAdminClient();

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

    console.log("Updating product:", productId, productData);

    const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", productId);

    if (error) {
        console.error("Failed to update product:", error.message);
        return;
    }

    // Get quantity values
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const lowStockThreshold = parseInt(formData.get("low_stock_threshold") as string) || 10;

    console.log("Updating inventory - quantity:", quantity, "threshold:", lowStockThreshold);

    // Check if inventory exists for this product
    const { data: existingInventory } = await supabase
        .from("inventory")
        .select("id")
        .eq("product_id", productId)
        .single();

    if (existingInventory) {
        // Update existing inventory
        const { error: invError } = await supabase
            .from("inventory")
            .update({
                quantity: quantity,
                low_stock_threshold: lowStockThreshold,
            })
            .eq("product_id", productId);

        if (invError) {
            console.error("Failed to update inventory:", invError.message);
        } else {
            console.log("Inventory updated successfully");
        }
    } else {
        // Insert new inventory record
        const { error: invError } = await supabase
            .from("inventory")
            .insert({
                product_id: productId,
                quantity: quantity,
                low_stock_threshold: lowStockThreshold,
            });

        if (invError) {
            console.error("Failed to insert inventory:", invError.message);
        } else {
            console.log("Inventory created successfully");
        }
    }

    // Get product slug for revalidation
    const { data: product } = await supabase
        .from("products")
        .select("slug")
        .eq("id", productId)
        .single();

    revalidatePath("/admin/products");
    if (product?.slug) {
        revalidatePath(`/products/${product.slug}`);
    }

    redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
    const supabase = createAdminClient();

    // First delete related records (due to foreign key constraints)
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("inventory").delete().eq("product_id", productId);
    await supabase.from("cart_items").delete().eq("product_id", productId);
    await supabase.from("wishlist").delete().eq("product_id", productId);

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        console.error("Delete product error:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("products")
        .update({ is_active: !isActive })
        .eq("id", productId);

    if (error) {
        console.error("Toggle status error:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
}
