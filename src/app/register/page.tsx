"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useStatusStore } from "@/store/useStatusStore";
import { LinearLoadingComponent, CircularLoadingComponent } from "@/components/Loading";
import { Eye, EyeOff } from 'lucide-react';
import Toast from "@/components/Toast";
import { ChevronDown } from "lucide-react";
import { UserTypes } from "@/types/User";
import { motion } from "framer-motion";
import GridMotion from "@/components/GridMotion";
import useAnimationComponents from "@/hooks/useAnimation";


const items = [
  'TYPESCRIPT', 'MODULAR', 'https://www.svgrepo.com/show/374032/reactjs.svg', 'PYTHON', 'ENGINE',
  'TYPESCRYPT', 'MODULAR', 'https://www.svgrepo.com/show/373554/django.svg', 'TYPESCRYPT',
  'https://www.svgrepo.com/show/374032/reactjs.svg', 'PYTHON', 'ENGINE', 'https://www.svgrepo.com/show/373554/django.svg',
  'TYPESCRYPT', 'MODLAR', 'https://www.svgrepo.com/show/373554/django.svg', 'ENGINE',
  'https://www.svgrepo.com/show/374032/reactjs.svg', 'https://www.svgrepo.com/show/373554/django.svg',
  'MODULAR', 'PYTHON', 'ENGINE', 'https://www.svgrepo.com/show/374032/reactjs.svg', 'TYPESCRYPT'
];


export default function Register() {
  const router = useRouter();
  const { allRoles, fetchAllRoles } = useRoleStore();
  const { createUser } = useUserStore();
  const { isLoading, setLoading } = useStatusStore();
  const [loadingButton, setLoadingButton] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const roles = allRoles ?? [];
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<Partial<UserTypes>>({
    username: "",
    email: "",
    password: "",
    roles: [],
  });

  const { ref, fadeControls, fadeVariants, bottomControls, bottomVariants } = useAnimationComponents();

  useEffect(() => {
    if (roles.length === 0) {
      setLoading(true);
      fetchAllRoles().finally(() => setLoading(false));
    }
  }, [fetchAllRoles, roles.length, setLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "roles" ? [parseInt(value, 10)].filter(Boolean) : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingButton(true)
    await createUser(form);
    const error = useStatusStore.getState().isError;
    if (error) {  
      setToast({ message: error, type: "error" });
      setLoadingButton(false)
    } else {
      setToast({ message: "Registration successful", type: "success" });
      setLoadingButton(false)
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => router.push("/login"), 1000);
        setLoading(false);
    }, 1500);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1 }}
      animate={fadeControls}
      variants={fadeVariants}
      className="relative flex flex-1 items-center justify-center min-h-screen text-netral font-roboto font-semibold"
    >
      <GridMotion items={items} />
      <div className="absolute flex flex-1 w-full h-full bg-black/70 backdrop-blur-md z-10" />
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1.5 }}
        animate={bottomControls}
        variants={bottomVariants}
        className="absolute w-full max-w-md bg-secondaryB p-8 rounded-xl shadow-lg z-20"
      >
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {isLoading && <LinearLoadingComponent />}
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username ?? ""}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-10 rounded-md bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
                name="password"
                value={form.password ?? ""}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-netral"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Role</label>
            <div className="relative">
              <select
                name="roles"
                value={form.roles?.[0] ?? ""}
                onChange={handleChange}
                className="w-full p-3 pr-10 rounded-md bg-background text-netral font-roboto font-semibold focus:outline-none focus:ring-1 focus:ring-secondary appearance-none"
                required
              >
                <option value="">Select Role</option>
                {roles.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.rolename}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-netral" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingButton}
            className="w-full bg-success hover:bg-successH text-netral py-2 rounded-lg font-semibold transition"
          >
            {loadingButton ? <CircularLoadingComponent /> : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-netral">
          Already have an account ? <a href="/login" className="text-success hover:underline">Login</a>
        </p>
      </motion.div>
    </motion.div>
  );
}