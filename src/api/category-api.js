import { Axios } from "../constant/MainContent";

export const createCategoryApi = async (data) => {
    try {
        const res = await Axios.post("/category/create", data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
};

export const updateCategoryApi = async (id, data) => {
    try {
        const res = await Axios.put(`/category/update/${id}`, data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
};

export const getCategoryApi = async (id) => {
    try {
        const res = await Axios.get(`/category/get/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch category" };
    }
};

export const getAllCategoryApi = async () => {
    try {
        const res = await Axios.get("/category/get-all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch categories" };
    }
};

export const deleteCategoryApi = async (id) => {
    try {
        const res = await Axios.delete(`/category/delete/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete category" };
    }
};
