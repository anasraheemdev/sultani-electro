"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function validateCoupon(code: string, orderTotal: number) {
    const supabase = await createClient();

    const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

    if (!coupon) {
        return { error: "Invalid coupon code" };
    }

    // Check if expired
    if (coupon.end_date && new Date(coupon.end_date) < new Date()) {
        return { error: "Coupon has expired" };
    }

    // Check if not yet valid
    if (coupon.start_date && new Date(coupon.start_date) > new Date()) {
        return { error: "Coupon is not yet valid" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { error: "Coupon usage limit reached" };
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        return {
            error: `Minimum order amount of PKR ${coupon.min_order_amount.toLocaleString()} required`,
        };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
        discountAmount = (orderTotal * coupon.discount_value) / 100;
        if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        }
    } else {
        discountAmount = coupon.discount_value;
    }

    return {
        success: true,
        coupon: {
            id: coupon.id,
            code: coupon.code,
            description: coupon.description,
            discountAmount,
        },
    };
}

export async function applyCoupon(couponId: string) {
    const supabase = await createClient();

    // Increment used count
    const { error } = await supabase.rpc("increment_coupon_usage", {
        coupon_id: couponId,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function createCoupon(formData: FormData) {
    const supabase = await createClient();

    const couponData = {
        code: (formData.get("code") as string).toUpperCase(),
        description: formData.get("description") as string,
        discount_type: formData.get("discount_type") as string,
        discount_value: parseFloat(formData.get("discount_value") as string),
        min_order_amount: formData.get("min_order_amount")
            ? parseFloat(formData.get("min_order_amount") as string)
            : null,
        max_discount_amount: formData.get("max_discount_amount")
            ? parseFloat(formData.get("max_discount_amount") as string)
            : null,
        usage_limit: formData.get("usage_limit")
            ? parseInt(formData.get("usage_limit") as string)
            : null,
        start_date: formData.get("start_date") || null,
        end_date: formData.get("end_date") || null,
        is_active: formData.get("is_active") === "on",
    };

    const { error } = await supabase.from("coupons").insert(couponData);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/coupons");
    return { success: true };
}
