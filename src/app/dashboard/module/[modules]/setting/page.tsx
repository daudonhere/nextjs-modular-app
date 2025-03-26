'use client';

import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import useAnimationComponents from '@/services/useAnimation';
import { useSidebarStore } from "@/store/useSidebarStore";
import { useProductStore } from "@/store/useProductStore";
import Toast from "@/components/Toast";
import Spinner from '@/components/Spinner';
import DeleteModal from './components/DeleteModal';
import RestoreModal from './components/RestoreModal';

export default function ModuleSettingPage() {
  const { setIsOpen } = useSidebarStore();
  const { all_products, fetchAllProducts } = useProductStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreProductId, setRestoreProductId] = useState<number | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | undefined>(undefined);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((all_products?.length || 0) / itemsPerPage);
  const { ref, rightControls, rightVariants } = useAnimationComponents();
  const activeProducts = (all_products || []).filter((product) => product?.is_deleted === true);
  const paginatedProducts = activeProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingData(true);
      await fetchAllProducts();
      setFetchingData(false);
    };
    fetchProducts();
  }, []);

  const handleShowDelete = (id?: number) => {
    setDeleteProductId(id);
    setIsDeleteModalOpen(true);
  };

  const handleShowRestore = (id?: number) => {
    setRestoreProductId(id);
    setIsRestoreModalOpen(true);
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
      <section className="flex flex-1 flex-col items-center text-center gap-4 px-4">
        <div className="w-full max-w-5xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Products Recycle</h2>
            <div className="flex gap-2">
              <button onClick={() => handleShowRestore()} className="px-4 py-2 bg-success hover:bg-successH text-netral rounded text-sm font-semibold">Restore All</button>
              <button onClick={() => handleShowDelete()} className="px-4 py-2 bg-destructive hover:bg-destructiveH text-netral rounded text-sm font-semibold">Destroy All</button>
            </div>
          </div>
          <div className="overflow-x-auto border bg-card border-mutted rounded-lg shadow-xl">
            <table className="w-full min-w-max text-sm md:text-lg border border-mutted rounded-lg shadow-xl">
              <thead className="bg-primary text-netral">
                <tr>
                  <th className="p-3 border border-mutted text-center">No</th>
                  <th className="p-3 border border-mutted text-center">Name</th>
                  <th className="p-3 border border-mutted text-center">Barcode</th>
                  <th className="p-2 border border-mutted text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-netral text-center">
                      {fetchingData ? <Spinner /> : "No product listed here"}
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, index) => (
                    <tr key={product.id} className="border border-mutted">
                      <td className="p-3 border border-mutted text-center">{index + 1}</td>
                      <td className="p-3 border border-mutted text-center">{product.product_name}</td>
                      <td className="p-3 border border-mutted text-center">{product.barcode}</td>
                      <td className="flex flex-row gap-2 justify-center p-2 text-center">
                        <button onClick={() => handleShowRestore(product.id)} className="h-8 text-sm font-semibold font-roboto text-center px-4 bg-success hover:bg-successH text-netral rounded">Restore</button>
                        <button onClick={() => handleShowDelete(product.id)} className="h-8 text-sm font-semibold font-roboto text-center px-4 bg-destructive hover:bg-destructiveH text-netral rounded">Destroy</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-1 flex-row justify-end gap-2 px-2 py-4 items-center">
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
        </div>
      </section>
      {isRestoreModalOpen && (
        <RestoreModal 
          productId={restoreProductId} 
          onClose={() => {
            setIsRestoreModalOpen(false);
            setRestoreProductId(undefined);
          }} 
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal 
          productId={deleteProductId} 
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteProductId(undefined);
          }} 
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}