import { Axios as axiosInstance } from "../constant/MainContent";

/**
 * @desc    Create a new display item (Banner or Marquee)
 */
export const createDisplayItemApi = async (formData) => {
    try {
        const response = await axiosInstance.post(`/admin/display/create`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * @desc    Get all display items (Admin view)
 */
export const getAllDisplayItemsApi = async (params) => {
    try {
        const response = await axiosInstance.get(`/admin/display/get-all`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * @desc    Get visible display items (User view)
 */
export const getVisibleDisplayItemsApi = async (type) => {
    try {
        const response = await axiosInstance.get(`/user/display/get-visible`, { params: { type } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * @desc    Update a display item
 */
export const updateDisplayItemApi = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/admin/display/update/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * @desc    Toggle visibility of a display item
 */
export const toggleDisplayVisibilityApi = async (id) => {
    try {
        const response = await axiosInstance.patch(`/admin/display/toggle/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * @desc    Delete a display item
 */
export const deleteDisplayItemApi = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/display/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
