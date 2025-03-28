import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useRoleStore } from "@/store/useRoleStore";
import { ProductTypes } from "@/types/Product";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import useAnimationComponents from "@/hooks/useAnimation";

interface DetailModalProps {
  product: ProductTypes | null;
  onClose: () => void;
}

export default function DetailModal({ product, onClose }: DetailModalProps) {
  const { role } = useRoleStore();
  const isAdmin = role?.rolename === "administrator" || role?.rolename === "manager";
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();

  if (!product) return null;

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
        <h2 className="text-2xl font-bold mb-6 text-center">Product Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-netral">Name:</span>
            <span>{product.product_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Barcode:</span>
            <span>{product.barcode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Price:</span>
            <span>${product.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-netral">Stock:</span>
            <span>{product.stock}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="px-6 py-2 bg-success text-netral rounded hover:bg-successH transition"
          >
            Change
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-2 bg-destructive text-netral rounded hover:bg-destructiveH transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {isUpdateModalOpen && <UpdateModal product={product} onClose={() => setIsUpdateModalOpen(false)} />}
      {isDeleteModalOpen && <DeleteModal productId={product.id} onClose={() => setIsDeleteModalOpen(false)} />}
    </motion.div>
  );
}
