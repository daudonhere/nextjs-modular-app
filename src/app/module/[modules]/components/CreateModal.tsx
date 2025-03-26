import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useProductStore } from "@/store/useProductStore";
import useAnimationComponents from '@/services/useAnimation';
import Toast from "@/components/Toast";
import Spinner from "@/components/Spinner";

export default function CreateModal({ onClose }: { onClose: () => void }) {
  const { fetchAllProducts, createProduct } = useProductStore();
  const [ loadingButton, setLoadingButton] = useState(false);
  const { ref, fadeControls, fadeVariants } = useAnimationComponents();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [productData, setProductData] = useState({ 
    product_name: "", 
    barcode: "", 
    price: 0, 
    stock: 0  
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingButton(true);
      await createProduct(productData);
      await fetchAllProducts()
      setToast({ message: "Action successful", type: "success" });
    } catch (error) {
      setLoadingButton(false);
      console.error("Action failed:", error);
      setToast({ message: "Failed,", type: "error" });
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

        <h2 className="text-2xl font-bold font-roboto mb-6 text-center">Create Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Product Name</label>
            <input 
              type="text" 
              name="product_name" 
              value={productData.product_name}
              onChange={handleChange} 
              className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="Product XXX"
              required
            />
          </div>

          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Barcode</label>
            <input 
              type="text" 
              name="barcode" 
              value={productData.barcode}
              onChange={handleChange} 
              className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="0XXX"
              required
            />
          </div>

          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Price</label>
            <input 
              type="number" 
              name="price" 
              value={productData.price}
              onChange={handleChange} 
              className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="1234"
              required
            />
          </div>

          <div>
            <label className="block text-netral font-roboto font-semibold mb-1">Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={productData.stock}
              onChange={handleChange} 
              className="w-full p-2 rounded-lg bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="1234"
              required
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2 min-w-24 bg-success text-netral font-roboto font-semibold rounded hover:bg-successH transition"
            >
              {loadingButton ? <Spinner /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}