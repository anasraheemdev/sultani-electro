import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function AddressesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's addresses
    const { data: addresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

    return (
        <div className="container-custom py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Addresses</h1>
                    <p className="text-gray-600">Manage your shipping addresses</p>
                </div>
                <Link
                    href="/dashboard/addresses/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Address
                </Link>
            </div>

            {addresses && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address: any) => (
                        <div
                            key={address.id}
                            className={`bg-white rounded-2xl p-6 shadow-lg ${address.is_default ? "border-2 border-primary" : ""
                                }`}
                        >
                            {address.is_default && (
                                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                    Default
                                </span>
                            )}
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg mb-1">{address.full_name}</p>
                                    <p className="text-gray-700">{address.address}</p>
                                    <p className="text-gray-700">
                                        {address.city}, {address.state} {address.postal_code}
                                    </p>
                                    <p className="text-gray-600 mt-2">{address.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                                    Edit
                                </button>
                                {!address.is_default && (
                                    <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <MapPin className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Addresses Yet</h2>
                    <p className="text-gray-600 mb-6">Add a shipping address for faster checkout</p>
                    <Link
                        href="/dashboard/addresses/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Your First Address
                    </Link>
                </div>
            )}
        </div>
    );
}
