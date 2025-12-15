import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { updateOrderStatus } from "@/app/actions/orders";
import Link from "next/link";

export default async function AdminOrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: order } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (*),
            delivery_address:addresses (*)
        `)
        .eq("id", id)
        .single();

    if (!order) {
        notFound();
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            processing: "bg-purple-100 text-purple-800",
            dispatched: "bg-indigo-100 text-indigo-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const statuses = ["pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Order #{order.order_number}</h2>
                    <p className="text-gray-500">
                        Placed on {format(new Date(order.created_at), "PPP")}
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin/orders">Back to Orders</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">Current Status:</span>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </div>

                                <div>
                                    <Label htmlFor="status">Update Status</Label>
                                    <form action={updateOrderStatus.bind(null, id)} className="flex gap-2 mt-2">
                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue={order.status}
                                            className="flex-1 px-3 py-2 border rounded-md"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <Button type="submit">Update</Button>
                                    </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.order_items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start pb-4 border-b last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">
                                                SKU: {item.product_sku}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {formatPrice(item.total_price)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(item.unit_price)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer & Delivery */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{order.customer_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold">{order.customer_phone}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {order.delivery_address && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Delivery Address</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold">{order.delivery_address.full_name}</p>
                                    <p className="text-sm">{order.delivery_address.phone}</p>
                                    <p className="text-sm mt-2">
                                        {order.delivery_address.address_line1}
                                        {order.delivery_address.address_line2 && `, ${order.delivery_address.address_line2}`}
                                    </p>
                                    <p className="text-sm">
                                        {order.delivery_address.city}, {order.delivery_address.state}{" "}
                                        {order.delivery_address.postal_code}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {order.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{order.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery</span>
                                <span>
                                    {order.delivery_cost === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        formatPrice(order.delivery_cost)
                                    )}
                                </span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(order.discount_amount)}</span>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(order.total)}</span>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mt-4">
                                <p className="text-sm font-semibold text-blue-900">
                                    Payment Method
                                </p>
                                <p className="text-sm text-blue-700">Cash on Delivery</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
