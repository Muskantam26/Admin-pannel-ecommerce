import { Axios } from "../constant/MainContent";

export const getCompanyApi = async () => {
    try {
        const res = await Axios.get("/company/get");
        return res.data;
    } catch (error) {
        return error.response?.data
    }
};

export const saveCompanyApi = async (data) => {
    try {
        const res = await Axios.post("/company/save", data);
        return res.data;
    } catch (error) {
        return error.response?.data
    }
};
