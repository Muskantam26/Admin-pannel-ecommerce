import React, { useState, useEffect } from "react";
import { Heading, MainHeading } from "../../Component/Heading";
import Button from "../../Component/Btn";
import InputBox from "../../Component/InputBox";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommonDataTable from "../../Component/CommonDataTable";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await Axios.get("/category/get-all");
            if (res.data.success) {
                setCategories(res.data.data || []);
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await Axios.delete(`/category/delete/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    const handleEdit = (id) => {
        navigate(`/category/edit/${id}`);
    };

    const handleAdd = () => {
        navigate('/category/create');
    };

    // Filter categories
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
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
            name: "Image",
            cell: (row) => (
                <img
                    src={row.image || "https://via.placeholder.com/50"}
                    alt={row.name}
                    className="w-10 h-10 object-cover rounded-md"
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
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Edit"
                    >
                        <FaEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 hover:text-red-700 p-2"
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
                    title={"Category Management"}
                    subtitle={"Manage your product categories here"}
                />
                <Button
                    title={" + Add Category"}
                    className='p-2 text-xs rounded-sm'
                    onClick={handleAdd}
                />
            </div>

            <div className="bg-(--bg-box) p-5 rounded-xl shadow-md">
                <div className="mb-4 w-96">
                    <InputBox
                        placeholder="Search Categories..."
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
        </div>
    );
};

export default CategoryPage;
