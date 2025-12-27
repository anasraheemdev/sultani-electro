import { Metadata } from "next";
import Link from "next/link";
import { Shield, ChevronRight, Lock, Eye, Database, UserCheck, Bell, Trash2, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy - Sultani Solar Energy",
    description: "Read our Privacy Policy to understand how Sultani Solar Energy collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    const lastUpdated = "December 27, 2024";

    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content: [
                "Personal identification information (name, email address, phone number, address)",
                "Payment and billing information",
                "Order history and product preferences",
                "Device and browser information when you visit our website",
                "Communication records when you contact us",
            ],
        },
        {
            icon: Eye,
            title: "How We Use Your Information",
            content: [
                "Process and fulfill your orders",
                "Communicate with you about your orders and inquiries",
                "Send promotional emails (with your consent)",
                "Improve our website and services",
                "Comply with legal obligations",
            ],
        },
        {
            icon: Lock,
            title: "Information Security",
            content: [
                "We use SSL encryption to protect your data",
                "Payment information is processed securely through trusted payment gateways",
                "Access to personal data is restricted to authorized personnel only",
                "Regular security audits and updates",
            ],
        },
        {
            icon: UserCheck,
            title: "Your Rights",
            content: [
                "Access your personal information",
                "Request correction of inaccurate data",
                "Request deletion of your data",
                "Opt-out of marketing communications",
                "Withdraw consent at any time",
            ],
        },
        {
            icon: Globe,
            title: "Cookies & Tracking",
            content: [
                "We use cookies to enhance your browsing experience",
                "Essential cookies for website functionality",
                "Analytics cookies to understand user behavior",
                "You can manage cookie preferences in your browser settings",
            ],
        },
        {
            icon: Bell,
            title: "Third-Party Services",
            content: [
                "Payment processors for secure transactions",
                "Delivery partners for order fulfillment",
                "Analytics providers for website optimization",
                "We do not sell your personal information to third parties",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary mb-4">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Your Privacy Matters</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-300 text-lg">
                            At Sultani Solar Energy, we are committed to protecting your privacy and personal information.
                        </p>
                        <p className="text-gray-400 text-sm mt-4">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="container-custom py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900 font-medium">Privacy Policy</span>
                </nav>
            </div>

            {/* Content */}
            <div className="container-custom py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Sultani Solar Energy (SSE), a project of Electro Sultani Corporation established since 1969,
                            is committed to safeguarding your privacy. This Privacy Policy explains how we collect, use,
                            disclose, and protect your personal information when you use our website and services.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            By using our website at <a href="https://electrosultani.com" className="text-primary hover:underline">electrosultani.com</a> or
                            making purchases from us, you agree to the terms outlined in this policy.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-2">
                                        {section.content.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-2xl p-8 mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
                        <p className="text-gray-600 mb-4">
                            If you have any questions or concerns about our Privacy Policy or how we handle your data,
                            please contact us:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="tel:03227858264"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-gray-900 font-medium hover:shadow-md transition-all"
                            >
                                📞 0322 7858264
                            </a>
                            <a
                                href="mailto:info@sultani.pk"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                            >
                                ✉️ info@sultani.pk
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
