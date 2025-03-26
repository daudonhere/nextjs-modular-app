"use client";

import React from "react";
import { motion } from 'framer-motion';
import useAnimationComponents from '@/hooks/useAnimation';
import { useSidebarStore } from "@/store/useSidebarStore";
import { useModuleStore } from "@/store/useModuleStore";
import { useStatusStore } from "@/store/useStatusStore";
import { ModuleTypes } from "@/types/Module";
import Spinner from "@/components/SmallSpinner";

export default function DashboardPage() {
  const { ref, rightControls, rightVariants } = useAnimationComponents();
  const { setIsOpen } = useSidebarStore();
  const { isLoading } = useStatusStore();
  const { activeModules } = useModuleStore();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1.5 }}
      animate={rightControls}
      variants={rightVariants}
      className="flex-1 flex flex-col min-h-screen bg-background"
    >
      <header className=" h-16 p-4 flex justify-between items-center md:px-6">
        <button 
          onClick={() => setIsOpen(true)} 
          className="text-#eeeef8 text-2xl md:hidden"
        >
          ☰
        </button>
      </header>
      <section className="flex flex-1 px-12 py-2">
        <div className="flex flex-1 flex-col h-4/5 items-center justify-center gap-4 text-netral rounded-xl p-6 shadow-lg w-full mx-auto">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center">Welcome To Dashboard Modular App</h2>
              <h4 className="text-md md:text-lg font-normal text-center">This project uses NextJS & Django Framework</h4>
              {Array.isArray(activeModules) && activeModules.length > 0 ? (
                <h4 className="text-md md:text-lg font-normal text-center">
                  You have {activeModules.map((module: ModuleTypes) => module.name).join(", ")} modules installed
                </h4>
              ) : (
                <h4 className="text-md md:text-lg font-normal text-center">No installed modules found, contact your administrator</h4>
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
}
