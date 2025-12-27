"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Settings, Store, Mail, Phone, MapPin, Globe,
    Facebook, Instagram, Twitter, Save, RefreshCw,
    CreditCard, Truck, Shield, Bell, Palette, FileText
} from "lucide-react";

interface StoreSettings {
    id?: string;
    store_name: string;
    store_tagline: string;
    store_email: string;
    store_phone: string;
    store_address: string;
    store_city: string;
    store_country: string;
    currency: string;
    currency_symbol: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    whatsapp_number: string;
    free_shipping_threshold: number;
    tax_rate: number;
    enable_reviews: boolean;
    enable_wishlist: boolean;
    enable_coupons: boolean;
    maintenance_mode: boolean;
    meta_title: string;
    meta_description: string;
}

const defaultSettings: StoreSettings = {
    store_name: "SultaniElectro",
    store_tagline: "Pakistan's #1 Solar Energy Provider",
    store_email: "info@sultanielectro.pk",
    store_phone: "+92 300 1234567",
    store_address: "Main Boulevard, Gulberg III",
    store_city: "Lahore",
    store_country: "Pakistan",
    currency: "PKR",
    currency_symbol: "₨",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    whatsapp_number: "",
    free_shipping_threshold: 50000,
    tax_rate: 0,
    enable_reviews: true,
    enable_wishlist: true,
    enable_coupons: true,
    maintenance_mode: false,
    meta_title: "SultaniElectro - Premium Solar Energy Solutions",
    meta_description: "Pakistan's leading solar energy provider. Premium solar panels, inverters, and batteries.",
};

export default function AdminSettingsPage() {
    const supabase = createClient();
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("store_settings")
                .select("*")
                .single();

            if (data) {
                setSettings({ ...defaultSettings, ...data });
            }
        } catch (error) {
            console.log("No settings found, using defaults");
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save settings");
            }

            toast.success("Settings saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof StoreSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const tabs = [
        { id: "general", label: "General", icon: Store },
        { id: "contact", label: "Contact", icon: Phone },
        { id: "social", label: "Social Media", icon: Globe },
        { id: "shipping", label: "Shipping & Tax", icon: Truck },
        { id: "features", label: "Features", icon: Settings },
        { id: "seo", label: "SEO", icon: FileText },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Store Settings</h1>
                    <p className="text-sm sm:text-base text-gray-600">Configure your store preferences</p>
                </div>
                <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 sm:p-6">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Store className="h-5 w-5 text-primary" />
                                General Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        value={settings.store_name}
                                        onChange={(e) => handleChange("store_name", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.store_tagline}
                                        onChange={(e) => handleChange("store_tagline", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Currency</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange("currency", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    >
                                        <option value="PKR">Pakistani Rupee (PKR)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                        <option value="GBP">British Pound (GBP)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Currency Symbol</label>
                                    <input
                                        type="text"
                                        value={settings.currency_symbol}
                                        onChange={(e) => handleChange("currency_symbol", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Settings */}
                    {activeTab === "contact" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={settings.store_email}
                                        onChange={(e) => handleChange("store_email", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={settings.store_phone}
                                        onChange={(e) => handleChange("store_phone", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={settings.store_address}
                                        onChange={(e) => handleChange("store_address", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        value={settings.store_city}
                                        onChange={(e) => handleChange("store_city", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={settings.store_country}
                                        onChange={(e) => handleChange("store_country", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={settings.whatsapp_number}
                                        onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                                        placeholder="+92 300 1234567"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Media Settings */}
                    {activeTab === "social" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Social Media Links
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" /> Facebook URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.facebook_url}
                                        onChange={(e) => handleChange("facebook_url", e.target.value)}
                                        placeholder="https://facebook.com/yourpage"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-pink-600" /> Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.instagram_url}
                                        onChange={(e) => handleChange("instagram_url", e.target.value)}
                                        placeholder="https://instagram.com/yourpage"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Twitter className="h-4 w-4 text-blue-400" /> Twitter URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.twitter_url}
                                        onChange={(e) => handleChange("twitter_url", e.target.value)}
                                        placeholder="https://twitter.com/yourhandle"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping & Tax Settings */}
                    {activeTab === "shipping" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Shipping & Tax
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Free Shipping Threshold (PKR)</label>
                                    <input
                                        type="number"
                                        value={settings.free_shipping_threshold}
                                        onChange={(e) => handleChange("free_shipping_threshold", parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        value={settings.tax_rate}
                                        onChange={(e) => handleChange("tax_rate", parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Applied to all orders</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features Settings */}
                    {activeTab === "features" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                Store Features
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                            <Bell className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Enable Reviews</p>
                                            <p className="text-sm text-gray-500">Allow customers to leave product reviews</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enable_reviews}
                                        onChange={(e) => handleChange("enable_reviews", e.target.checked)}
                                        className="w-5 h-5 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Enable Wishlist</p>
                                            <p className="text-sm text-gray-500">Allow customers to save products to wishlist</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enable_wishlist}
                                        onChange={(e) => handleChange("enable_wishlist", e.target.checked)}
                                        className="w-5 h-5 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Enable Coupons</p>
                                            <p className="text-sm text-gray-500">Allow discount coupon codes at checkout</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enable_coupons}
                                        onChange={(e) => handleChange("enable_coupons", e.target.checked)}
                                        className="w-5 h-5 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <Settings className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-700">Maintenance Mode</p>
                                            <p className="text-sm text-red-500">Disable the storefront for maintenance</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenance_mode}
                                        onChange={(e) => handleChange("maintenance_mode", e.target.checked)}
                                        className="w-5 h-5 rounded border-red-300"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* SEO Settings */}
                    {activeTab === "seo" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                SEO Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={settings.meta_title}
                                        onChange={(e) => handleChange("meta_title", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{settings.meta_title.length}/60 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                                    <textarea
                                        value={settings.meta_description}
                                        onChange={(e) => handleChange("meta_description", e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{settings.meta_description.length}/160 characters</p>
                                </div>

                                {/* SEO Preview */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-2">Google Search Preview:</p>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <p className="text-blue-600 text-lg hover:underline cursor-pointer">{settings.meta_title || "Your Store Title"}</p>
                                        <p className="text-green-700 text-sm">www.sultanielectro.pk</p>
                                        <p className="text-gray-600 text-sm">{settings.meta_description || "Your store description will appear here..."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button (Mobile Sticky) */}
            <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
                <Button onClick={saveSettings} disabled={saving} className="w-full shadow-lg">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
