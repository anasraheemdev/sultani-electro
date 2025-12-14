import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, MapPin, Settings, User } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's orders
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="container-custom py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.user_metadata?.full_name || user.email}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Quick Links */}
                <Link
                    href="/dashboard/orders"
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">My Orders</h3>
                    <p className="text-sm text-gray-600">Track your orders</p>
                </Link>

                <Link
                    href="/wishlist"
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Wishlist</h3>
                    <p className="text-sm text-gray-600">Your saved items</p>
                </Link>

                <Link
                    href="/dashboard/addresses"
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Addresses</h3>
                    <p className="text-sm text-gray-600">Manage addresses</p>
                </Link>

                <Link
                    href="/dashboard/settings"
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Settings className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Settings</h3>
                    <p className="text-sm text-gray-600">Account settings</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recent Orders</h2>
                    <Link href="/dashboard/orders" className="text-primary hover:text-primary-dark font-semibold text-sm">
                        View All
                    </Link>
                </div>

                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/dashboard/orders/${order.id}`}
                                className="block p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">PKR {order.total_amount.toLocaleString()}</p>
                                        <p className="text-sm">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600 mb-4">No orders yet</p>
                        <Link href="/products" className="text-primary hover:text-primary-dark font-semibold">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
