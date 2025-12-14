"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProductPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>(['']);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [{ data: cats }, { data: brds }] = await Promise.all([
            supabase.from('categories').select('*').eq('is_active', true),
            supabase.from('brands').select('*').eq('is_active', true),
        ]);
        setCategories(cats || []);
        setBrands(brds || []);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            // Insert product
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert({
                    name: formData.get('name'),
                    slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
                    description: formData.get('description'),
                    short_description: formData.get('short_description'),
                    sku: formData.get('sku'),
                    category_id: formData.get('category_id'),
                    brand_id: formData.get('brand_id') || null,
                    price: parseFloat(formData.get('price') as string),
                    discounted_price: formData.get('discounted_price')
                        ? parseFloat(formData.get('discounted_price') as string)
                        : null,
                    specifications: formData.get('specifications')
                        ? JSON.parse(formData.get('specifications') as string)
                        : null,
                    features: features.filter(f => f.trim()),
                    is_featured: formData.get('is_featured') === 'on',
                    is_active: formData.get('is_active') === 'on',
                })
                .select()
                .single();

            if (productError) throw productError;

            // Insert images
            if (imageUrls.length > 0) {
                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(
                        imageUrls.map((url, index) => ({
                            product_id: product.id,
                            image_url: url,
                            alt_text: `${product.name} - Image ${index + 1}`,
                            display_order: index,
                        }))
                    );

                if (imagesError) throw imagesError;
            }

            // Insert inventory
            const { error: inventoryError } = await supabase
                .from('inventory')
                .insert({
                    product_id: product.id,
                    quantity: parseInt(formData.get('quantity') as string) || 0,
                    low_stock_threshold: parseInt(formData.get('low_stock_threshold') as string) || 10,
                });

            if (inventoryError) throw inventoryError;

            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addFeature = () => {
        setFeatures([...features, '']);
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-gray-600">Create a new product in your catalog</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Enter product name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="SE-PROD-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category *</label>
                            <select
                                name="category_id"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Brand</label>
                            <select
                                name="brand_id"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            >
                                <option value="">Select brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Price (PKR) *</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Discounted Price (PKR)</label>
                            <input
                                type="number"
                                name="discounted_price"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Short Description</label>
                            <input
                                type="text"
                                name="short_description"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Brief product description"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Full Description</label>
                            <textarea
                                name="description"
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Detailed product description"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Product Images</h2>
                    <ImageUpload onImagesUploaded={setImageUrls} existingImages={imageUrls} />
                </div>

                {/* Features */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Features</h2>
                        <Button type="button" onClick={addFeature} variant="outline" size="sm">
                            Add Feature
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="Enter feature"
                                />
                                <Button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Quantity *</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="0"
                                defaultValue="0"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Low Stock Threshold</label>
                            <input
                                type="number"
                                name="low_stock_threshold"
                                min="0"
                                defaultValue="10"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Settings</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_featured" className="w-4 h-4" />
                            <span className="text-sm font-semibold">Featured Product</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4" />
                            <span className="text-sm font-semibold">Active</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="px-8">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
