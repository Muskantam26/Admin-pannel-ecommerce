import { Axios } from "../constant/MainContent";
import { toast } from "react-toastify";

export const getAllBanksApi = async (params) => {
    try {
        const response = await Axios.get('/bank/all', { params });
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch banks");
        return { banks: [], pagination: {} };
    }
};

export const verifyBankApi = async (data) => {
    try {
        const response = await Axios.post('/bank/verify', data);
        return { success: true, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Action Failed",
        };
    }
};

export const createBankByAdminApi = async (data) => {
    try {
        const response = await Axios.post('/bank/create', data);
        return { success: true, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Action Failed",
        };
    }
};

export const getBankDetailsApi = async (bankId) => {
    try {
        const response = await Axios.get(`/bank/admin/${bankId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch bank details");
        return { success: false, message: "Error fetching details" };
    }
};
