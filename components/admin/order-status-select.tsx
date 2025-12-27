"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import { toast } from "sonner";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();

    const getStatusColor = (s: string) => {
        switch (s) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "processing":
                return "bg-blue-100 text-blue-700";
            case "dispatched":
                return "bg-indigo-100 text-indigo-700";
            case "confirmed":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const handleChange = (newStatus: string) => {
        setStatus(newStatus);
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.error) {
                toast.error("Failed to update status", { description: result.error });
                setStatus(currentStatus); // Revert
            } else {
                toast.success("Order status updated!");
            }
        });
    };

    return (
        <select
            value={status}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPending}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} border-0 focus:outline-none cursor-pointer disabled:opacity-50`}
        >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
        </select>
    );
}
