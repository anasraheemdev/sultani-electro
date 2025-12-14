import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function OrdersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's orders
    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            order_items(
                quantity,
                price,
                product:products(name, slug, images:product_images(image_url))
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "processing":
                return <Clock className="h-5 w-5 text-blue-500" />;
            default:
                return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

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
        <div className="container-custom py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-semibold">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="font-semibold">PKR {order.total_amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.order_items?.slice(0, 3).map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product?.images?.[0] && (
                                                    <img
                                                        src={item.product.images[0].image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.product?.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">PKR {item.price.toLocaleString()}</p>
                                        </div>
                                    ))}
                                    {order.order_items?.length > 3 && (
                                        <p className="text-sm text-gray-600">
                                            +{order.order_items.length - 3} more items
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        <p>Shipping Address: {order.shipping_address?.address || "N/A"}</p>
                                    </div>
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <Package className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            )}
        </div>
    );
}
