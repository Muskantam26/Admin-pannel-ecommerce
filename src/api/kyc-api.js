import Axios from "../constant/Axios";

// Get All KYC Requests
export const getAllKycRequestsApi = async (status = "") => {
    try {
        const res = await Axios.get(`/admin/kyc/all-requests?status=${status}`);
        return { success: true, data: res.data.data, message: "Fetched Successfully" };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch KYC requests" };
    }
};

// Update KYC Status
export const updateKycStatusApi = async (id, status, remarks = "") => {
    try {
        const res = await Axios.put(`/admin/kyc/update-status/${id}`, { status, remarks });
        return { success: true, message: res.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update KYC status" };
    }
};

// Get Single KYC Request
export const getKycRequestByIdApi = async (id) => {
    try {
        const res = await Axios.get(`/admin/kyc/request/${id}`);
        return { success: true, data: res.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch KYC request" };
    }
};
