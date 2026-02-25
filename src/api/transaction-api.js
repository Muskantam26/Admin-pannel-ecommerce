import { Axios } from "../constant/MainContent";

// Get All Deposits
export const getAllDepositsApi = async (payload) => {
    try {
        const response = await Axios.get("/admin/all-deposits", { params: payload });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Server Error" };
    }
};


export const getAllTransations = async (payload) => {
    try {
        const response = await Axios.get("/admin/get-all-transactions", { params: payload });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Server Error" };
    }
};

// Process Deposit (Confirm or Cancel)
export const processDepositApi = async (data) => {
    try {
        const response = await Axios.put("/admin/confirm-deposit", data);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Server Error" };
    }
};

// Admin Add Deposit (Fund Deposit)
export const depositFundApi = async (data) => {
    try {
        const response = await Axios.post("/admin/fund-deposit", data);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Server Error" };
    }
};
