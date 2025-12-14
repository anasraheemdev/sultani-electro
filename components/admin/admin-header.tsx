"use client";

import { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
    user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="bg-white border-b px-6 py-4 ml-64">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{user.email}</span>
                </div>
            </div>
        </header>
    );
}
