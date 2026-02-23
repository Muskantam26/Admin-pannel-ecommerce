import React, { useState, useEffect } from "react";
import { Heading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import Button from "../../Component/Btn";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import ImageUpload from "../../Component/Inputs/ImageUpload";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slice/loadingSlice";
import { createCategoryApi, updateCategoryApi, getCategoryApi, getAllCategoryApi } from "../../api/category-api";
import PageLoader from "../../Component/PageLoader";
import CustomSelect from "../../Component/Inputs/CustomSelect";

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const mode = location.state?.mode || "category";

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        description: "",
        parentId: "",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchAllCategories();
        if (id) {
            fetchCategoryData(id);
        }
    }, [id]);

    const fetchAllCategories = async () => {
        try {
            const res = await getAllCategoryApi();
            if (res.success) {
                // Check structure: res is { success, data: { count, categories } }
                // So res.data.categories
                setCategories(res.data?.categories || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchCategoryData = async (categoryId) => {
        setLoading(true);
        try {
            const res = await getCategoryApi(categoryId);

            console.log(res);
            if (res.success) {
                const data = res.data;
                setFormData({
                    name: data.name || "",
                    slug: data.slug || "",
                    image: data.image || "",
                    description: data.description || "",
                    parentId: data.parentId?._id || data.parentId || "",
                });
                setImagePreview(data.image);
            } else {
                // ... logic
                if (res.success === false) {
                    toast.error(res.message || "Failed to load category data");
                    navigate(mode === "subcategory" ? "/sub-category" : "/add-category");
                }
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to load category data");
            navigate(mode === "subcategory" ? "/sub-category" : "/add-category");
        } finally {
            setLoading(false);
        }
    };

    // ...

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadComplete = (url) => {
        setFormData((prev) => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            return toast.error("Category name is required");
        }
        
        if (mode === "subcategory" && !formData.parentId) {
            return toast.error("Parent category is required for subcategories");
        }

        dispatch(showLoader())
        try {
            const payload = { ...formData, type: mode };
            let res;
            if (id) {
                res = await updateCategoryApi(id, payload);
            } else {
                res = await createCategoryApi(payload);
            }

            if (res.success) {
                toast.success(res.message);
                dispatch(hideLoader())
                navigate(mode === "subcategory" ? "/sub-category" : "/add-category");
            } else {
                toast.error(res.message || "Something went wrong");
                dispatch(hideLoader())
            }
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Something went wrong");
            dispatch(hideLoader())
        } finally {
            dispatch(hideLoader())
        }
    };

    const isEditMode = !!id;
    const headingTitle = isEditMode
        ? mode === "subcategory" ? "Edit Sub Category" : "Edit Category"
        : mode === "subcategory" ? "Add Sub Category" : "Add Category";
    const subTitle = mode === "subcategory" ? "Manage your sub-category details and media." : "Manage your category details and media.";
    const backPath = mode === "subcategory" ? "/sub-category" : "/add-category";

    return (
        <div className="pb-20 relative min-h-screen bg-(--bg-main) mt-5 md:mt-2">
            {loading && <PageLoader />}
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(backPath)} className="p-2 hover:bg-[var(--bg-box)] rounded-lg transition-colors text-(--text-second)">
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-(--text-main)">{headingTitle}</h1>
                        <p className="text-(--text-second) text-sm mt-0.5">{subTitle}</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto px-2 md:px-0">
                    <Button
                        title="Cancel"
                        onClick={() => navigate(backPath)}
                        bg="bg-transparent"
                        text="text-(--text-second)"
                        className="flex-1 md:flex-none px-4 py-2 border border-(--bs-border) rounded-lg hover:bg-[var(--bg-main)] transition font-medium cursor-pointer"
                    />
                    <Button
                        onClick={handleSubmit}
                        bg="bg-(--bs-btn)"
                        text="text-white"
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition transform hover:scale-105 font-medium shadow-sm flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Saving..." : <><FiCheck /> {isEditMode ? "Update" : "Save"} {mode === "subcategory" ? "Sub Category" : "Category"}</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-0">
                {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Basic Info */}
                    <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[var(--text-main)]">Basic Information</h2>
                            <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Required</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <InputField
                                    label="Category Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <InputField
                                    label="Slug (Auto-generated)"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="category-slug"
                                />
                            </div>

                            {mode === "subcategory" && (
                                <div className="md:col-span-2">
                                    <CustomSelect
                                        label="Parent Category"
                                        name="parentId"
                                        value={formData.parentId}
                                        onChange={handleChange}
                                        options={categories
                                            .filter(cat => cat._id !== id)
                                            .map(cat => ({ label: cat.name, value: cat._id }))}
                                        placeholder="Select Parent Category..."
                                     
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full border border-[var(--bs-border)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y bg-[var(--bg-box)] text-[var(--text-main)]"
                                    placeholder="Detailed description..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: SIDEBAR --- */}
                <div className="space-y-8">
                    {/* Media */}
                    <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
                        <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Category Image</h2>
                        <ImageUpload
                            label="Upload Image"
                            onUploadComplete={handleUploadComplete}
                            previewUrl={imagePreview}
                            onRemove={removeImage}
                            folder="category"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
