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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productData, imageUrls, inventoryData } = body;

        // Insert product with service role (bypasses RLS)
        const { data: product, error: productError } = await supabaseAdmin
            .from("products")
            .insert(productData)
            .select()
            .single();

        if (productError) {
            console.error("Product insert error:", productError);
            return NextResponse.json(
                { error: productError.message },
                { status: 400 }
            );
        }

        // Insert images if provided
        if (imageUrls && imageUrls.length > 0) {
            const { error: imagesError } = await supabaseAdmin
                .from("product_images")
                .insert(
                    imageUrls.map((url: string, index: number) => ({
                        product_id: product.id,
                        image_url: url,
                        alt_text: `${product.name} - Image ${index + 1}`,
                        display_order: index,
                    }))
                );

            if (imagesError) {
                console.error("Images insert error:", imagesError);
                // Don't fail the whole operation for image errors
            }
        }

        // Insert inventory
        if (inventoryData) {
            const { error: inventoryError } = await supabaseAdmin
                .from("inventory")
                .insert({
                    product_id: product.id,
                    quantity: inventoryData.quantity || 0,
                    low_stock_threshold: inventoryData.low_stock_threshold || 10,
                });

            if (inventoryError) {
                console.error("Inventory insert error:", inventoryError);
                // Don't fail the whole operation for inventory errors
            }
        }

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create product" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, productData, imageUrls, inventoryData } = body;

        // Update product with service role (bypasses RLS)
        const { data: product, error: productError } = await supabaseAdmin
            .from("products")
            .update(productData)
            .eq("id", productId)
            .select()
            .single();

        if (productError) {
            console.error("Product update error:", productError);
            return NextResponse.json(
                { error: productError.message },
                { status: 400 }
            );
        }

        // Update inventory if provided
        if (inventoryData) {
            const { error: inventoryError } = await supabaseAdmin
                .from("inventory")
                .upsert({
                    product_id: productId,
                    quantity: inventoryData.quantity || 0,
                    low_stock_threshold: inventoryData.low_stock_threshold || 10,
                });

            if (inventoryError) {
                console.error("Inventory update error:", inventoryError);
            }
        }

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("id");

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID required" },
                { status: 400 }
            );
        }

        // Delete with service role (bypasses RLS)
        const { error } = await supabaseAdmin
            .from("products")
            .delete()
            .eq("id", productId);

        if (error) {
            console.error("Product delete error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete product" },
            { status: 500 }
        );
    }
}
