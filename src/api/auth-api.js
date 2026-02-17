import { Axios } from "../constant/MainContent";


export const adminLoginApi = async (payload) => {
     const response = await Axios.post(`/admin/auth/login`, payload)
     return response?.data; 
};
