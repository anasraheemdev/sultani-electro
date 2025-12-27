import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create admin client with service role key to bypass RLS
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error("Missing Supabase credentials:", { url: !!url, key: !!key });
        throw new Error("Missing Supabase admin credentials");
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, quantity } = body;

        console.log("=== Inventory Update Request ===");
        console.log("Product ID:", productId);
        console.log("New Quantity:", quantity);

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const supabaseAdmin = getAdminClient();

        // First check if inventory exists
        const { data: existingInventory, error: checkError } = await supabaseAdmin
            .from("inventory")
            .select("id, quantity")
            .eq("product_id", productId)
            .maybeSingle();

        console.log("Existing inventory:", existingInventory);
        if (checkError) {
            console.log("Check error:", checkError);
        }

        let result;

        if (existingInventory) {
            // Update existing inventory
            console.log("Updating existing inventory record...");
            const { data, error } = await supabaseAdmin
                .from("inventory")
                .update({
                    quantity: quantity,
                    updated_at: new Date().toISOString()
                })
                .eq("id", existingInventory.id)
                .select()
                .single();

            if (error) {
                console.error("Update error:", error);
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            console.log("Update result:", data);
            result = data;
        } else {
            // Create new inventory record
            console.log("Creating new inventory record...");
            const { data, error } = await supabaseAdmin
                .from("inventory")
                .insert({
                    product_id: productId,
                    quantity: quantity,
                    low_stock_threshold: 10,
                })
                .select()
                .single();

            if (error) {
                console.error("Insert error:", error);
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            console.log("Insert result:", data);
            result = data;
        }

        console.log("=== Inventory Update Success ===");
        return NextResponse.json({ success: true, quantity: result.quantity, inventory: result });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update inventory" },
            { status: 500 }
        );
    }
}
