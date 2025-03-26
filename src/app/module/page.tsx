'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import Content from "@/app/module/content";

export default function Module() {

    return (
        <div className="relative flex h-screen">
            <Sidebar />
            <Content />
        </div>
    );
}
