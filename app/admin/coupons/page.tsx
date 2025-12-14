import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default async function AdminCouponsPage() {
    const supabase = await createClient();

    const { data: coupons } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Discount Coupons</h2>
                    <p className="text-gray-500">Manage discount codes</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coupon
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Discount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Min Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Usage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Valid Until
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {coupons?.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-semibold">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{coupon.description}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold">
                                                {coupon.discount_type === "percentage"
                                                    ? `${coupon.discount_value}%`
                                                    : formatPrice(coupon.discount_value)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">
                                                {coupon.min_order_amount
                                                    ? formatPrice(coupon.min_order_amount)
                                                    : "None"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">
                                                {coupon.used_count}
                                                {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">
                                                {coupon.end_date
                                                    ? format(new Date(coupon.end_date), "PP")
                                                    : "No expiry"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={coupon.is_active ? "default" : "secondary"}>
                                                {coupon.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
