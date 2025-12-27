import { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight, ShoppingBag, CreditCard, Truck, RefreshCw, ShieldCheck, Scale, AlertTriangle, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms & Conditions - Sultani Solar Energy",
    description: "Read our Terms and Conditions to understand the rules and regulations for using Sultani Solar Energy's website and services.",
};

export default function TermsPage() {
    const lastUpdated = "December 27, 2024";

    const sections = [
        {
            icon: ShoppingBag,
            title: "Products & Orders",
            content: [
                "All products are subject to availability",
                "Prices are in Pakistani Rupees (PKR) and may change without notice",
                "Product images are for illustration purposes; actual products may vary slightly",
                "We reserve the right to limit quantities or refuse orders",
                "Orders are confirmed only after payment verification",
            ],
        },
        {
            icon: CreditCard,
            title: "Payment Terms",
            content: [
                "We accept Cash on Delivery (COD), Bank Transfer, JazzCash, and Easypaisa",
                "Full payment is required before dispatch for prepaid orders",
                "All payments are processed securely",
                "Prices include applicable taxes unless otherwise stated",
                "Payment issues may result in order cancellation",
            ],
        },
        {
            icon: Truck,
            title: "Shipping & Delivery",
            content: [
                "Delivery times are estimates and not guaranteed",
                "Risk of loss transfers to buyer upon delivery",
                "Buyer must inspect products upon delivery and report damages immediately",
                "Delivery charges may apply based on location and order value",
                "Free delivery on orders above PKR 50,000 within eligible areas",
            ],
        },
        {
            icon: RefreshCw,
            title: "Returns & Refunds",
            content: [
                "Return requests must be made within 7 days of delivery",
                "Products must be unused, in original packaging, with all accessories",
                "Refunds are processed within 7-14 business days after return approval",
                "Shipping costs for returns are borne by the buyer unless product is defective",
                "Some products may not be eligible for return due to their nature",
            ],
        },
        {
            icon: ShieldCheck,
            title: "Warranty",
            content: [
                "Product warranties are as specified on individual product pages",
                "Warranty covers manufacturing defects only",
                "Physical damage, misuse, or unauthorized modifications void warranty",
                "Warranty claims must be made with proof of purchase",
                "Solar panels typically carry 25-year performance warranty",
            ],
        },
        {
            icon: Scale,
            title: "Limitation of Liability",
            content: [
                "We are not liable for indirect or consequential damages",
                "Our liability is limited to the purchase price of the product",
                "We are not responsible for installation failures by third parties",
                "Force majeure events exempt us from delivery obligations",
                "Product specifications may change without prior notice",
            ],
        },
        {
            icon: AlertTriangle,
            title: "Prohibited Uses",
            content: [
                "Using the website for any unlawful purpose",
                "Attempting to gain unauthorized access to our systems",
                "Submitting false information or impersonating others",
                "Interfering with website functionality",
                "Violating intellectual property rights",
            ],
        },
        {
            icon: MessageCircle,
            title: "Dispute Resolution",
            content: [
                "Any disputes shall be resolved through negotiation first",
                "If unresolved, disputes may be submitted to arbitration",
                "These terms are governed by the laws of Pakistan",
                "Courts in Sialkot shall have exclusive jurisdiction",
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
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Legal Information</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Please read these terms carefully before using our website or making a purchase.
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
                    <span className="text-gray-900 font-medium">Terms & Conditions</span>
                </nav>
            </div>

            {/* Content */}
            <div className="container-custom py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Welcome to Sultani Solar Energy (SSE), a project of Electro Sultani Corporation,
                            established since 1969. By accessing or using our website at{" "}
                            <a href="https://electrosultani.com" className="text-primary hover:underline">electrosultani.com</a>,
                            you agree to be bound by these Terms and Conditions.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            If you do not agree with any part of these terms, please do not use our website or services.
                            We reserve the right to modify these terms at any time, and your continued use of the website
                            constitutes acceptance of any changes.
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

                    {/* Acceptance */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mt-8 text-white">
                        <h2 className="text-xl font-bold mb-4">Acceptance of Terms</h2>
                        <p className="text-gray-300 mb-4">
                            By placing an order or using our services, you acknowledge that you have read, understood,
                            and agree to be bound by these Terms and Conditions.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Electro Sultani Corporation<br />
                            Dara Araian, Mujahid Rd, Rehmat Pura Dara Arain, Sialkot, 51310<br />
                            Phone: 0322 7858264
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-2xl p-8 mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Questions?</h2>
                        <p className="text-gray-600 mb-4">
                            If you have any questions about these Terms and Conditions, please contact us:
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
