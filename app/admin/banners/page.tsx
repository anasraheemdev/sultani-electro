import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default async function AdminBannersPage() {
    const supabase = await createClient();

    const { data: banners } = await supabase
        .from("banners")
        .select("*")
        .order("display_order");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Banners</h2>
                    <p className="text-gray-500">Manage homepage banners</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {banners?.map((banner) => (
                    <Card key={banner.id}>
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={banner.image_url}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold">{banner.title}</h3>
                                            {banner.subtitle && (
                                                <p className="text-sm text-gray-500">{banner.subtitle}</p>
                                            )}
                                        </div>
                                        <Badge variant={banner.is_active ? "default" : "secondary"}>
                                            {banner.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Display Order</p>
                                            <p className="font-semibold">{banner.display_order}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Link URL</p>
                                            <p className="font-semibold">{banner.link_url || "N/A"}</p>
                                        </div>
                                        {banner.start_date && (
                                            <div>
                                                <p className="text-gray-500">Start Date</p>
                                                <p className="font-semibold">
                                                    {format(new Date(banner.start_date), "PP")}
                                                </p>
                                            </div>
                                        )}
                                        {banner.end_date && (
                                            <div>
                                                <p className="text-gray-500">End Date</p>
                                                <p className="font-semibold">
                                                    {format(new Date(banner.end_date), "PP")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
