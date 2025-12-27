import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default async function OrderDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ success?: string }>;
}) {
    const { id } = await params;
    const queryParams = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: order } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                product:products (name, slug)
            ),
            delivery_address:addresses (*)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
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

    return (
        <div className="container mx-auto px-4 py-8">
            {queryParams.success && (
                <Card className="mb-6 border-green-200 bg-green-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-900">
                                    Order Placed Successfully!
                                </h3>
                                <p className="text-sm text-green-700">
                                    Thank you for your order. We'll send you a confirmation email shortly.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
                    <p className="text-gray-500">
                        Placed on {format(new Date(order.created_at), "PPP")}
                    </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                    {order.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.order_items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                                        <div className="flex-1">
                                            <Link
                                                href={`/products/${item.product?.slug}`}
                                                className="font-semibold hover:text-primary"
                                            >
                                                {item.product_name}
                                            </Link>
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

                    {/* Delivery Address */}
                    {order.delivery_address && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">{order.delivery_address.label}</p>
                                <p>{order.delivery_address.full_name}</p>
                                <p>{order.delivery_address.phone}</p>
                                <p className="mt-2">
                                    {order.delivery_address.address_line1}
                                    {order.delivery_address.address_line2 && `, ${order.delivery_address.address_line2}`}
                                </p>
                                <p>
                                    {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                                </p>
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

                            <Button asChild variant="outline" className="w-full mt-4">
                                <Link href="/orders">Back to Orders</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
