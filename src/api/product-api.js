import { Axios } from "../constant/MainContent";

// Create Product
export const createProductApi = async (data) => {
    try {
        const res = await Axios.post("/products", data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to create product" };
    }
};

// Get All Products (Admin)
export const getAllProductsApi = async (params) => {
    try {
        const res = await Axios.get("/products", { params });
        return res.data; 
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch products" };
    }
};

// Get Product By ID
export const getProductByIdApi = async (id) => {
    try {
        const res = await Axios.get(`/products/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch product details" };
    }
};

// Update Product
export const updateProductApi = async (id, data) => {
    try {
        const res = await Axios.put(`/products/${id}`, data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update product" };
    }
};

// Delete Product
export const deleteProductApi = async (id) => {
    try {
        const res = await Axios.delete(`/products/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete product" };
    }
};
