import { createClient } from "@/lib/supabase/server";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default async function AdminInventoryPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(name),
            inventory(quantity, low_stock_threshold)
        `)
        .order("name");

    const lowStockProducts = products?.filter(
        p => p.inventory?.[0]?.quantity <= p.inventory?.[0]?.low_stock_threshold
    ) || [];

    const outOfStockProducts = products?.filter(
        p => p.inventory?.[0]?.quantity === 0
    ) || [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
                <p className="text-gray-600">Track and manage product stock levels</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total Products</p>
                            <p className="text-3xl font-bold">{products?.length || 0}</p>
                        </div>
                        <Package className="h-12 w-12 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Low Stock</p>
                            <p className="text-3xl font-bold text-orange-500">{lowStockProducts.length}</p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-orange-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
                            <p className="text-3xl font-bold text-red-500">{outOfStockProducts.length}</p>
                        </div>
                        <TrendingDown className="h-12 w-12 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold">All Products</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Threshold</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products?.map((product: any) => {
                            const quantity = product.inventory?.[0]?.quantity || 0;
                            const threshold = product.inventory?.[0]?.low_stock_threshold || 10;
                            const isLowStock = quantity <= threshold && quantity > 0;
                            const isOutOfStock = quantity === 0;

                            return (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold">{product.name}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{product.category?.name}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{product.sku}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-lg">{quantity}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{threshold}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOutOfStock
                                                ? "bg-red-100 text-red-700"
                                                : isLowStock
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                            {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/products/${product.id}/edit`} className="text-primary hover:underline text-sm font-semibold">
                                            Update Stock
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
