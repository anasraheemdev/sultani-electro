import { createClient } from "@/lib/supabase/server";
import {
    Package, ShoppingCart, DollarSign, AlertTriangle, Users, TrendingUp,
    ArrowUp, ArrowDown, Clock, CheckCircle, XCircle,
    ArrowRight, Eye, RefreshCw
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch all statistics in parallel
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: usersCount },
        { data: products },
        { data: allOrders },
        { data: recentOrders },
        { data: topProducts },
        { data: recentUsers },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*, inventory(quantity)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, order_items(quantity, unit_price)'),
        supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*, category:categories(name), images:product_images(image_url)').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    // Calculate statistics
    const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const completedOrders = allOrders?.filter(o => o.status === 'delivered').length || 0;
    const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0;

    const lowStockProducts = products?.filter(p => (p.inventory?.[0]?.quantity || 0) < 10) || [];
    const outOfStockProducts = products?.filter(p => (p.inventory?.[0]?.quantity || 0) === 0) || [];

    // Calculate average order value
    const avgOrderValue = ordersCount && ordersCount > 0 ? totalRevenue / ordersCount : 0;

    // Today's stats
    const today = new Date().toDateString();
    const todayOrders = allOrders?.filter(o => new Date(o.created_at).toDateString() === today) || [];
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary via-cyan-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-300/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back, Admin! 👋</h2>
                            <p className="text-white/80 text-sm sm:text-base">Here's what's happening with your store today.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin/products/new" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                                <Package className="h-4 w-4" /> Add Product
                            </Link>
                            <Link href="/admin/analytics" className="px-4 py-2 bg-white text-primary hover:bg-white/90 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> View Analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        title: "Total Revenue",
                        value: `PKR ${totalRevenue.toLocaleString()}`,
                        icon: DollarSign,
                        color: "from-emerald-500 to-green-600",
                        change: "+23%",
                        changeType: "positive",
                        subtext: `Today: PKR ${todayRevenue.toLocaleString()}`
                    },
                    {
                        title: "Total Orders",
                        value: ordersCount || 0,
                        icon: ShoppingCart,
                        color: "from-blue-500 to-indigo-600",
                        change: "+12%",
                        changeType: "positive",
                        subtext: `${pendingOrders} pending`
                    },
                    {
                        title: "Total Customers",
                        value: usersCount || 0,
                        icon: Users,
                        color: "from-violet-500 to-purple-600",
                        change: "+18%",
                        changeType: "positive",
                        subtext: "Registered users"
                    },
                    {
                        title: "Total Products",
                        value: productsCount || 0,
                        icon: Package,
                        color: "from-orange-500 to-red-500",
                        change: "+5%",
                        changeType: "positive",
                        subtext: `${lowStockProducts.length} low stock`
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-0.5 ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {stat.changeType === 'positive' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Recent Orders</h3>
                                <p className="text-xs text-slate-500">Latest customer orders</p>
                            </div>
                        </div>
                        <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentOrders?.map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                                        {(order.profiles?.full_name || order.profiles?.email || 'G')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">
                                            #{order.order_number || order.id.slice(0, 8)}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.profiles?.full_name || order.profiles?.email || 'Guest'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-slate-900">PKR {order.total?.toLocaleString()}</p>
                                    <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {(!recentOrders || recentOrders.length === 0) && (
                            <div className="p-8 text-center text-slate-500">
                                <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Stock Alerts</h3>
                                <p className="text-xs text-slate-500">Items needing attention</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert Summary */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                        <div className="bg-red-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
                            <p className="text-xs text-red-600">Out of Stock</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
                            <p className="text-xs text-orange-600">Low Stock</p>
                        </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2 max-h-60 overflow-y-auto">
                        {lowStockProducts.slice(0, 5).map((product: any) => (
                            <div key={product.id} className={`flex items-center justify-between p-3 rounded-xl ${(product.inventory?.[0]?.quantity || 0) === 0 ? 'bg-red-50' : 'bg-orange-50'
                                }`}>
                                <div className="min-w-0 flex-1 mr-2">
                                    <p className="font-medium text-sm truncate text-slate-900">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.sku}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${(product.inventory?.[0]?.quantity || 0) === 0
                                        ? 'bg-red-500 text-white'
                                        : 'bg-orange-500 text-white'
                                    }`}>
                                    {product.inventory?.[0]?.quantity || 0}
                                </span>
                            </div>
                        ))}
                        {lowStockProducts.length === 0 && (
                            <div className="text-center py-6 text-slate-500">
                                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                                <p className="text-sm font-medium">All products well stocked!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Recent Products</h3>
                                <p className="text-xs text-slate-500">Latest additions to your catalog</p>
                            </div>
                        </div>
                        <Link href="/admin/products" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {topProducts?.map((product: any, index: number) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-slate-200 text-slate-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="h-5 w-5 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.category?.name}</p>
                                </div>
                                <p className="text-sm font-bold text-primary">PKR {product.price?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Customers */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Recent Customers</h3>
                                <p className="text-xs text-slate-500">New registrations</p>
                            </div>
                        </div>
                        <Link href="/admin/customers" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentUsers?.map((user: any) => (
                            <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow">
                                    {(user.full_name || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name || 'No Name'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <p className="text-xs text-slate-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {(!recentUsers || recentUsers.length === 0) && (
                            <div className="p-8 text-center text-slate-500">
                                <Users className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No customers yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
