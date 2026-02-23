import { Axios as axiosInstance } from "../constant/MainContent";

// Get All Admins
export const getAllAdminsApi = async () => {
    try {
        const response = await axiosInstance.get(`/admin/auth/all-admins`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Admin By ID
export const getAdminByIdApi = async (id) => {
    try {
        const response = await axiosInstance.get(`/admin/auth/admin/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create Admin
export const createAdminApi = async (formData) => {
    try {
        const response = await axiosInstance.post(`/admin/auth/create-admin`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Admin Full
export const updateAdminFullApi = async (formData) => {
    try {
        const response = await axiosInstance.put(`/admin/auth/update-admin-full`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Admin
export const deleteAdminApi = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/auth/delete-admin/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Send OTP
export const sendOtpApi = async (data) => {
    try {
        const response = await axiosInstance.post(`/admin/auth/otp-send`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Verify OTP
export const verifyOtpApi = async (data) => {
    try {
        const response = await axiosInstance.post(`/admin/auth/otp-verify`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
