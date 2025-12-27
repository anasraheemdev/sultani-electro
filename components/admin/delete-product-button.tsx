"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            const result = await deleteProduct(productId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Product deleted successfully");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash2 className={`h-3 w-3 text-red-500 ${loading ? 'animate-pulse' : ''}`} />
        </Button>
    );
}
