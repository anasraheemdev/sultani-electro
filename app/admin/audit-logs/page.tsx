import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminAuditLogsPage() {
    const supabase = await createClient();

    const { data: logs } = await supabase
        .from("audit_logs")
        .select(`
            *,
            admin:admins (
                user:users (full_name, email)
            )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    const getActionColor = (action: string) => {
        const colors: Record<string, string> = {
            create: "bg-green-100 text-green-800",
            update: "bg-blue-100 text-blue-800",
            delete: "bg-red-100 text-red-800",
            login: "bg-purple-100 text-purple-800",
        };
        return colors[action] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Audit Logs</h2>
                <p className="text-gray-500">Track all admin actions and changes</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Entity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        IP Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {logs?.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="text-sm">
                                                {format(new Date(log.created_at), "PPp")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {log.admin?.user?.full_name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {log.admin?.user?.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={getActionColor(log.action)}>
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">
                                                {log.entity_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {log.description}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-500">
                                                {log.ip_address || "N/A"}
                                            </span>
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
