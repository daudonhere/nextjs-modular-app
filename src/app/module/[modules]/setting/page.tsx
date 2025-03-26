'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import Content from "./content";

export default function Modules() {

    return (
        <div className="relative flex h-screen">
            <Sidebar />
            <Content />
        </div>
    );
}