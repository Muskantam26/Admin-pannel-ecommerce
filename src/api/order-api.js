import { Axios } from "../constant/MainContent";

export const getAllOrdersApi = async (params) => {
    try {
        const response = await Axios.get('/admin/order/all', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatusApi = async (id, data) => {
    try {
        const response = await Axios.put(`/admin/order/status/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderByIdApi = async (id) => {
    try {
        const response = await Axios.get(`/admin/order/get/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
