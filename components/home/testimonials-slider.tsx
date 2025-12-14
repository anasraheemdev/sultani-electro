"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
    id: string;
    customer_name: string;
    customer_title: string | null;
    rating: number;
    comment: string;
}

export function TestimonialsSlider() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTestimonials() {
            const supabase = createClient();
            const { data } = await supabase
                .from("testimonials")
                .select("*")
                .eq("is_active", true)
                .order("display_order");

            if (data) {
                setTestimonials(data);
            }
            setLoading(false);
        }

        fetchTestimonials();
    }, []);

    if (loading || testimonials.length === 0) return null;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-16 bg-primary/5">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-dark text-center mb-12">
                    What Our Customers Say
                </h2>

                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < currentTestimonial.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-lg text-gray-700 text-center mb-6 italic">
                                "{currentTestimonial.comment}"
                            </p>

                            <div className="text-center">
                                <p className="font-semibold text-dark">
                                    {currentTestimonial.customer_name}
                                </p>
                                {currentTestimonial.customer_title && (
                                    <p className="text-sm text-gray-500">
                                        {currentTestimonial.customer_title}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outline" size="icon" onClick={goToPrevious}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                                ? "bg-primary w-8"
                                                : "bg-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <Button variant="outline" size="icon" onClick={goToNext}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
