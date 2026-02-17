import React, { useState, useEffect } from "react";
import { Heading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import Button from "../../Component/Btn";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import ImageUpload from "../../Component/Inputs/ImageUpload";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slice/loadingSlice";
import { createCategoryApi, updateCategoryApi, getCategoryApi, getAllCategoryApi } from "../../api/category-api";

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
                    navigate("/add-category");
                }
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to load category data");
            navigate("/add-category");
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
        dispatch(showLoader())
        try {
            let res;
            if (id) {
                res = await updateCategoryApi(id, formData);
            } else {
                res = await createCategoryApi(formData);
            }

            if (res.success) {
                toast.success(res.message);
                dispatch(hideLoader())
                navigate("/add-category");
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

    return (
        <div className="rounded-xl shadow-2xl mt-5 bg-(--bg-box) p-5 space-y-5">
            <div className="flex justify-between">
                <Heading title={id ? "Edit Category" : "Add Category"} />
                <button
                    onClick={() => navigate("/add-category")}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <RxCrossCircled size={26} />
                </button>
            </div>

            {/* Inputs Grid, matching AddProduct style */}
            <div className="grid grid-cols-2 gap-4 mt-5">
                <InputField
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Category Name"
                />
                <InputField
                    label="Slug (Auto-generated)"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Category Slug"
                />
                {/* Parent Category Select */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-600">Parent Category</label>
                    <select
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-xs bg-transparent outline-none focus:ring-1 focus:ring-(--bs-btn-third)"
                    >
                        <option value="">None (Top Level)</option>
                        {categories
                            .filter(cat => cat._id !== id) // Exclude self
                            .map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Description */}
            <Heading title={"Description"} titleSize="text-xs" />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-md p-2 text-xs bg-transparent outline-none focus:ring-1 focus:ring-(--bs-btn-third)"
                placeholder="Detailed Description"
            />

            <ImageUpload
                label="Category Image"
                onUploadComplete={handleUploadComplete}
                previewUrl={imagePreview}
                onRemove={removeImage}
                folder="category"
            />

            {/* Buttons */}
            <div className="flex gap-3 items-center justify-center mt-10">
                <Button
                    title={"Cancel"}
                    onClick={() => navigate("/add-category")}
                    className="bg-gray-400 hover:bg-gray-500 px-6 rounded-sm text-xs py-2"
                />
                <Button
                    title={id ? "Update Category" : "Add Category"}
                    className="bg-(--bs-btn-third) hover:opacity-90 px-6 rounded-sm text-xs py-2"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CategoryForm;
