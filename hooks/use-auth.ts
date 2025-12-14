"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const supabase = createClient();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    full_name: session.user.user_metadata?.full_name || "",
                    phone: session.user.user_metadata?.phone || null,
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                    is_banned: false,
                    created_at: session.user.created_at || "",
                    updated_at: session.user.created_at || "",
                });

                // Check if user is admin
                supabase
                    .from("admins")
                    .select("role")
                    .eq("user_id", session.user.id)
                    .single()
                    .then(({ data }) => {
                        setIsAdmin(!!data);
                    });
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    full_name: session.user.user_metadata?.full_name || "",
                    phone: session.user.user_metadata?.phone || null,
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                    is_banned: false,
                    created_at: session.user.created_at || "",
                    updated_at: session.user.created_at || "",
                });

                // Check if user is admin
                supabase
                    .from("admins")
                    .select("role")
                    .eq("user_id", session.user.id)
                    .single()
                    .then(({ data }) => {
                        setIsAdmin(!!data);
                    });
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, setIsAdmin]);

    const signOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        logout();
    };

    return {
        user,
        isAuthenticated,
        isAdmin,
        signOut,
    };
}
