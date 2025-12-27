import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
        }

        // Use admin client (service role) to bypass RLS for admin check
        const adminSupabase = createAdminClient();
        const { data: admin, error } = await adminSupabase
            .from("admins")
            .select("*")
            .eq("user_id", user.id)
            .single();

        console.log("Admin check:", { userId: user.id, admin, error });

        if (!admin) {
            console.log("User is not an admin, redirecting to home");
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Protect user routes
    const protectedRoutes = ["/profile", "/orders", "/addresses", "/checkout"];
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!user) {
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/addresses/:path*", "/checkout"],
};
