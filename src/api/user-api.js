import { Axios } from "../constant/MainContent";

// Get All Users (Partners)
export const getAllUsersApi = async () => {
    try {
        const res = await Axios.get("/admin/get-all-partners");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch users" };
    }
};

// Toggle User Block Status
export const toggleUserBlockApi = async (id) => {
    try {
        const res = await Axios.put(`/admin/user-block/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update user status" };
    }
};

// Login as User
export const loginAsUserApi = async (userId) => {
    try {
        const res = await Axios.post(`/admin/login-as-user/${userId}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to login as user" };
    }
}

// Get Single User Details
export const getUserApi = async (id) => {
    try {
        const res = await Axios.get(`/admin/get-user/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch user details" };
    }
};

// Toggle User Withdrawal Status
export const toggleUserWithdrawalApi = async (id) => {
    try {
        const res = await Axios.put(`/admin/toggle-withdrawal/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to toggle withdrawal status" };
    }
};

// Update User Details
export const updateUserApi = async (id, data) => {
    try {
        const res = await Axios.put(`/admin/update-user/${id}`, data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update user details" };
    }
};
export const searchUserApi = async (query) => {
    try {
        const { data } = await Axios.get(`/admin/search?query=${query}`);
        return data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error searching user" };
    }
};
