"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewCategoryPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const { error } = await supabase
                .from('categories')
                .insert({
                    name: formData.get('name'),
                    slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
                    description: formData.get('description'),
                    icon: formData.get('icon'),
                    display_order: parseInt(formData.get('display_order') as string) || 0,
                    is_active: formData.get('is_active') === 'on',
                });

            if (error) throw error;

            toast.success('Category created successfully!');
            router.push('/admin/categories');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/categories">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Add New Category</h1>
                    <p className="text-gray-600">Create a new product category</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-lg p-6 shadow space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Category Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="Category description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Icon (Emoji)</label>
                        <input
                            type="text"
                            name="icon"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="📦"
                            maxLength={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Display Order</label>
                        <input
                            type="number"
                            name="display_order"
                            defaultValue="0"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4" />
                            <span className="text-sm font-semibold">Active</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Creating...' : 'Create Category'}
                        </Button>
                        <Link href="/admin/categories">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
