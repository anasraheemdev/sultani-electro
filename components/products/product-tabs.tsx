"use client";

import { useState } from "react";

interface ProductTabsProps {
    description: string;
    features: string[] | null;
    specifications: Record<string, any> | null;
}

export function ProductTabs({ description, features, specifications }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

    return (
        <div className="mt-16">
            {/* Tab Headers */}
            <div className="border-b mb-8">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`pb-4 border-b-2 font-semibold transition-colors ${activeTab === "description"
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-600 hover:text-primary"
                            }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab("specifications")}
                        className={`pb-4 border-b-2 font-semibold transition-colors ${activeTab === "specifications"
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-600 hover:text-primary"
                            }`}
                    >
                        Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`pb-4 border-b-2 font-semibold transition-colors ${activeTab === "reviews"
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-600 hover:text-primary"
                            }`}
                    >
                        Reviews
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="prose max-w-none">
                {/* Description Tab */}
                {activeTab === "description" && (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {description}
                        </p>

                        {/* Features List */}
                        {features && features.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-xl font-bold mb-4">Key Features</h4>
                                <ul className="space-y-2">
                                    {features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-primary mt-1 font-bold">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Specifications Tab */}
                {activeTab === "specifications" && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                        {specifications && Object.keys(specifications).length > 0 ? (
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="flex border-b border-gray-200 pb-3">
                                            <span className="font-semibold text-gray-900 capitalize w-1/2">
                                                {key.replace(/_/g, " ")}:
                                            </span>
                                            <span className="text-gray-700 w-1/2">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">No specifications available for this product.</p>
                        )}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

                        {/* Average Rating */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-primary mb-2">4.8</div>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-amber-400 text-xl">★</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">Based on 24 reviews</p>
                                </div>
                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-3 mb-2">
                                            <span className="text-sm w-8">{rating} ★</span>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400"
                                                    style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 w-12">
                                                {rating === 5 ? "19" : rating === 4 ? "4" : "1"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sample Reviews */}
                        <div className="space-y-6">
                            {[
                                {
                                    name: "Ahmed Khan",
                                    rating: 5,
                                    date: "2 weeks ago",
                                    comment: "Excellent product! Works perfectly and the quality is outstanding. Highly recommended for anyone looking for reliable solar solutions.",
                                },
                                {
                                    name: "Fatima Ali",
                                    rating: 5,
                                    date: "1 month ago",
                                    comment: "Great value for money. Installation was smooth and the product has been performing exceptionally well.",
                                },
                                {
                                    name: "Hassan Raza",
                                    rating: 4,
                                    date: "2 months ago",
                                    comment: "Good product overall. Delivery was on time and packaging was secure. Would buy again.",
                                },
                            ].map((review, index) => (
                                <div key={index} className="border-b border-gray-200 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={i < review.rating ? "text-amber-400" : "text-gray-300"}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
