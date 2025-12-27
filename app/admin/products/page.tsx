import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search, Edit, Package, Filter, Grid3X3, List, Eye, MoreVertical, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { QuickStockUpdate } from "@/components/admin/quick-stock-update";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const [{ data: products }, { data: categories }, { count: totalCount }] = await Promise.all([
        supabase
            .from("products")
            .select(`
                *,
                category:categories(name, slug),
                brand:brands(name),
                images:product_images(image_url),
                inventory(quantity)
            `)
            .order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name").eq("is_active", true),
        supabase.from("products").select("*", { count: "exact", head: true }),
    ]);

    const activeCount = products?.filter(p => p.is_active).length || 0;
    const outOfStockCount = products?.filter(p => (p.inventory?.[0]?.quantity || 0) === 0).length || 0;
    const lowStockCount = products?.filter(p => {
        const qty = p.inventory?.[0]?.quantity || 0;
        return qty > 0 && qty < 10;
    }).length || 0;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Products", value: totalCount || 0, color: "from-blue-500 to-indigo-600", icon: Package },
                    { label: "Active Products", value: activeCount, color: "from-green-500 to-emerald-600", icon: Eye },
                    { label: "Low Stock", value: lowStockCount, color: "from-yellow-500 to-orange-500", icon: Tag },
                    { label: "Out of Stock", value: outOfStockCount, color: "from-red-500 to-rose-600", icon: Package },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Product Catalog</h2>
                                <p className="text-xs text-slate-500">{totalCount || 0} products in your store</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                                    <option value="">All Categories</option>
                                    {categories?.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Add Button */}
                            <Link href="/admin/products/new">
                                <Button className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Products Table/Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Category</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products?.map((product: any) => {
                                const stockQty = product.inventory?.[0]?.quantity || 0;
                                const stockStatus = stockQty === 0 ? 'out' : stockQty < 10 ? 'low' : 'in';

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        {/* Product Info */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0].image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-slate-900 truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                                                    {product.is_featured && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded mt-1">
                                                            <Star className="h-3 w-3 fill-yellow-500" /> Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-4 hidden md:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">PKR {product.price?.toLocaleString()}</p>
                                                {product.discounted_price && (
                                                    <p className="text-xs text-green-600">Sale: PKR {product.discounted_price.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Stock */}
                                        <td className="py-3 px-4 hidden sm:table-cell">
                                            <QuickStockUpdate productId={product.id} currentStock={stockQty} />
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4 hidden lg:table-cell">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${product.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                {product.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/products/${product.slug}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
                                                        <Eye className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteProductButton productId={product.id} productName={product.name} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {(!products || products.length === 0) && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No products yet</h3>
                        <p className="text-slate-500 text-sm mb-4">Get started by adding your first product</p>
                        <Link href="/admin/products/new">
                            <Button className="rounded-xl">
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Product
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {products && products.length > 0 && (
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-900">{products.length}</span> of <span className="font-semibold text-slate-900">{totalCount || 0}</span> products
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg bg-primary text-white hover:bg-primary/90">
                                1
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg" disabled>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
