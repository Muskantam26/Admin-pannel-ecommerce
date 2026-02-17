import React, { useState, useEffect } from "react";
import { Heading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import Button from "../../Component/Btn";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCategoryData(id);
        }
    }, [id]);

    const fetchCategoryData = async (categoryId) => {
        setLoading(true);
        try {
            const res = await Axios.get(`/category/get/${categoryId}`);
            if (res.data.success) {
                const data = res.data.data;
                setFormData({
                    name: data.name || "",
                    slug: data.slug || "",
                    image: data.image || "",
                    description: data.description || "",
                });
                setImagePreview(data.image);
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to load category data");
            navigate("/add-category");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Local Preview
        setImagePreview(URL.createObjectURL(file));

        // Upload
        const formDataImg = new FormData();
        formDataImg.append("file", file);

        try {
            const res = await Axios.post("/upload/auth/upload-image", formDataImg, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                setFormData((prev) => ({ ...prev, image: res.data.url }));
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            console.error("Image upload failed", error);
            toast.error("Image upload failed");
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            return toast.error("Category name is required");
        }
        setLoading(true);
        try {
            let res;
            if (id) {
                res = await Axios.put(`/category/update/${id}`, formData);
            } else {
                res = await Axios.post("/category/create", formData);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/add-category");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
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

            {/* Image Upload */}
            <Heading title={"Category Image"} titleSize="text-xs" />
            <input type="file" onChange={handleImageUpload} className="text-xs" />

            <div className="grid grid-cols-4 gap-5 mt-3">
                {imagePreview && (
                    <div className="relative w-32 h-32">
                        <img
                            src={imagePreview}
                            alt="Category"
                            className="rounded-2xl w-full h-full object-cover shadow-sm border"
                        />
                        <RxCrossCircled
                            size={20}
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 items-center justify-center mt-10">
                <Button
                    title={"Cancel"}
                    onClick={() => navigate("/add-category")}
                    className="bg-gray-400 hover:bg-gray-500"
                />
                <Button
                    title={loading ? "Saving..." : id ? "Update Category" : "Add Category"}
                    className="bg-(--bs-btn-third) hover:opacity-90"
                    onClick={handleSubmit}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default CategoryForm;
