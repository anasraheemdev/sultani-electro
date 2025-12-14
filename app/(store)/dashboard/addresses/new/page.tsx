"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewAddressPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Please login to add an address');
                router.push('/login');
                return;
            }

            const { error } = await supabase
                .from('addresses')
                .insert({
                    user_id: user.id,
                    full_name: formData.get('full_name'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postal_code: formData.get('postal_code'),
                    country: formData.get('country') || 'Pakistan',
                    is_default: formData.get('is_default') === 'on',
                });

            if (error) throw error;

            toast.success('Address added successfully!');
            router.push('/dashboard/addresses');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add address');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/addresses">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Add New Address</h1>
                    <p className="text-gray-600">Add a shipping address</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Full Name *</label>
                            <input
                                type="text"
                                name="full_name"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="+92 300 1234567"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Address *</label>
                            <textarea
                                name="address"
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="House/Flat No, Street, Area"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">City *</label>
                            <input
                                type="text"
                                name="city"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Lahore"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">State/Province *</label>
                            <input
                                type="text"
                                name="state"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Punjab"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Postal Code *</label>
                            <input
                                type="text"
                                name="postal_code"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="54000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Country</label>
                            <input
                                type="text"
                                name="country"
                                defaultValue="Pakistan"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_default" className="w-4 h-4" />
                            <span className="text-sm font-semibold">Set as default address</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Address'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/addresses')}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
