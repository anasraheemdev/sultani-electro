import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            order_items(
                quantity,
                unit_price,
                total_price,
                product_name
            ),
            delivery_address:addresses(full_name, phone, address_line1, city)
        `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Orders</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage customer orders</p>
            </div>

            {/* Search and Filters - Responsive */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                    <select className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                        <option>All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders - Mobile Cards / Desktop Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders?.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <span className="font-mono text-sm">{order.order_number || `#${order.id.slice(0, 8)}`}</span>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-semibold text-sm">{order.customer_name || order.delivery_address?.full_name || "N/A"}</p>
                                            <p className="text-xs text-gray-600">{order.customer_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        {order.order_items?.length || 0} items
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-semibold">PKR {order.total?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <OrderStatusSelect
                                            orderId={order.id}
                                            currentStatus={order.status}
                                        />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y">
                    {orders?.map((order: any) => (
                        <div key={order.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-mono font-semibold text-sm">{order.order_number || `#${order.id.slice(0, 8)}`}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <OrderStatusSelect
                                    orderId={order.id}
                                    currentStatus={order.status}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{order.customer_name || order.delivery_address?.full_name || "N/A"}</p>
                                    <p className="text-xs text-gray-500">{order.order_items?.length || 0} items</p>
                                </div>
                                <p className="font-bold">PKR {order.total?.toLocaleString()}</p>
                            </div>
                            <Link href={`/admin/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {(!orders || orders.length === 0) && (
                    <div className="p-8 text-center text-gray-500">
                        <p>No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
