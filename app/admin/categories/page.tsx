import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("categories")
        .select(`
            *,
            products:products(count)
        `)
        .order("display_order");

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Categories</h1>
                    <p className="text-gray-600">Manage product categories</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((category: any) => (
                    <div key={category.id} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-4xl">{category.icon || "📦"}</div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}>
                                {category.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {category.description || "No description"}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-gray-600">
                                {category.products?.[0]?.count || 0} products
                            </span>
                            <div className="flex gap-2">
                                <Link href={`/categories/${category.slug}`} target="_blank">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
