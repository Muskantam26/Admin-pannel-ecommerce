import { Axios } from "../constant/MainContent";

// User APIs
export const addAddressApi = async (data) => {
    try {
        const res = await Axios.post('/address/add', data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to add address" };
    }
};

export const getMyAddressesApi = async () => {
    try {
        const res = await Axios.get('/address/get_my_address');
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch addresses" };
    }
};

export const updateAddressApi = async (id, data) => {
    try {
        const res = await Axios.put(`/address/update/${id}`, data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update address" };
    }
};

export const deleteAddressApi = async (id) => {
    try {
        const res = await Axios.delete(`/address/delete/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete address" };
    }
};

// Admin APIs
export const getAllAddressesApi = async (params) => {
    try {
        const res = await Axios.get(`/address/admin/all-addresses`, { params });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch all addresses" };
    }
};

export const getAddressByIdApi = async (id) => {
    try {
        const res = await Axios.get(`/address/admin/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch address details" };
    }
};

export const createAddressByAdminApi = async (data) => {
    try {
        const res = await Axios.post('/address/admin/add', data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to create address" };
    }
};

export const verifyAddressApi = async (data) => {
    try {
        const res = await Axios.put('/address/admin/verify', data);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to verify address" };
    }
};
