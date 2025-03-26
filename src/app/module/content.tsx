"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useModuleStore } from "@/store/useModuleStore";
import { ModuleTypes } from "@/types/Module";
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import useAnimationComponents from '@/services/useAnimation';
import Spinner from '@/components/Spinner';

export default function Content() {
  const { setIsOpen } = useSidebarStore();
  const { 
    modules: rawModules, fetchAllModules, fetchActiveModules,
    installModule, uninstallModule, upgradeModule 
  } = useModuleStore();
  const [loadingInstall, setLoadingInstall] = useState(false);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const modules: ModuleTypes[] = Array.isArray(rawModules) ? rawModules : [];
  const { ref, rightControls, rightVariants } = useAnimationComponents();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const paginatedModules = modules.slice(
    (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
  );

  const handleInstall = async (id: number) => {
      setLoadingInstall(true);
      try {
        await installModule(id);
        setToast({ message: "Module installed successfully!", type: "success" });
        await Promise.all([
          fetchAllModules(),
          fetchActiveModules()
        ]);
        const updatedModules = useModuleStore.getState().activeModules || [];
        const newModule = useModuleStore.getState().modules?.find(module => module.id === id);
        if (newModule && !updatedModules.some(module => module.id === id)) {
          useModuleStore.setState({ activeModules: [...updatedModules, newModule] });
        }
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to install module.", type: "error" });
      } finally {
        setLoadingInstall(false);
      }
    };
    
    
    const handleUninstall = async (id: number) => {
      setLoadingInstall(true);
      try {
        await uninstallModule(id);
        setToast({ message: "Module uninstalled successfully!", type: "success" });
        const updatedModules = useModuleStore.getState().activeModules || [];
        useModuleStore.setState({
          activeModules: updatedModules.filter(module => module.id !== id)
        });
        await Promise.all([
          fetchAllModules(),
          fetchActiveModules()
        ]);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to uninstall module.", type: "error" });
      } finally {
        setLoadingInstall(false);
      }
    };
  
    
    const handleUpgrade = async (id: number) => {
      setLoadingUpgrade(true);
      try {
        await upgradeModule(id);
        setToast({ message: "Module upgraded successfully!", type: "success" });
        await Promise.all([
          fetchAllModules(),
          fetchActiveModules()
        ]);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to upgrade module.", type: "error" });
      } finally {
        setLoadingUpgrade(false);
      }
    };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1.5 }}
      animate={rightControls}
      variants={rightVariants}
      className="flex-1 flex flex-col bg-background min-h-screen px-4 sm:px-6 lg:px-8"
    >
      <header className="h-16 flex justify-between items-center md:px-6">
        <button onClick={() => setIsOpen(true)} className="text-netral text-2xl md:hidden">☰</button>
      </header>
      <section className="flex flex-col h-3/4 gap-4 p-4 md:p-6 lg:p-8 text-netral rounded-xl shadow-lg w-full max-w-7xl mx-auto overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold">Module Management</h2>
        </div>
        <div className="overflow-x-auto border bg-card border-mutted rounded-lg shadow-xl">
          <table className="w-full min-w-max text-sm md:text-lg border border-mutted rounded-lg shadow-xl">
            <thead className="bg-primary text-netral">
              <tr>
                <th className="p-3 border border-mutted text-center">No</th>
                <th className="p-3 border border-mutted text-center">Module</th>
                <th className="p-3 border border-mutted text-center">Status</th>
                <th className="p-3 border border-mutted text-center">Version</th>
                <th className="p-3 border border-mutted text-center">Url</th>
                <th className="p-3 border border-mutted text-center">Action</th>
              </tr>
            </thead>
            <tbody>
            {modules.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-netral text-center">
                  {modules.length === 0 ? <Spinner /> : "No module listed here"}
                </td>
              </tr>
            ) : (
              paginatedModules.map((module: ModuleTypes, index: number) => (
                <tr key={module.id} className="border border-mutted">
                  <td className="p-3 border border-mutted text-center">{index + 1}</td>
                  <td className="p-3 border border-mutted text-center">{module.name}</td>
                  <td className={`p-3 border border-mutted text-center font-medium ${module.installed ? "text-green-400" : "text-red-400"}`}>
                    {module.installed ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3 border border-mutted text-center">{module.version}</td>
                  <td className="p-3 border border-mutted text-center">
                    <Link href={`/module/${module.name}`} className="w-full px-4 py-2 text-sm hover:text-successH">
                      module/{module.name.charAt(0) + module.name.slice(1)}
                    </Link>
                  </td>
                  <td className="flex flex-row gap-2 justify-center p-3 border border-mutted text-center">
                    {module.installed ? (
                      <button
                        disabled={loadingInstall}
                        onClick={() => handleUninstall(module.id)}
                        className="h-8 min-w-24 text-center text-sm font-roboto font-semibold px-4 rounded bg-destructive hover:bg-destructiveH text-netral w-full sm:w-auto"
                      >
                        {loadingInstall ? <Spinner/> : 'Uninstall'}
                      </button>
                    ) : (
                      <button
                        disabled={loadingInstall}
                        onClick={() => handleInstall(module.id)}
                        className="h-8 min-w-24 text-center text-sm font-roboto font-semibold px-4 rounded bg-success hover:bg-successH text-netral w-full sm:w-auto"
                      >
                        {loadingInstall ? <Spinner/> : 'Install'}
                      </button>
                    )}
                    <button
                      disabled={loadingUpgrade}
                      onClick={() => handleUpgrade(module.id)}
                      className="h-8 min-w-24 text-center text-sm font-roboto font-semibold px-4 rounded bg-success hover:bg-successH text-netral w-full sm:w-auto"
                    >
                      {loadingUpgrade ? <Spinner/> : 'Upgrade'}
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 items-center">
          <span className="text-lg font-semibold">{currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`h-8 text-center px-4 rounded ${currentPage === 1 ? "bg-mutted cursor-not-allowed" : "bg-success hover:bg-successH"} text-netral`}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`h-8 text-center px-4 rounded ${currentPage === totalPages ? "bg-mutted cursor-not-allowed" : "bg-success hover:bg-successH"} text-netral`}
          >
            Next
          </button>
        </div>
      </section>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}