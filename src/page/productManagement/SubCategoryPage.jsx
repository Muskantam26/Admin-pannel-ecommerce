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

const SubCategoryPage = () => {
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
        navigate('/category/create');
    };

    // Filter categories to show ONLY subcategories (where parentId exists)
    const filteredCategories = (categories?.categories || []).filter((cat) =>
        cat?.name?.toLowerCase().includes(search.toLowerCase()) && (cat.parentId && cat.parentId !== null)
    );

    // Calculate Pagination
    const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
    const paginatedData = filteredCategories.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    
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
            name: "Parent Category",
            selector: (row) => row.parentId?.name || "None",
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
                        className="text-blue-500 cursor-pointer hover:text-blue-700 p-2"
                        title="Edit"
                    >
                        <FaEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 cursor-pointer hover:text-red-700 p-2"
                        title="Delete"
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <MainHeading
                    title={"Sub Category Management"}
                    subtitle={"Manage your product sub-categories here"}
                />
                <Button
                    title={" + Add Sub Category"}
                    className='p-2 text-xs rounded-sm'
                    onClick={handleAdd}
                />
            </div>

            <div className="bg-(--bg-box) p-5 rounded-xl shadow-md">
                <div className="mb-4 w-96">
                    <InputBox
                        placeholder="Search Sub Categories..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>

                {loading ? (
                    <p className="text-center p-5">Loading...</p>
                ) : (
                    <CommonDataTable
                        columns={columns}
                        data={paginatedData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={onConfirmDelete}
                title="Delete Sub Category"
                message="Are you sure you want to delete this sub-category? This action cannot be undone."
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

export default SubCategoryPage;
