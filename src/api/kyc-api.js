import { Axios } from "../constant/MainContent";

export const getAllKycApi = async (params) => {
    try {
        const res = await Axios.get('/kyc/all', { params });
        return res.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network Error" };
    }
};

export const verifyKycApi = async (data) => {
    try {
        const res = await Axios.post('/kyc/verify', data);
        return res.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network Error" };
    }
};

export const createKycByAdminApi = async (data) => {
    try {
        const res = await Axios.post('/kyc/create', data);
        return res.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network Error" };
    }
};
