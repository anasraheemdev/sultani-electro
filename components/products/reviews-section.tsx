"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface ReviewsSectionProps {
    productId: string;
    reviews: Array<{
        id: string;
        rating: number;
        comment: string;
        created_at: string;
        user: {
            full_name: string;
        };
    }>;
}

export function ReviewsSection({ productId, reviews }: ReviewsSectionProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }

        setSubmitting(true);
        // Submit review logic here
        setSubmitting(false);
        setComment("");
        setRating(5);
    };

    return (
        <div className="space-y-6">
            {/* Average Rating */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                            <div className="flex gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.round(averageRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Write Review */}
            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            <Star
                                                className={`h-8 w-8 cursor-pointer ${star <= (hoveredRating || rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <FormTextarea
                                label="Your Review"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                required
                                placeholder="Share your experience with this product..."
                            />

                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold">{review.user.full_name}</p>
                                    <div className="flex gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
