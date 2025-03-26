import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from 'framer-motion';
import useAnimationComponents from '@/hooks/useAnimation';
import { useProductStore } from "@/store/useProductStore";
import Toast from "@/components/Toast";
import Spinner from '@/components/SmallSpinner';

interface RestoreModalProps {
  productId?: number;
  onClose: () => void;
}

export default function RestoreModal({ productId, onClose }: RestoreModalProps) {
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();
  const { fetchAllProducts, restoreAllProducts, restoreProduct } = useProductStore();
  const [loadingButton, setLoadingButton] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRestore = async () => {
    try {
      setLoadingButton(true);
      if (productId) {
        await restoreProduct(productId);
      } else {
        await restoreAllProducts();
      }
      await fetchAllProducts();
      setLoadingButton(false);
      setToast({ message: "Action successful", type: "success" });
    } catch (error) {
      setLoadingButton(false);
      console.error("Restore failed:", error);
      setToast({ message: "Failed", type: "error" });
    } finally {
      setLoadingButton(false);
      onClose();
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-secondaryB p-8 rounded-lg shadow-lg w-full max-w-md text-netral relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-netral hover:text-secondary">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">CONFIRM RESTORE</h2>
        <p className="text-center text-netral">
          {productId ? "Are you sure want to restore this product?" : "Are you sure want to restore all products?"}
        </p>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleRestore} 
            className="px-6 py-2 min-w-24 bg-success text-white text-md font-semibold font-roboto rounded hover:bg-successH transition"
          >
            {loadingButton ? <Spinner /> : 'Confirm'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
