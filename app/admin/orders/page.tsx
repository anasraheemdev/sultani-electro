import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            order_items(
                quantity,
                price,
                product:products(name)
            )
        `)
        .order("created_at", { ascending: false });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "processing":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Orders</h1>
                    <p className="text-gray-600">Manage customer orders</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders?.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-sm">{order.shipping_address?.full_name || "N/A"}</p>
                                        <p className="text-xs text-gray-600">{order.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {order.order_items?.length || 0} items
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold">PKR {order.total_amount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        defaultValue={order.status}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} border-0 focus:outline-none`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
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
        </div>
    );
}
