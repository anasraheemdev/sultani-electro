import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    const { data: orders, count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

    const { data: addresses, count: addressesCount } = await supabase
        .from("addresses")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold">{userData?.full_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{userData?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold">{userData?.phone || "Not provided"}</p>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>

                {/* Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            My Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary mb-2">
                            {ordersCount || 0}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Total orders placed</p>
                        <Button asChild className="w-full">
                            <Link href="/orders">View All Orders</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Addresses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Saved Addresses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary mb-2">
                            {addressesCount || 0}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Delivery addresses</p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/addresses">Manage Addresses</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild variant="outline">
                        <Link href="/orders">My Orders</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/addresses">Addresses</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                    <form action={logout}>
                        <Button type="submit" variant="outline" className="w-full">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
