import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Label } from "@/components/ui/label";
import { updateProduct } from "@/app/actions/products";
import Link from "next/link";

export default async function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select(`
            *,
            inventory (quantity, low_stock_threshold)
        `)
        .eq("id", id)
        .single();

    if (!product) {
        notFound();
    }

    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

    const { data: brands } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("name");

    const inventory = product.inventory?.[0];

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold">Edit Product</h2>
                <p className="text-gray-500">Update product information</p>
            </div>

            <form action={updateProduct.bind(null, id)}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormInput
                                label="Product Name"
                                name="name"
                                required
                                defaultValue={product.name}
                            />

                            <FormInput
                                label="SKU"
                                name="sku"
                                required
                                defaultValue={product.sku}
                            />

                            <FormTextarea
                                label="Short Description"
                                name="short_description"
                                required
                                rows={2}
                                defaultValue={product.short_description || ""}
                                maxLength={200}
                                showCharCount
                            />

                            <FormTextarea
                                label="Full Description"
                                name="description"
                                required
                                rows={6}
                                defaultValue={product.description}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Categorization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="category_id">Category *</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    required
                                    defaultValue={product.category_id || ""}
                                    className="w-full mt-2 px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="brand_id">Brand</Label>
                                <select
                                    id="brand_id"
                                    name="brand_id"
                                    defaultValue={product.brand_id || ""}
                                    className="w-full mt-2 px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select a brand (optional)</option>
                                    {brands?.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Regular Price (PKR)"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    defaultValue={product.price}
                                />

                                <FormInput
                                    label="Discounted Price (PKR)"
                                    name="discounted_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.discounted_price || ""}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Stock Quantity"
                                    name="quantity"
                                    type="number"
                                    required
                                    defaultValue={inventory?.quantity || 0}
                                />

                                <FormInput
                                    label="Low Stock Threshold"
                                    name="low_stock_threshold"
                                    type="number"
                                    defaultValue={inventory?.low_stock_threshold || 10}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    name="is_featured"
                                    defaultChecked={product.is_featured}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="is_featured">Featured Product</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked={product.is_active}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="is_active">Active (Visible on store)</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" size="lg">
                            Update Product
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
