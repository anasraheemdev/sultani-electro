import { createClient } from "@/lib/supabase/server";
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

        // Check if user is admin
        const { data: admin } = await supabase
            .from("admins")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (!admin) {
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
