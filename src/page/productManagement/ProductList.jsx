import React, { useEffect, useState } from 'react'
import { Heading, MainHeading } from '../../Component/Heading'
import SelectOption from '../../Component/Selectoption';
import CommonDataTable from '../../Component/CommonDataTable';
import { useNavigate } from "react-router-dom";
import { LuCodesandbox } from "react-icons/lu";
import { BsGridFill } from "react-icons/bs";
import { IoLayersSharp } from "react-icons/io5";
import { Edit, Eye,  Pencil } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
import EditProduct from './EditProduct';
import Modal from '../../Component/Model/Modal';
import Delete from '../../alerts/Delete';
// import AddCategoryModal from '../Details/AddCategoryModal';
// import AddProductType from '../Details/AddProductType';
// import AddProductBrand from '../Details/AddProductBrand';
// import AddProductName from '../Details/AddProductName';
// import { GiBrandyBottle } from 'react-icons/gi';
// import { TbBrandAmongUs } from "react-icons/tb";
import { PathRoutes } from '../../constant/Path';
import Button from '../../Component/Btn';
import { deleteProductApi, getAllProductsApi } from '../../api/product-api';
import PageLoader from '../../Component/PageLoader';


const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 10;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getAllProductsApi({ page: currentPage, limit: rowsPerPage });
    if (res.products) { // API returns { products, pagination } or { products: [], ... } depending on successful structure
      // Adjust based on actual API response structure. 
      // product.controller.js getAllProducts returns: { products: [...], pagination: { ... } }
      setProducts(res.products);
      setTotalPages(res.pagination?.totalPages || 0);
      setTotalRecords(res.pagination?.total || 0);
    } else {
      // Fallback or error handling
      console.error("Failed to fetch products", res);
    }
    setLoading(false);
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
      name: "SL",
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: "60px"
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={row.image || (row.images && row.images.length > 0 ? (typeof row.images[0] === 'string' ? row.images[0] : row.images[0].src) : "https://via.placeholder.com/50")}
          alt={row.name}
          className="w-10 h-10 object-cover rounded-md"
        />
      ),
      width: "80px"
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px"
    },
    {
      name: "Category",
      selector: (row) => row.category || "N/A",
      width: "150px"
    },
    {
      name: "Price",
      selector: (row) => `₹${row.price}`,
      sortable: true,
      width: "100px"
    },
    {
      name: "Stock",
      selector: (row) => row.stock || row.stockQty || "N/A",
      width: "100px"
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.status || 'ACTIVE'}
        </span>
      ),
      width: "100px"
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text) hover:opacity-80 disabled:opacity-50 cursor-pointer"
            onClick={() => navigate(`/product/view/${row._id}`)} // Or keep simple view
            title="View"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 rounded-lg bg-(--icon-btn-second) text-(--icon-text-second) hover:opacity-80 cursor-pointer"
            onClick={() => navigate(`/product/edit/${row._id}`)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-lg bg-(--bs-btn-second) text-(--text-white) hover:opacity-80 cursor-pointer"
            onClick={() => {
              setSelectedProduct(row);
              setIsDeleteOpen(true);
            }}
            title="Delete"
          >
            <RiDeleteBin6Line size={16} />
          </button>
        </div>
      ),
      width: "150px"
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className="flex justify-between items-start w-full">
          <div>
            <MainHeading
              title={"Product Management"}
              subtitle={"Real-time overview of products & inventory"}
            />
          </div>

          <div className='flex justify-end-safe mt-5'>
            <Button
              title={" + Add Product"}
              className='p-2 text-xs rounded-sm'
              onClick={() => navigate(`/add-product`)}
            />
          </div>
        </div>
      </div>

      <div className="bg-(--bg-box) shadow-2xl rounded-xl p-5 mt-5">
        {loading ? (
         <PageLoader/>
        ) : (
          <CommonDataTable
            columns={columns}
            data={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal isOpen={isDeleteOpen}>
        <Delete
          product={selectedProduct} // Pass full object or just name/id mainly for display
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </Modal>
    </div>
  );
}

export default ProductList;
