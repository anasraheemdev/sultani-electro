import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch statistics
    const [
        { count: productsCount },
        { count: ordersCount },
        { data: products },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*, inventory(quantity)').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
    ]);

    // Calculate total revenue (mock data)
    const totalRevenue = 1250000;
    const lowStockProducts = products?.filter(p => p.inventory?.[0]?.quantity < 10) || [];

    const stats = [
        {
            title: "Total Products",
            value: productsCount || 0,
            icon: Package,
            color: "bg-blue-500",
            change: "+12%",
        },
        {
            title: "Total Orders",
            value: ordersCount || 0,
            icon: ShoppingCart,
            color: "bg-green-500",
            change: "+8%",
        },
        {
            title: "Revenue",
            value: `PKR ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-purple-500",
            change: "+23%",
        },
        {
            title: "Low Stock Items",
            value: lowStockProducts.length,
            icon: AlertTriangle,
            color: "bg-orange-500",
            change: "",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg p-6 shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                {stat.change && (
                                    <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-lg p-6 shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Low Stock Alert</h2>
                            <Link href="/admin/products" className="text-sm text-primary hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {lowStockProducts.slice(0, 5).map((product: any) => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.sku}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                                        {product.inventory?.[0]?.quantity || 0} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders?.slice(0, 5).map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">PKR {order.total_amount.toLocaleString()}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
