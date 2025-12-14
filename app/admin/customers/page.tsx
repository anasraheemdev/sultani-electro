import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default async function AdminCustomersPage() {
    const supabase = await createClient();

    const { data: users } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    // Get order counts for each user
    const usersWithOrders = await Promise.all(
        (users || []).map(async (user) => {
            const { count } = await supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            const { data: orders } = await supabase
                .from("orders")
                .select("total")
                .eq("user_id", user.id);

            const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

            return { ...user, orderCount: count || 0, totalSpent };
        })
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Customers</h2>
                <p className="text-gray-500">Manage your customer base</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Total Spent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {usersWithOrders.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{user.full_name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{user.phone || "N/A"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold">{user.orderCount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold">
                                                {formatPrice(user.totalSpent)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">
                                                {format(new Date(user.created_at), "PP")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.is_banned ? "destructive" : "default"}>
                                                {user.is_banned ? "Banned" : "Active"}
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
