import { Axios } from "../constant/MainContent";

// Get All Carts (Admin)
export const getAllCartsApi = async () => {
    try {
        const res = await Axios.get("/admin/cart/all-carts");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch all carts" };
    }
};

// Get Cart By User ID (Admin)
export const getCartByUserIdApi = async (userId) => {
    try {
        const res = await Axios.get(`/admin/cart/get-by-id/${userId}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch user cart details" };
    }
};
