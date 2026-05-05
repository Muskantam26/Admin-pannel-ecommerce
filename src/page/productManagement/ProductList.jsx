import React, { useEffect, useState } from 'react'
import { Heading, MainHeading } from '../../Component/Heading'
import CommonDataTable from '../../Component/CommonDataTable';
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import ConfirmationModal from '../../Component/Model/ConfirmationModal';
import Button from '../../Component/Btn';
import { deleteProductApi, getAllProductsApi } from '../../api/product-api';
import { toast } from 'react-toastify';
import PageLoader from '../../Component/PageLoader';

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 10;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsApi({ page: currentPage, limit: rowsPerPage });
      if (res.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination?.totalPages || 0);
      } else {
        toast.error(res.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    const res = await deleteProductApi(selectedProduct._id);
    if (res.message && (res.message.includes('successfully') || res.success)) {
      toast.success("Product deleted successfully");
      fetchProducts();
      setIsDeleteOpen(false);
    } else {
      toast.error(res.message || "Failed to delete product");
    }
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => <span className="text-(--text-second) font-medium">{(currentPage - 1) * rowsPerPage + index + 1}</span>,
      width: "60px"
    },
    {
      name: "ID",
      cell: (row) => <span className="text-(--text-second) font-medium">{row?.id}</span>,
      width: "200px"
    },
    {
      name: "Product",
      selector: (row) => `${row.name} ${row.sku ? `(SKU: ${row.sku})` : ''}`,
      imageSelector: (row) => row.image || (row.images && row.images.length > 0 ? (typeof row.images[0] === 'string' ? row.images[0] : row.images[0].src) : null),
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-12 h-12 rounded-lg bg-[var(--bg-main)] border border-[var(--bs-border)] flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={row.image || (row.images && row.images.length > 0 ? (typeof row.images[0] === 'string' ? row.images[0] : row.images[0].src) : "https://via.placeholder.com/50")}
              alt={row.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-main)] text-sm line-clamp-1">{row.name}</p>
            <p className="text-xs text-[var(--text-second)] font-mono">SKU: {row.sku || 'N/A'}</p>
          </div>
        </div>
      ),
      width: "250px"
    },
    {
      name: "Category",
      selector: (row) => row.category?.name || "Uncategorized",
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {row.category?.name || "Uncategorized"}
        </span>
      ),
      width: "140px"
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => <span className="font-bold text-[var(--text-main)]">₹{row.price}</span>,
      width: "100px"
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      cell: (row) => (
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${row.stock > 0 ? 'text-[var(--text-main)]' : 'text-red-600'}`}>
            {row.stock || 0}
          </span>
          <span className="text-[10px] text-[var(--icon-color)] uppercase">Units</span>
        </div>
      ),
      width: "90px"
    },
    {
      name: "Status",
      selector: (row) => row.status || 'DRAFT',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'ACTIVE' ? 'bg-green-100 text-(--bg-green)' : 'bg-yellow-100 text-[var(--bs-warn)]'}`}>
          {row.status || 'DRAFT'}
        </span>
      ),
      width: "110px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg cursor-pointer bg-(--icon-btn) text-(--icon-btn-text)"
            onClick={() => navigate(`/product/view/${row._id}`)}
            title="View Details"
          >
            
            <Eye size={14} />
          </button>
          <button
            className="p-2 rounded-lg cursor-pointer bg-(--icon-btn-second) text-(--icon-text-second)"
            onClick={() => navigate(`/product/edit/${row._id}`)}
            title="Edit Product"
          >

            <Edit size={14} />
          </button>
          <button
            className="p-2 rounded-lg cursor-pointer bg-(--bs-del) text-(--bs-red)"
            onClick={() => {
              setSelectedProduct(row);
              setIsDeleteOpen(true);
            }}
            title="Delete Product"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
      width: "140px",
      style: {
        paddingRight: '10px'
      }

    },
  ];

  return (
    <div className="space-y-6 ">
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 '>
        <div>
          <MainHeading
            title={"Product Inventory"}
            subtitle={"Manage your product catalog, prices, and stock levels."}
          />
        </div>
        <button
          onClick={() => navigate(`/add-product`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-gray-800 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm font-medium transform hover:-translate-y-0.5"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-[var(--bg-box)] rounded-2xl shadow-sm border border-[var(--bs-border)] overflow-x-auto p-3">
        {loading ? (
         <PageLoader/>
        ) : (
          <CommonDataTable
            columns={columns}
            data={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pagination
          />
        )}
      </div>

              

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={selectedProduct ? `Are you sure you want to permanently delete "${selectedProduct.name}"?` : "Are you sure you want to delete this product?"}
        isDanger={true}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
      />
    </div>

    
  );
}

export default ProductList;
