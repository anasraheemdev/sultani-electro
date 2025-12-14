import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function AdminBrandsPage() {
    const supabase = await createClient();

    const { data: brands } = await supabase
        .from("brands")
        .select(`
            *,
            products:products(count)
        `)
        .order("name");

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Brands</h1>
                    <p className="text-gray-600">Manage product brands</p>
                </div>
                <Link href="/admin/brands/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Brand
                    </Button>
                </Link>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands?.map((brand: any) => (
                    <div key={brand.id} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {brand.logo_url ? (
                                    <Image
                                        src={brand.logo_url}
                                        alt={brand.name}
                                        width={64}
                                        height={64}
                                        className="object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">
                                        {brand.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${brand.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                {brand.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {brand.description || "No description"}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-gray-600">
                                {brand.products?.[0]?.count || 0} products
                            </span>
                            <div className="flex gap-2">
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

            {/* Empty State */}
            {brands?.length === 0 && (
                <div className="text-center py-20 bg-white rounded-lg">
                    <p className="text-gray-600 mb-4">No brands yet</p>
                    <Link href="/admin/brands/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Brand
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
