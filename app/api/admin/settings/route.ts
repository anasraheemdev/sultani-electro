import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("store_settings")
            .select("*")
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Settings fetch error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ settings: data });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const settings = await request.json();

        // Check if settings exist
        const { data: existing } = await supabaseAdmin
            .from("store_settings")
            .select("id")
            .single();

        let result;

        if (existing) {
            // Update existing settings
            const { data, error } = await supabaseAdmin
                .from("store_settings")
                .update({
                    ...settings,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Insert new settings
            const { data, error } = await supabaseAdmin
                .from("store_settings")
                .insert({
                    ...settings,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({ success: true, settings: result });
    } catch (error: any) {
        console.error("Settings save error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to save settings" },
            { status: 500 }
        );
    }
}
