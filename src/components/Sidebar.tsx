'use client';

import React from "react";
import useAnimationComponents from '@/hooks/useAnimation';
import Navigation from "./Navigation";
import { motion } from 'framer-motion';
import { useSidebarStore } from "@/store/useSidebarStore";
import { X } from 'lucide-react';

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebarStore();
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1.2 }}
      animate={fadeControls}
      variants={fadeVariants}
    >
        <aside
          className={`fixed bg-secondaryB h-full inset-y-0 left-0 w-56 transform transition-transform duration-300 z-30 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
        >
          <div className="flex flex-row gap-12 justify-center items-center h-16">
            <h2 className="text-xl font-bold font-roboto">Dashboard</h2>
            <button onClick={() => setIsOpen(false)} className="text-netral text-xl md:hidden">
            <X color="#eeeef8" size={18} /> 
            </button>
          </div>
          <Navigation/>
        </aside>
    </motion.div>
  );
};

export default Sidebar;