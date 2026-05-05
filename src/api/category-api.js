import { Axios } from "../constant/MainContent";

// CREATE
export const createCategoryApi = async (data) => {
    try {
        const res = await Axios.post("/categories/admin/category/create", data); // backend route
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
};

// UPDATE
export const updateCategoryApi = async (id, data) => {
    try {
        const res = await Axios.put(`/categories/admin/category/update/${id}`, data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
};

// GET SINGLE
export const getCategoryApi = async (id) => {
    try {
        const res = await Axios.get(`/categories/admin/category/get/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch category" };
    }
};

// GET ALL
export const getAllCategoryApi = async () => {
    try {
        const res = await Axios.get("/categories/admin/category/get-all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch categories" };
    }
};

// DELETE
export const deleteCategoryApi = async (id) => {
    try {
        const res = await Axios.delete(`/categories/admin/category/delete/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete category" };
    }
};