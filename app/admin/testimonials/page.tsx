import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";

export default async function AdminTestimonialsPage() {
    const supabase = await createClient();

    const { data: testimonials } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Testimonials</h2>
                    <p className="text-gray-500">Manage customer testimonials</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials?.map((testimonial) => (
                    <Card key={testimonial.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < testimonial.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                                    {testimonial.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-700 mb-4 italic">
                                "{testimonial.comment}"
                            </p>

                            <div>
                                <p className="font-semibold">{testimonial.customer_name}</p>
                                {testimonial.customer_title && (
                                    <p className="text-sm text-gray-500">
                                        {testimonial.customer_title}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                Display Order: {testimonial.display_order}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
