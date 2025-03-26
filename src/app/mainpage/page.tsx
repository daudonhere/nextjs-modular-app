'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import Content from "@/app/mainpage/content";

export default function MainPage() {
    
    return (
        <div className="relative flex h-screen">
            <Sidebar />
            <Content />
        </div>
    );
}