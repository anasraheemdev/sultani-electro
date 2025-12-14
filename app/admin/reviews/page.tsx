import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { approveReview } from "@/app/actions/reviews";
import { format } from "date-fns";

export default async function AdminReviewsPage() {
    const supabase = await createClient();

    const { data: reviews } = await supabase
        .from("reviews")
        .select(`
            *,
            user:users (full_name, email),
            product:products (name, slug)
        `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Product Reviews</h2>
                <p className="text-gray-500">Manage customer product reviews</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews?.map((review: any) => (
                    <Card key={review.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex gap-1">
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
                                        <Badge
                                            variant={
                                                review.is_approved ? "default" : "secondary"
                                            }
                                        >
                                            {review.is_approved ? "Approved" : "Pending"}
                                        </Badge>
                                        {review.is_verified_purchase && (
                                            <Badge className="bg-green-100 text-green-800">
                                                Verified Purchase
                                            </Badge>
                                        )}
                                    </div>

                                    <a
                                        href={`/products/${review.product.slug}`}
                                        className="font-semibold text-lg hover:text-primary"
                                    >
                                        {review.product.name}
                                    </a>

                                    <p className="text-gray-700 mt-3">{review.comment}</p>

                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                        <span>
                                            By: <strong>{review.user.full_name}</strong>
                                        </span>
                                        <span>•</span>
                                        <span>{format(new Date(review.created_at), "PPp")}</span>
                                    </div>
                                </div>

                                {!review.is_approved && (
                                    <form action={async () => {
                                        "use server";
                                        await approveReview(review.id);
                                    }}>
                                        <Button type="submit" size="sm">
                                            Approve
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
