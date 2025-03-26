'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen">
            <Sidebar />
            <div className="flex-1">{children}</div>
        </div>
    );
}
