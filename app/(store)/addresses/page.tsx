import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function AddressesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: addresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Addresses</h1>
                <Button asChild>
                    <Link href="/addresses/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                    </Link>
                </Button>
            </div>

            {!addresses || addresses.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No saved addresses</h2>
                        <p className="text-gray-500 mb-6">
                            Add a delivery address to make checkout faster
                        </p>
                        <Button asChild>
                            <Link href="/addresses/new">Add Address</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <Card key={address.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{address.label}</CardTitle>
                                    {address.is_default && (
                                        <Badge variant="secondary">Default</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <p className="font-semibold">{address.full_name}</p>
                                    <p className="text-sm text-gray-600">{address.phone}</p>
                                    <p className="text-sm text-gray-600">
                                        {address.address_line1}
                                        {address.address_line2 && `, ${address.address_line2}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {address.city}, {address.state} {address.postal_code}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href={`/addresses/${address.id}/edit`}>Edit</Link>
                                    </Button>
                                    <form action="/api/addresses/delete" method="POST" className="flex-1">
                                        <input type="hidden" name="addressId" value={address.id} />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
