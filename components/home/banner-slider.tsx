"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    button_text: string | null;
}

export function BannerSlider() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBanners() {
            const supabase = createClient();
            const { data } = await supabase
                .from("banners")
                .select("*")
                .eq("is_active", true)
                .order("display_order", { ascending: true });

            if (data) {
                setBanners(data);
            }
            setLoading(false);
        }

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    if (loading) {
        return (
            <div className="relative h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-lg" />
        );
    }

    if (banners.length === 0) {
        return null;
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group">
            {/* Banner Image */}
            <div className="absolute inset-0">
                <Image
                    src={currentBanner.image_url}
                    alt={currentBanner.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            {currentBanner.title}
                        </h2>
                        {currentBanner.subtitle && (
                            <p className="text-lg md:text-xl mb-6 opacity-90">
                                {currentBanner.subtitle}
                            </p>
                        )}
                        {currentBanner.link_url && currentBanner.button_text && (
                            <Button asChild size="lg">
                                <Link href={currentBanner.link_url}>
                                    {currentBanner.button_text}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? "bg-white w-8"
                                    : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
