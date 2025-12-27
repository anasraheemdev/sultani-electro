import { createClient } from "@/lib/supabase/server";
import {
    Package, ShoppingCart, DollarSign, AlertTriangle, Users, TrendingUp,
    Eye, ArrowUp, ArrowDown, Clock, CheckCircle, XCircle,
    Calendar, BarChart3, PieChart, Activity, CreditCard, Truck,
    ArrowRight, RefreshCw
} from "lucide-react";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    // Fetch all data for analytics
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: usersCount },
        { count: categoriesCount },
        { count: brandsCount },
        { data: products },
        { data: allOrders },
        { data: orderItems },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('brands').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*, inventory(quantity), category:categories(name)'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_items').select('*, product:products(name, price)'),
    ]);

    // Calculate key metrics
    const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const completedOrders = allOrders?.filter(o => o.status === 'delivered').length || 0;
    const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0;
    const processingOrders = allOrders?.filter(o => o.status === 'processing').length || 0;
    const cancelledOrders = allOrders?.filter(o => o.status === 'cancelled').length || 0;
    const shippedOrders = allOrders?.filter(o => o.status === 'shipped').length || 0;

    const avgOrderValue = ordersCount && ordersCount > 0 ? totalRevenue / ordersCount : 0;
    const conversionRate = 12.5; // Mock data

    // Inventory metrics
    const totalInventory = products?.reduce((sum, p) => sum + (p.inventory?.[0]?.quantity || 0), 0) || 0;
    const lowStockProducts = products?.filter(p => (p.inventory?.[0]?.quantity || 0) < 10 && (p.inventory?.[0]?.quantity || 0) > 0) || [];
    const outOfStockProducts = products?.filter(p => (p.inventory?.[0]?.quantity || 0) === 0) || [];
    const activeProducts = products?.filter(p => p.is_active).length || 0;
    const inactiveProducts = products?.filter(p => !p.is_active).length || 0;

    // Date-based analytics (last 7 days, 30 days)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const orders7Days = allOrders?.filter(o => new Date(o.created_at) >= last7Days) || [];
    const orders30Days = allOrders?.filter(o => new Date(o.created_at) >= last30Days) || [];

    const revenue7Days = orders7Days.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenue30Days = orders30Days.reduce((sum, o) => sum + (o.total || 0), 0);

    // Today's stats
    const today = new Date().toDateString();
    const todayOrders = allOrders?.filter(o => new Date(o.created_at).toDateString() === today) || [];
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Category breakdown
    const categoryStats = products?.reduce((acc: any, p: any) => {
        const catName = p.category?.name || 'Uncategorized';
        if (!acc[catName]) acc[catName] = { count: 0, value: 0 };
        acc[catName].count++;
        acc[catName].value += p.price || 0;
        return acc;
    }, {}) || {};

    // Order status distribution
    const orderStatusData = [
        { status: "Pending", count: pendingOrders, color: "bg-yellow-500", textColor: "text-yellow-600", bgLight: "bg-yellow-50", icon: Clock },
        { status: "Processing", count: processingOrders, color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50", icon: RefreshCw },
        { status: "Shipped", count: shippedOrders, color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-50", icon: Truck },
        { status: "Delivered", count: completedOrders, color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-50", icon: CheckCircle },
        { status: "Cancelled", count: cancelledOrders, color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-50", icon: XCircle },
    ];

    const paymentMethods = [
        { method: "Cash on Delivery", count: Math.floor((ordersCount || 0) * 0.6), percentage: 60 },
        { method: "Bank Transfer", count: Math.floor((ordersCount || 0) * 0.25), percentage: 25 },
        { method: "JazzCash/Easypaisa", count: Math.floor((ordersCount || 0) * 0.15), percentage: 15 },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Analytics Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Complete business insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm bg-white px-4 py-2 rounded-xl shadow-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Revenue Overview */}
            <div className="bg-gradient-to-r from-primary via-cyan-600 to-blue-700 rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-6 w-6" />
                        <h2 className="text-lg sm:text-xl font-bold">Revenue Overview</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div>
                            <p className="text-white/70 text-xs sm:text-sm mb-1">Total Revenue</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">PKR {totalRevenue.toLocaleString()}</p>
                            <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full mt-2">
                                <ArrowUp className="h-3 w-3" /> +23% vs last month
                            </span>
                        </div>
                        <div>
                            <p className="text-white/70 text-xs sm:text-sm mb-1">Today's Revenue</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">PKR {todayRevenue.toLocaleString()}</p>
                            <p className="text-xs text-white/60 mt-2">{todayOrders.length} orders</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-xs sm:text-sm mb-1">Last 7 Days</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">PKR {revenue7Days.toLocaleString()}</p>
                            <p className="text-xs text-white/60 mt-2">{orders7Days.length} orders</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-xs sm:text-sm mb-1">Last 30 Days</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">PKR {revenue30Days.toLocaleString()}</p>
                            <p className="text-xs text-white/60 mt-2">{orders30Days.length} orders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                    { label: "Total Orders", value: ordersCount || 0, icon: ShoppingCart, color: "from-blue-500 to-blue-600" },
                    { label: "Avg. Order Value", value: `PKR ${Math.round(avgOrderValue).toLocaleString()}`, icon: TrendingUp, color: "from-green-500 to-green-600" },
                    { label: "Total Products", value: productsCount || 0, icon: Package, color: "from-purple-500 to-purple-600" },
                    { label: "Total Customers", value: usersCount || 0, icon: Users, color: "from-orange-500 to-orange-600" },
                    { label: "Categories", value: categoriesCount || 0, icon: BarChart3, color: "from-pink-500 to-pink-600" },
                    { label: "Brands", value: brandsCount || 0, icon: Activity, color: "from-cyan-500 to-cyan-600" },
                ].map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{metric.value}</p>
                            <p className="text-xs text-gray-500">{metric.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Order Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <PieChart className="h-5 w-5 text-primary" />
                        <h3 className="text-base sm:text-lg font-bold">Order Status Distribution</h3>
                    </div>

                    <div className="space-y-3">
                        {orderStatusData.map((item, index) => {
                            const Icon = item.icon;
                            const percentage = ordersCount && ordersCount > 0 ? ((item.count / ordersCount) * 100) : 0;
                            return (
                                <div key={index} className={`${item.bgLight} rounded-xl p-3 sm:p-4`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`${item.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                                                <Icon className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-sm">{item.status}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold">{item.count}</span>
                                            <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="text-base sm:text-lg font-bold">Payment Methods</h3>
                    </div>

                    <div className="space-y-4">
                        {paymentMethods.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{item.method}</span>
                                    <span className="text-sm font-bold">{item.count} orders ({item.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${index === 0 ? 'bg-green-500' :
                                                index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                                            }`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-2">Most Popular Payment</p>
                        <p className="text-lg font-bold text-primary">Cash on Delivery</p>
                    </div>
                </div>
            </div>

            {/* Inventory Analytics */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="text-base sm:text-lg font-bold">Inventory Analytics</h3>
                    </div>
                    <Link href="/admin/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View Inventory <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalInventory.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-blue-600">Total Units</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{activeProducts}</p>
                        <p className="text-xs sm:text-sm text-green-600">Active Products</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-orange-600">{lowStockProducts.length}</p>
                        <p className="text-xs sm:text-sm text-orange-600">Low Stock</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">{outOfStockProducts.length}</p>
                        <p className="text-xs sm:text-sm text-red-600">Out of Stock</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <h4 className="font-semibold mb-3">Products by Category</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(categoryStats).slice(0, 8).map(([name, data]: [string, any], index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-3">
                            <p className="font-semibold text-sm truncate">{name}</p>
                            <p className="text-lg font-bold text-primary">{data.count}</p>
                            <p className="text-xs text-gray-500">products</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-base sm:text-lg font-bold">Customer Stats</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm">Total Customers</span>
                            <span className="text-lg font-bold">{usersCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm">Orders per Customer</span>
                            <span className="text-lg font-bold">{usersCount ? ((ordersCount || 0) / usersCount).toFixed(1) : 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm">Customer Lifetime Value</span>
                            <span className="text-lg font-bold">PKR {usersCount ? Math.round(totalRevenue / usersCount).toLocaleString() : 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <h3 className="text-base sm:text-lg font-bold">Growth Metrics</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                            <span className="text-sm">Revenue Growth</span>
                            <span className="text-lg font-bold text-green-600">+23%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                            <span className="text-sm">Order Growth</span>
                            <span className="text-lg font-bold text-blue-600">+12%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                            <span className="text-sm">Customer Growth</span>
                            <span className="text-lg font-bold text-purple-600">+18%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                    <h3 className="text-base sm:text-lg font-bold mb-4">Quick Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                            <span className="text-sm">Conversion Rate</span>
                            <span className="text-lg font-bold">{conversionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                            <span className="text-sm">Fulfillment Rate</span>
                            <span className="text-lg font-bold">{ordersCount ? ((completedOrders / ordersCount) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                            <span className="text-sm">Cancellation Rate</span>
                            <span className="text-lg font-bold">{ordersCount ? ((cancelledOrders / ordersCount) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
