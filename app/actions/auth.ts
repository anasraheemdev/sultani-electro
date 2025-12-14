"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().optional(),
});

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    // Validate input
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        redirect(`/login?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/");
}

export async function register(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        fullName: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
    };

    // Validate input
    const result = registerSchema.safeParse(data);
    if (!result.success) {
        redirect(`/register?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.fullName,
                phone: data.phone,
            },
        },
    });

    if (error) {
        redirect(`/register?error=${encodeURIComponent(error.message)}`);
    }

    // Create user profile
    if (authData.user) {
        await supabase.from("users").insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone || null,
        });
    }

    redirect("/login?registered=true");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
