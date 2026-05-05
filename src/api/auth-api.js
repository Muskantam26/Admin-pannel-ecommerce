import { Axios } from "../constant/MainContent";


export const adminLoginApi = async (payload) => {
  const response = await Axios.post(`/users/admin/login`, payload);
  return response?.data;
};