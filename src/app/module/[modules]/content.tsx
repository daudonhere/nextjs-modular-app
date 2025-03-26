'use client';

import React, { useState, useEffect } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useProductStore } from "@/store/useProductStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from 'framer-motion';
import useAnimationComponents from '@/services/useAnimation';
import Toast from "@/components/Toast";
import Spinner from '@/components/Spinner';
import CreateModal from './components/CreateModal';
import DetailModal from './components/DetailModal';
import DeleteModal from './components/DeleteModal';

export default function Content() {
  const { setIsOpen } = useSidebarStore();
  const { product, all_products, fetchAllProducts, fetchProduct } = useProductStore();
  const { isAuthenticated } = useAuthStore();
  const { role } = useRoleStore();
  const isAdmin = role?.rolename === "administrator" || role?.rolename === "manager";
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState<number | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const { ref, rightControls, rightVariants } = useAnimationComponents();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((all_products?.length || 0) / itemsPerPage);
  const activeProducts = all_products.filter((product) => product?.is_deleted === false);
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

  const handleShowCreate = () => {
    setIsCreateModalOpen(true);
  };
  const handleShowDetail = async (id: number) => {
    setLoadingButton(id)
    setSelectedProductId(id);
    await fetchProduct(id);
    setIsDetailModalOpen(true);
    setLoadingButton(null)
  };

  const handleShowDelete = () => {
    setIsDeleteModalOpen(true);
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
            <h2 className="text-2xl md:text-3xl font-bold">Products Management</h2>
            {isAuthenticated && (
              <div className="flex gap-2">
                <button
                  onClick={handleShowCreate}
                  className="px-4 py-2 bg-success hover:bg-successH text-netral rounded text-sm font-semibold"
                >
                  Create New
                </button>
                {isAdmin && all_products.length > 0 && (
                  <button
                    onClick={handleShowDelete}
                    className="px-4 py-2 bg-destructive hover:bg-destructiveH text-netral rounded text-sm font-semibold"
                  >
                    Delete All
                  </button>
                )}
              </div>
            )}
          </div>
        <div className="overflow-x-auto border bg-card border-mutted rounded-lg shadow-xl">
          <table className="w-full min-w-max text-sm md:text-lg border border-mutted rounded-lg shadow-xl">
            <thead className="bg-primary text-netral">
              <tr>
                <th className="p-3 border border-mutted text-center">No</th>
                <th className="p-3 border border-mutted text-center">Name</th>
                <th className="p-3 border border-mutted text-center">Barcode</th>
                <th className="p-3 border border-mutted text-center">Price</th>
                {isAuthenticated && (
                  <th className="p-3 border border-mutted text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {all_products.length === 0 ? (
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
                    <td className="p-3 border border-mutted text-center">{product.price}</td>
                    {isAuthenticated && (
                      <td className="p-2 flex flex-row gap-2 text-center">
                        <button
                          disabled={loadingButton === product.id}
                          onClick={() => handleShowDetail(product.id)}
                          className="h-8 min-w-full text-sm font-semibold font-roboto text-center px-4 rounded bg-success hover:bg-successH text-netral"
                        >
                          {loadingButton === product.id ? <Spinner /> : 'Detail'}
                        </button>
                      </td>
                    )}
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

      {isCreateModalOpen && <CreateModal onClose={() => setIsCreateModalOpen(false)} />}
      {isDetailModalOpen && product && (
        <DetailModal product={product} onClose={() => setIsDetailModalOpen(false)} />
      )}
      {isDeleteModalOpen && <DeleteModal onClose={() => setIsDeleteModalOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
}