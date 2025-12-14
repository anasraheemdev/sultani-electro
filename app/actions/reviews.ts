"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReview(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const reviewData = {
        product_id: formData.get("product_id") as string,
        user_id: user.id,
        rating: parseInt(formData.get("rating") as string),
        comment: formData.get("comment") as string,
        is_verified_purchase: false, // Can be updated based on order history
    };

    // Check if user already reviewed this product
    const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", reviewData.product_id)
        .eq("user_id", user.id)
        .single();

    if (existing) {
        return { error: "You have already reviewed this product" };
    }

    const { error } = await supabase.from("reviews").insert(reviewData);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/products/*`);
    return { success: true };
}

export async function updateReview(reviewId: string, formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const reviewData = {
        rating: parseInt(formData.get("rating") as string),
        comment: formData.get("comment") as string,
    };

    const { error } = await supabase
        .from("reviews")
        .update(reviewData)
        .eq("id", reviewId)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/products/*`);
    return { success: true };
}

export async function deleteReview(reviewId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/products/*`);
    return { success: true };
}

export async function approveReview(reviewId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true })
        .eq("id", reviewId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/*`);
    return { success: true };
}
