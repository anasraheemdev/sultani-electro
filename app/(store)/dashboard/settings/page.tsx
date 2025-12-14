import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Lock, Bell } from "lucide-react";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container-custom py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
                <p className="text-gray-600">Manage your account preferences</p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Profile Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Full Name</label>
                            <input
                                type="text"
                                defaultValue={user.user_metadata?.full_name || ""}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue={user.user_metadata?.phone || ""}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="+92 300 1234567"
                            />
                        </div>
                        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Email Preferences */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Email Preferences</h2>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                            <span>Order updates and shipping notifications</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                            <span>New products and special offers</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-primary" />
                            <span>Newsletter and blog updates</span>
                        </label>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Security</h2>
                    </div>
                    <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
