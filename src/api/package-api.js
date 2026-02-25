import { Axios } from "../constant/MainContent";

// Create Package
export const createPackageApi = async (data) => {
    try {
        const res = await Axios.post("/admin/package/create", data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to create package" };
    }
};

// Get All Packages
export const getAllPackagesApi = async (status = "") => {
    try {
        const res = await Axios.get(`/admin/package/all-packages?status=${status}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch packages" };
    }
};

// Get Package By ID
export const getPackageApi = async (id) => {
    try {
        const res = await Axios.get(`/admin/package/${id}`);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch package" };
    }
};

// Update Package
export const updatePackageApi = async (id, data) => {
    try {
        const res = await Axios.put(`/admin/package/update/${id}`, data);
        return { success: true, message: res.data.message, data: res.data.package };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update package" };
    }
};

// Delete Package
export const deletePackageApi = async (id) => {
    try {
        const res = await Axios.delete(`/admin/package/delete/${id}`);
        return { success: true, message: res.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete package" };
    }
};


