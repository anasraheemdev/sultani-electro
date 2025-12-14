"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);

    const subtotal = getTotalPrice();
    const deliveryCost = subtotal >= 50000 ? 0 : 500;
    const total = subtotal + deliveryCost;

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();

            if (!authUser) {
                router.push("/login?redirect=/checkout");
                return;
            }

            setUser(authUser);

            // Fetch user data
            const { data: userInfo } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single();

            setUserData(userInfo);

            // Fetch addresses
            const { data: addressList } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", authUser.id)
                .order("is_default", { ascending: false });

            setAddresses(addressList || []);
            setLoading(false);
        }

        loadData();
    }, [router]);

    useEffect(() => {
        if (!loading && items.length === 0) {
            router.push("/cart");
        }
    }, [items, loading, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const supabase = createClient();

        try {
            // Create order
            const orderData = {
                user_id: user.id,
                customer_name: formData.get("customerName") as string,
                customer_email: formData.get("customerEmail") as string,
                customer_phone: formData.get("customerPhone") as string,
                delivery_address_id: formData.get("addressId") as string,
                subtotal,
                delivery_cost: deliveryCost,
                total,
                notes: formData.get("notes") as string || null,
                status: "pending",
            };

            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert(orderData)
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.productId,
                product_name: item.name,
                product_sku: item.slug,
                quantity: item.quantity,
                unit_price: item.discountedPrice || item.price,
                total_price: (item.discountedPrice || item.price) * item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Clear cart
            clearCart();

            // Redirect to success page
            toast.success("Order placed successfully!");
            router.push(`/orders/${order.id}?success=true`);
        } catch (error: any) {
            console.error("Order error:", error);
            toast.error("Failed to place order", {
                description: error.message || "Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormInput
                                label="Full Name"
                                name="customerName"
                                defaultValue={userData?.full_name || ""}
                                required
                            />
                            <FormInput
                                label="Email"
                                name="customerEmail"
                                type="email"
                                defaultValue={userData?.email || ""}
                                required
                            />
                            <FormInput
                                label="Phone Number"
                                name="customerPhone"
                                type="tel"
                                defaultValue={userData?.phone || ""}
                                required
                            />
                        </CardContent>
                    </Card>

                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {addresses && addresses.length > 0 ? (
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label
                                            key={address.id}
                                            className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="radio"
                                                name="addressId"
                                                value={address.id}
                                                defaultChecked={address.is_default}
                                                required
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold">{address.label}</p>
                                                <p className="text-sm text-gray-600">
                                                    {address.full_name} - {address.phone}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.address_line1}
                                                    {address.address_line2 && `, ${address.address_line2}`}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.city}, {address.state} {address.postal_code}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No saved addresses</p>
                                    <Button asChild variant="outline" type="button">
                                        <a href="/addresses/new">Add New Address</a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Notes (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormTextarea
                                label="Special Instructions"
                                name="notes"
                                placeholder="Any special delivery instructions..."
                                rows={4}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>
                                        {deliveryCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(deliveryCost)
                                        )}
                                    </span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                    Payment Method
                                </p>
                                <p className="text-sm text-blue-700">
                                    Cash on Delivery (COD)
                                </p>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={submitting || addresses.length === 0}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                By placing your order, you agree to our terms and conditions
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}

