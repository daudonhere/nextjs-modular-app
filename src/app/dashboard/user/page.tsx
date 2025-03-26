"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import useAnimationComponents from '@/hooks/useAnimation';
import { useSidebarStore } from "@/store/useSidebarStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoleStore } from "@/store/useRoleStore";
import Toast from "@/components/Toast";
import Spinner from '@/components/SmallSpinner';
import DetailModal from "./components/DetailModal";
import DeleteModal from "./components/DeleteModal";

export default function UserPage() {
  const { setIsOpen } = useSidebarStore();
  const { user, users, fetchAllUsers, fetchUser } = useUserStore();
  const { roles, userRolesMap, fetchUsersRoles } = useRoleStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const fetchedUserIdsRef = useRef<Set<number>>(new Set());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const { ref, rightControls, rightVariants } = useAnimationComponents();

  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingData(true);
      await fetchAllUsers();
      setFetchingData(false);
    };
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (users.length > 0) {
      const userIds = users.map(user => user.id);
      const newUserIds = userIds.filter(id => !fetchedUserIdsRef.current.has(id));
      if (newUserIds.length > 0) {
        setLoadingRoles(true);
        fetchUsersRoles(newUserIds)
          .then(() => {
            newUserIds.forEach(id => fetchedUserIdsRef.current.add(id));
          })
          .catch(error => {
            console.error("Error fetching roles:", error);
          })
          .finally(() => {
            setLoadingRoles(false);
          });
      }
    }
  }, [JSON.stringify(users)]);  

  const getUserRoles = (userId: number) => {
    if (!roles || !userRolesMap || !(userId in userRolesMap)) {
      return "Loading...";
    }
    const userRoleIds = userRolesMap[userId]?.map(ur => ur.role) || [];
    const roleNames = roles.filter(role => userRoleIds.includes(role.id)).map(role => role.rolename) || [];
    return roleNames.length > 0 ? roleNames.join(", ") : "No Role";
  };
  
  const handleShowDetail = async (id: number) => {
    setLoadingButton(id)
    setSelectedUserId(id);
    await fetchUser(id);
    setIsDetailModalOpen(true);
    setLoadingButton(null)
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
          <h2 className="text-2xl md:text-3xl font-bold">User Management</h2>
          <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-destructive hover:bg-destructiveH text-netral rounded text-sm font-semibold">
            Delete All
          </button>
        </div>
        <div className="overflow-x-auto border bg-card border-mutted rounded-lg shadow-xl">
          <table className="w-full min-w-max text-sm md:text-lg border border-mutted rounded-lg shadow-xl">
            <thead className="bg-primary text-netral">
              <tr>
                <th className="p-3 border border-mutted text-center">No</th>
                <th className="p-3 border border-mutted text-center">Username</th>
                <th className="p-3 border border-mutted text-center">Email</th>
                <th className="p-3 border border-mutted text-center">Roles</th>
                <th className="p-3 border border-mutted text-center">Status</th>
                <th className="p-3 border border-mutted text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-netral text-center">
                    {fetchingData ? <Spinner /> : "No users listed here"}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id} className="border border-mutted">
                    <td className="p-3 border border-mutted text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border border-mutted text-center">{user.username}</td>
                    <td className="p-3 border border-mutted text-center">{user.email}</td>
                    <td className="p-3 border border-mutted text-center">{loadingRoles ? <Spinner /> : getUserRoles(user.id)}</td>
                    <td className="p-3 border border-mutted text-center">{user.is_active ? "Active" : "Inactive"}</td>
                    <td className="p-3 border border-mutted text-center">
                      <button
                        disabled={loadingButton === user.id}
                        onClick={() => handleShowDetail(user.id)}
                        className="h-8 min-w-full text-sm font-semibold font-roboto text-center px-4 rounded bg-success hover:bg-successH text-netral"
                      >
                        {loadingButton === user.id ? <Spinner /> : 'Detail'}
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
      {isDetailModalOpen && user && <DetailModal user={user} onClose={() => setIsDetailModalOpen(false)} />}
      {isDeleteModalOpen && <DeleteModal onClose={() => setIsDeleteModalOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}