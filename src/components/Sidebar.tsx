'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useModuleStore } from "@/store/useModuleStore";
import { useStatusStore } from "@/store/useStatusStore";
import Spinner from '@/components/Spinner';
import { motion } from 'framer-motion';
import useAnimationComponents from '@/services/useAnimation';
import { 
  LayoutDashboard, Package, ChevronDown,
  ChevronUp, Component, Settings, Settings2,
  X, LogIn, LogOut, UserCog
   } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebarStore();
  const { userId, isAuthenticated, trigerLogout, resetAuth } = useAuthStore();
  const { activeModules, fetchAllModules, fetchActiveModules, resetModule } = useModuleStore();
  const { ref, leftControls, leftVariants } = useAnimationComponents();
  const { role, roles, userRole, userRoles, fetchRole, fetchRoles, fetchUserRole, resetRoles } = useRoleStore();
  const [hasFetchedRoles, setHasFetchedRoles] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const { isLoading, setLoading } = useStatusStore();
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  const isAdmin = role?.rolename === "administrator" || roles?.some(r => r.rolename === "administrator");
  const isAdminManager = ["administrator", "manager"].includes(role?.rolename ?? "") || 
    roles?.some(r => ["administrator", "manager"].includes(r.rolename ?? ""));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!userRole && !userRoles) {
          await fetchUserRole(Number(userId));
        }
        if (!hasFetchedRoles && (userRole || (userRoles && userRoles.length > 0))) {
          let roleIds: number[] = userRoles ? userRoles.map(r => r.role) : [userRole?.role ?? 0];
          if (roleIds.length === 1) await fetchRole(roleIds[0]);
          else if (roleIds.length > 1) await fetchRoles(roleIds);
          setHasFetchedRoles(true);
        }
        await Promise.all([fetchAllModules(), fetchActiveModules()]);
      } catch (err) {
        console.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, userRole, JSON.stringify(userRoles), hasFetchedRoles]);

  const handleLogout = async () => {
    try {
      setLoadingButton(true);
      await trigerLogout();
      resetAuth();
      resetRoles();
      resetModule();
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingButton(false);
    }
  };


  const handleLogin = async () => {
    setLoadingButton(true);
    setTimeout(() => router.push('/login'), 1500);
    setLoadingButton(false);
  };

  const toggleDropdown = (moduleId: number) => {
    setOpenDropdowns(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1.5 }}
      animate={leftControls}
      variants={leftVariants}
    >
      <aside
        className={`fixed bg-secondaryB h-full inset-y-0 left-0 w-56 transform transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <div className="flex flex-row gap-12 justify-center items-center h-16">
          <h2 className="text-xl font-bold font-roboto">Dashboard</h2>
          <button onClick={() => setIsOpen(false)} className="text-netral text-xl md:hidden">
          <X color="#eeeef8" size={18} /> 
          </button>
        </div>
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <Spinner/>
          </div>
        ) : (
          <nav>
            <ul className="space-y-2 gap-8">
              <li className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                ${pathname === "/" ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}
              >
                <LayoutDashboard color="#eeeef8" />
                <Link href="/" className="w-full px-3 py-2 text-md justify-center font-semibold font-roboto hover:text-netralH">Dashboard</Link>
              </li>

              {Array.isArray(activeModules) && activeModules.map((module) => (
                <li key={module.id}>
                  <div className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                    ${pathname === `/module/${module.name}` || pathname === `/module/${module.name}/setting` 
                      ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}
                  >
                    <Package color="#eeeef8" />
                    <button
                      onClick={() => toggleDropdown(module.id)}
                      className={`
                        w-full flex justify-between text-md font-semibold font-roboto items-center px-4 py-2 text-left hover:text-netralH
                        ${pathname === `/module/${module.name}` ? "text-netralH " : ""}`}
                    >
                        {capitalize(module.name)}
                      <span>{openDropdowns[module.id] ? <ChevronUp color="#eeeef8" size={20}/> : <ChevronDown color="#eeeef8" size={20}/>}</span>
                    </button>
                  </div>
                  {openDropdowns[module.id] && (
                    <ul className="space-y-2 py-2 gap-8">
                      <li className={`flex flex-row items-center px-4 ml-6 h-12 text-netral
                        ${pathname === `/module/${module.name}` ? "text-netralH" : ""}`}
                      >
                        <Component color="#eeeef8"/>
                        <Link href={`/module/${module.name}`} className="w-full px-3 py-2 text-sm justify-center font-semibold font-roboto hover:text-netralH">
                          {capitalize(module.name)} List
                        </Link>
                      </li>
                      {isAdminManager && (
                        <li className={`flex flex-row items-center px-4 ml-6 h-12 text-netral
                          ${pathname === `/module/${module.name}/setting` ? "text-netralH" : ""}`}
                        >
                          <Settings color="#eeeef8"/>
                          <Link href={`/module/${module.name}/setting`} className="w-full px-3 py-2 text-sm justify-center font-semibold font-roboto hover:text-netralH">
                          {capitalize(module.name)} Setting
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {isAdmin && !isLoading && (
              <ul className="space-y-2 gap-8">
                <li className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                  ${pathname === "/module" ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}
                >
                  <Settings2 color="#eeeef8" />
                  <Link href="/module" className="w-full px-3 py-2 text-md justify-center font-semibold font-roboto hover:text-netralH">Modules Setting</Link>
                </li>
                <li className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                  ${pathname === "/user" ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}
                >
                  <UserCog color="#eeeef8" />
                  <Link href="/user" className="w-full px-3 py-2 text-md justify-center font-semibold font-roboto hover:text-netralH">Users Setting</Link>
                </li>
              </ul>
            )}
            <ul className="space-y-2 gap-8">
              {isAuthenticated ? (
                  <div className="flex flex-row items-center px-4 ml-2 h-12 text-netral">
                    <LogOut color="#eeeef8" />
                    <button
                      onClick={handleLogout}
                      disabled={loadingButton}
                      className="w-full flex text-md font-semibold font-roboto px-4 py-2 text-left hover:text-netralH"
                    >
                        {loadingButton ? <Spinner /> : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-row items-center px-4 ml-2 h-12 text-netral">
                    <LogIn color="#eeeef8" />
                    <button
                      onClick={handleLogin}
                      disabled={loadingButton}
                      className="w-full flex text-md font-semibold font-roboto px-4 py-2 hover:text-netralH"
                    >
                        {loadingButton ? <Spinner /> : "Login"}
                    </button>
                  </div>
                )}
            </ul>
          </nav>
        )}
      </aside>
    </motion.div>
  );
};

export default Sidebar;