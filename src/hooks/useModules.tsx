'use client';

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useModuleStore } from "@/store/useModuleStore";
import { CircularLoadingComponent } from "@/components/Loading";
import { Package, ChevronDown, ChevronUp, Component, Settings } from 'lucide-react';

interface Module {
  id: number;
  name: string;
}

export default function ModuleComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuthStore();
  const { activeModules, fetchAllModules, fetchActiveModules } = useModuleStore();
  const { role, roles, userRole, userRoles, fetchRole, fetchRoles } = useRoleStore();

  const [hasFetchedRoles, setHasFetchedRoles] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  const isAdminManager = ["administrator", "manager"].includes(role?.rolename ?? "") || 
    roles?.some(r => ["administrator", "manager"].includes(r.rolename ?? ""));

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
  }, [fetchActiveModules, fetchAllModules, fetchRole, fetchRoles, hasFetchedRoles, userId, userRole, userRoles]);

  const handleDropdown = (moduleId: number) => {
    setOpenDropdowns(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleNavigation = (moduleName: string, type: 'list' | 'setting') => {
    const key = `${moduleName}-${type}`;
    setLoadingState(prev => ({ ...prev, [key]: true }));

    setTimeout(() => {
      router.push(`/dashboard/module/${moduleName}${type === 'setting' ? "/setting" : ""}`);
      setLoadingState(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  return (
    <React.Fragment>
      {Array.isArray(activeModules) && activeModules.map((module: Module) => (
        <li key={module.id}>
          <div className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
            ${pathname.startsWith(`/dashboard/module/${module.name}`) ? "text-netralH rounded-l-sm border-l-2 border-netral" : ""}`}
          >
            <Package color="#eeeef8" />
            <button
              onClick={() => handleDropdown(module.id)}
              className={`w-full flex justify-between text-md font-semibold font-roboto items-center px-4 py-2 text-left hover:text-netralH
              ${pathname.startsWith(`/dashboard/module/${module.name}`) ? "text-netralH" : ""}`}
            >
              {capitalize(module.name)}
              <span>{openDropdowns[module.id] ? <ChevronUp color="#eeeef8" size={20}/> : <ChevronDown color="#eeeef8" size={20}/>}</span>
            </button>
          </div>
          {openDropdowns[module.id] && (
            <ul className="space-y-2 py-2 gap-8 ml-4">
              <div className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                  ${pathname === `/dashboard/module/${module.name}` ? "text-netralH" : ""}`}
              >
                <Component color="#eeeef8"/>
                <button 
                  onClick={() => handleNavigation(module.name, 'list')}
                  className={`w-full relative flex items-center text-sm font-semibold font-roboto px-4 py-2 
                  text-left hover:text-netralH ${pathname === `/dashboard/module/${module.name}` ? "text-netralH" : ""}`}
                  disabled={loadingState[`${module.name}-list`]}
                >
                  <span className={`${loadingState[`${module.name}-list`] ? "opacity-0" : "opacity-100"}`}>
                    {capitalize(module.name)} List
                  </span>
                  {loadingState[`${module.name}-list`] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularLoadingComponent />
                    </div>
                  )}
                </button>
              </div>
              {isAdminManager && (
                <div className={`flex flex-row items-center px-4 ml-2 h-12 text-netral
                    ${pathname === `/dashboard/module/${module.name}/setting` ? "text-netralH" : ""}`}
                >
                  <Settings color="#eeeef8"/>
                  <button 
                    onClick={() => handleNavigation(module.name, 'setting')}
                    className={`w-full relative flex items-center text-sm font-semibold font-roboto px-4 py-2 
                    text-left hover:text-netralH ${pathname === `/dashboard/module/${module.name}/setting` ? "text-netralH" : ""}`}
                    disabled={loadingState[`${module.name}-setting`]}
                  >
                    <span className={`${loadingState[`${module.name}-setting`] ? "opacity-0" : "opacity-100"}`}>
                      {capitalize(module.name)} Setting
                    </span>
                    {loadingState[`${module.name}-setting`] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CircularLoadingComponent />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </ul>
          )}
        </li>
      ))}
    </React.Fragment>
  );
}