'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import { LinearLoadingComponent } from "@/components/Loading";
import { useStatusStore } from "@/store/useStatusStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, setLoading} = useStatusStore();
    const { userId } = useAuthStore();
    const { userRole, userRoles, fetchUserRole } = useRoleStore();

    React.useEffect(() => {
        setLoading(true);
        const fetchRoleData= async () => {
            try {
                if (!userRole && !userRoles) {
                    await fetchUserRole(Number(userId));
                }
            } catch (err) {
                console.error((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchRoleData();
    }, [fetchUserRole, setLoading, userId, userRole, userRoles]);  
    
    return (
        <React.Fragment>
            { isLoading ? (
                <LinearLoadingComponent/>
            ) : (
                <div className="relative flex h-screen">
                    <Sidebar />
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            )}
        </React.Fragment>  
    );
}
