import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion } from 'framer-motion';
import { useUserStore } from "@/store/useUserStore";
import { useRoleStore } from "@/store/useRoleStore";
import { UserTypes } from "@/types/User";
import { RoleTypes } from "@/types/Role";
import Toast from "@/components/Toast";
import Spinner from "@/components/SmallSpinner";
import useAnimationComponents from '@/hooks/useAnimation';

interface UpdateModalProps {
  user: UserTypes;
  onClose: () => void;
}

export default function UpdateModal({ user, onClose }: UpdateModalProps) {
  const { fetchAllUsers, updateUser } = useUserStore();
  const { allRoles, fetchAllRoles } = useRoleStore();
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();
  const [updatedUser, setUpdatedUser] = useState<UserTypes>({ ...user });
  const [newPassword, setNewPassword] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!allRoles || allRoles.length === 0) {
      fetchAllRoles();
    }
  }, [fetchAllRoles, allRoles]);

  const getRoleId = (roleName: string): number => {
    return (
      allRoles?.find((role: RoleTypes) => role.rolename.toLowerCase() === roleName.toLowerCase())?.id || 0
    );
  };

  const handleRoleChange = (roleId: number) => {
    setUpdatedUser((prev) => {
      let newRoles: number[] = [...(prev.roles || [])];
      if (newRoles.includes(roleId)) {
        newRoles = newRoles.filter((id) => id !== roleId);
      } else {
        newRoles.push(roleId);
      }
      const isUserSelected = newRoles.includes(getRoleId("user"));
      if (isUserSelected) {
        newRoles = [getRoleId("user")];
      } else {
        newRoles = newRoles.filter((id) => id !== getRoleId("user"));
      }
      return { ...prev, roles: newRoles };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordClick = () => {
    setShowPasswordFields(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingButton(true);
      const finalUserData = newPassword ? { ...updatedUser, password: newPassword } : updatedUser;
      await updateUser(user.id, finalUserData);
      setToast({ message: "User updated successfully", type: "success" });
      setLoadingButton(false);
      await fetchAllUsers()
      onClose();
    } catch (error) {
      setLoadingButton(false);
      console.error("Update failed:", error);
      setToast({ message: "Update failed", type: "error" });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      animate={fadeControls}
      variants={fadeVariants}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
    >
      <div className="bg-secondaryB p-8 rounded-lg shadow-lg w-full max-w-md text-netral relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-netral hover:text-secondary">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold font-roboto mb-6 text-center">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Username</label>
            <input type="text" name="username" value={updatedUser.username} onChange={handleChange} className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Email</label>
            <input type="email" name="email" value={updatedUser.email} onChange={handleChange} className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Password</label>
            {!showPasswordFields ? (
              <div className="w-full p-2 rounded-lg bg-background items-center text-netral cursor-pointer" onClick={handlePasswordClick}>********</div>
            ) : (
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary" />
                {newPassword && (
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-netral hover:text-netral">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Roles</label>
            <div className="space-y-2">
              {allRoles?.map((role: RoleTypes) => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input type="checkbox" checked={updatedUser.roles?.includes(role.id) || false} onChange={() => handleRoleChange(role.id)} className="w-5 h-5 bg-background border-mutted rounded focus:ring-2 focus:ring-secondary" />
                  <span>{role.rolename}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="is_active" checked={updatedUser.is_active} onChange={handleChange} className="w-5 h-5 bg-background border-mutted rounded focus:ring-2 focus:ring-secondary" />
            <label className="ml-2 text-netral">Active User</label>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="px-6 py-2 min-w-24 bg-success text-netral font-roboto font-semibold rounded hover:bg-successH transition">
              {loadingButton ? <Spinner /> : "Update"}
            </button>
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}
