"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuickStockUpdateProps {
    productId: string;
    currentStock: number;
}

export function QuickStockUpdate({ productId, currentStock }: QuickStockUpdateProps) {
    const router = useRouter();
    const [stock, setStock] = useState(currentStock);
    const [inputValue, setInputValue] = useState(currentStock.toString());
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const updateStock = async (newStock: number) => {
        if (newStock === currentStock) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        console.log("Updating stock for product:", productId, "to:", newStock);

        try {
            const response = await fetch("/api/admin/inventory", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: newStock }),
            });

            const result = await response.json();
            console.log("API Response:", result);

            if (!response.ok) {
                throw new Error(result.error || "Failed to update stock");
            }

            setStock(newStock);
            toast.success(`Stock updated to ${newStock}`);
            router.refresh();
        } catch (error: any) {
            console.error("Stock update error:", error);
            toast.error(error.message || "Failed to update stock");
            setInputValue(currentStock.toString());
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleSave = () => {
        const newStock = parseInt(inputValue) || 0;
        updateStock(newStock);
    };

    const handleCancel = () => {
        setInputValue(currentStock.toString());
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg"
                    onClick={() => setInputValue(Math.max(0, parseInt(inputValue) - 1).toString())}
                    disabled={loading || parseInt(inputValue) <= 0}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-16 h-7 text-center text-sm border rounded-lg focus:outline-none focus:border-primary"
                    min="0"
                    disabled={loading}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg"
                    onClick={() => setInputValue((parseInt(inputValue) + 1).toString())}
                    disabled={loading}
                >
                    <Plus className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "..." : <Check className="h-3 w-3" />}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        );
    }

    const displayStock = stock;
    const stockColor = displayStock === 0 ? 'bg-red-100 text-red-700 hover:bg-red-200' :
        displayStock < 10 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
            'bg-green-100 text-green-700 hover:bg-green-200';

    return (
        <button
            onClick={() => {
                setInputValue(stock.toString());
                setIsEditing(true);
            }}
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${stockColor}`}
            title="Click to edit stock"
        >
            {displayStock} units
        </button>
    );
}
