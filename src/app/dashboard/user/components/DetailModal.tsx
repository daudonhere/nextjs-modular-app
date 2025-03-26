import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { UserTypes } from "@/types/User";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import Toast from "@/components/Toast";
import useAnimationComponents from "@/services/useAnimation";

interface DetailModalProps {
  user: UserTypes | null;
  onClose: () => void;
}

export default function DetailModal({ user, onClose }: DetailModalProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();

  if (!user) return null;

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
        <h2 className="text-2xl font-bold mb-6 text-center">User Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-netral">Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Status:</span>
            <span>{user.is_active ? "Active" : "Inactive"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Created At:</span>
            <span>{new Date(user.created_at).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="px-6 py-2 bg-success text-netral rounded hover:bg-successH transition"
          >
            Change
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-destructive text-netral rounded hover:bg-destructiveH transition"
          >
            Delete
          </button>
        </div>
      </div>
      {isUpdateModalOpen && <UpdateModal user={user} onClose={() => setIsUpdateModalOpen(false)} />}
      {isDeleteModalOpen && <DeleteModal userId={user.id} onClose={() => setIsDeleteModalOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}