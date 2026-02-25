import React, { useState, useEffect } from "react";
import { Heading, MainHeading } from "../../Component/Heading";
import Button from "../../Component/Btn";
import InputBox from "../../Component/InputBox";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommonDataTable from "../../Component/CommonDataTable";
import { getAllCategoryApi, deleteCategoryApi } from "../../api/category-api";
import ConfirmationModal from "../../Component/Model/ConfirmationModal";
import ImagePreviewModal from "../../Component/Model/ImagePreviewModal";
import PageLoader from "../../Component/PageLoader";
import { FiEdit, FiTrash } from "react-icons/fi";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 100;

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getAllCategoryApi();

            if (res.success) {
                setCategories(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            // toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const onConfirmDelete = async () => {
        if (!confirmModal.id) return;
        try {
            const res = await deleteCategoryApi(confirmModal.id);
            if (res.success) {
                toast.success(res.message || "Category deleted successfully");
                setCategories((prev) => ({
                    ...prev,
                    categories: (prev.categories || []).filter((cat) => cat._id !== confirmModal.id),
                }));
            } else {
                toast.error(res.message || "Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        } finally {
            setConfirmModal({ isOpen: false, id: null });
        }
    };

    const handleEdit = (id) => {
        navigate(`/category/edit/${id}`);
    };

    const handleAdd = () => {
        navigate('/category/create', { state: { mode: "category" } });
    };

    // Filter categories
    console.log(categories);
    const filteredCategories = (categories?.categories || []).filter((cat) =>
        cat?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate Pagination
    const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
    const paginatedData = filteredCategories.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    console.log(paginatedData);
    // Define Columns
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Image",
            cell: (row) => (
                <img
                    src={row.image || "https://via.placeholder.com/50"}
                    alt={row.name}
                    className="w-10 h-10 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewModal({ isOpen: true, url: row.image, title: row.name })}
                />
            ),
            sortable: false,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Slug",
            selector: (row) => row.slug,
            sortable: true,
        },
        {
            name: "Description",
            cell: (row) => (
                <span className="truncate max-w-xs">{row.description}</span>
            ),
            sortable: false,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row._id)}
                        className="p-2 rounded-lg cursor-pointer bg-(--icon-btn-second) text-(--icon-text-second)"
                        title="Edit"
                    >
                        <FiEdit  size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 rounded-lg cursor-pointer bg-(--bs-del) text-(--bs-red)"
                        title="Delete"
                    >
                        <FiTrash size={14} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    return (
        <div className="p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <MainHeading
                    title={"Category Management"}
                    subtitle={"Manage your product categories here"}
                />
                <Button
                    title={" + Add Category"}
                    className='p-2 text-xs rounded-sm w-full sm:w-auto'
                    onClick={handleAdd}
                />
            </div>

            <div className="bg-[var(--bg-box)] p-5 rounded-xl shadow-md">
                <div className="mb-4 w-full sm:w-96">
                    <InputBox
                        placeholder="Search Categories..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); 
                        }}
                    />
                </div>

                {loading ? (
                    <PageLoader/>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <CommonDataTable
                            columns={columns}
                            data={paginatedData}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                        />
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={onConfirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
            />

            <ImagePreviewModal
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, url: "", title: "" })}
                imageUrl={previewModal.url}
                title={previewModal.title}
            />
        </div>
    );

};

export default CategoryPage;
