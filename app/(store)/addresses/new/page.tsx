"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewAddressPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const supabase = createClient();

        try {
            // Get current user
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Please log in to add an address");
                router.push("/login?redirect=/addresses/new");
                return;
            }

            // Ensure user exists in users table (fixes foreign key constraint)
            const { error: userError } = await supabase.from("users").upsert(
                {
                    id: user.id,
                    email: user.email || "",
                    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
                },
                { onConflict: "id" }
            );

            if (userError) {
                console.error("Error ensuring user exists:", userError);
                // Continue anyway as the user might already exist
            }

            // Check if this should be the default address
            const isDefault = formData.get("isDefault") === "on";

            // If setting as default, unset other default addresses first
            if (isDefault) {
                await supabase
                    .from("addresses")
                    .update({ is_default: false })
                    .eq("user_id", user.id);
            }

            // Create the new address
            const addressData = {
                user_id: user.id,
                label: formData.get("label") as string,
                full_name: formData.get("fullName") as string,
                phone: formData.get("phone") as string,
                address_line1: formData.get("addressLine1") as string,
                address_line2: (formData.get("addressLine2") as string) || null,
                city: formData.get("city") as string,
                state: formData.get("state") as string,
                postal_code: formData.get("postalCode") as string,
                is_default: isDefault,
            };

            const { error } = await supabase.from("addresses").insert(addressData);

            if (error) throw error;

            toast.success("Address added successfully!");

            // Check if there's a redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get("redirect");

            if (redirect) {
                router.push(redirect);
            } else {
                router.push("/addresses");
            }
        } catch (error: any) {
            console.error("Error adding address:", error);
            toast.error("Failed to add address", {
                description: error.message || "Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/addresses"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Addresses
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Add New Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Address Label */}
                            <FormInput
                                label="Address Label"
                                name="label"
                                placeholder="e.g., Home, Office, Warehouse"
                                required
                            />

                            {/* Full Name */}
                            <FormInput
                                label="Full Name"
                                name="fullName"
                                placeholder="Recipient's full name"
                                required
                            />

                            {/* Phone */}
                            <FormInput
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="e.g., 0300-1234567"
                                required
                            />

                            {/* Address Line 1 */}
                            <FormInput
                                label="Address Line 1"
                                name="addressLine1"
                                placeholder="Street address, house number"
                                required
                            />

                            {/* Address Line 2 */}
                            <FormInput
                                label="Address Line 2 (Optional)"
                                name="addressLine2"
                                placeholder="Apartment, suite, unit, building, floor, etc."
                            />

                            {/* City and State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="City"
                                    name="city"
                                    placeholder="e.g., Lahore"
                                    required
                                />
                                <FormInput
                                    label="Province/State"
                                    name="state"
                                    placeholder="e.g., Punjab"
                                    required
                                />
                            </div>

                            {/* Postal Code */}
                            <FormInput
                                label="Postal Code"
                                name="postalCode"
                                placeholder="e.g., 54000"
                                required
                            />

                            {/* Default Address Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isDefault" className="text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.back()}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Address"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
