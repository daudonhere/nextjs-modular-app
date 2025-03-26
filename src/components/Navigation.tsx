'use client';

import React, { useEffect, useState } from "react";
import ModuleComponent from "@/hooks/useModules";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useModuleStore } from "@/store/useModuleStore";
import { CircularLoadingComponent } from "@/components/Loading";
import { LayoutDashboard, Component, User2, LogIn, LogOut } from 'lucide-react';
import { MenuItemTypes } from "@/types/Navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, trigerLogout, resetAuth } = useAuthStore();
  const { fetchAllModules, fetchActiveModules, resetModule } = useModuleStore();
  const { role, roles, userRoles, userRole, fetchRole, fetchRoles, resetRoles } = useRoleStore();
  
  const [hasFetchedRoles, setHasFetchedRoles] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<Record<string, boolean>>({});
  
  const isAdmin = role?.rolename === "administrator" || roles?.some(r => r.rolename === "administrator");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hasFetchedRoles && (userRole || (userRoles?.length ?? 0) > 0)) {
          const roleIds = userRoles ? userRoles.map(r => r.role) : [userRole?.role ?? 0];
          if (roleIds.length === 1) {
            await fetchRole(roleIds[0]);
          } else if (roleIds.length > 1) {
            await fetchRoles(roleIds);
          }
          setHasFetchedRoles(true);
        }
        await Promise.all([fetchAllModules(), fetchActiveModules()]);
      } catch (err) {
        console.error((err as Error).message);
      }
    };
    fetchData();
  }, [fetchActiveModules, fetchAllModules, fetchRole, fetchRoles, hasFetchedRoles, userRole, userRoles]);  

  const handleNavigation = async (path: string) => {
    setLoadingButtons(prev => ({ ...prev, [path]: true }));
    setTimeout(() => {
      router.push(path);
      setLoadingButtons(prev => ({ ...prev, [path]: false }));
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      setLoadingButtons(prev => ({ ...prev, logout: true }));
      await trigerLogout();
      resetAuth();
      resetRoles();
      resetModule();
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingButtons(prev => ({ ...prev, logout: false }));
    }
  };

  const menuItems: MenuItemTypes[] = [
    { name: "Module Setting", path: "/dashboard/module", icon: <Component color="#eeeef8" /> },
    ...(isAdmin ? [{ name: "User Setting", path: "/dashboard/user", icon: <User2 color="#eeeef8" /> }] : []),
    isAuthenticated
      ? { name: "Logout", path: "logout", icon: <LogOut color="#eeeef8" />, action: handleLogout }
      : { name: "Login", path: "/login", icon: <LogIn color="#eeeef8" /> }
  ];

  return (
    <nav>
      <ul className="space-y-2 gap-8">
        <li key="dashboard" className={`flex flex-row items-center px-4 ml-2 h-12 text-netral ${pathname === "/dashboard" ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}>
          <LayoutDashboard color="#eeeef8" />
          <button 
            onClick={() => handleNavigation("/dashboard")}
            disabled={loadingButtons["/dashboard"]}
            className={`w-full relative flex items-center text-md font-semibold font-roboto px-4 py-2 text-left hover:text-netralH ${pathname === "/dashboard" ? "text-netralH" : ""}`}
          >
            <span className={`${loadingButtons["/dashboard"] ? "opacity-0" : "opacity-100"}`}>Dashboard</span>
            {loadingButtons["/dashboard"] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularLoadingComponent />
              </div>
            )}
          </button>
        </li>
        <ModuleComponent />
        {menuItems.map(({ name, path, icon, action }) => (
          <li key={path} className={`flex flex-row items-center px-4 ml-2 h-12 text-netral ${pathname === path ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}>
            {icon}
            <button 
              onClick={() => action ? action() : handleNavigation(path)}
              disabled={loadingButtons[path]}
              className={`w-full relative flex items-center text-md font-semibold font-roboto px-4 py-2 text-left hover:text-netralH ${pathname === path ? "text-netralH" : ""}`}
            >
              <span className={`${loadingButtons[path] ? "opacity-0" : "opacity-100"}`}>{name}</span>
              {loadingButtons[path] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CircularLoadingComponent />
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
