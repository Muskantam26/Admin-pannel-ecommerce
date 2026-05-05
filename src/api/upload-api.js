import { Axios } from "../constant/MainContent";

export const uploadFileApi = async (base64File, folder = 'upload', onProgress) => {
    try {
        const res = await Axios.post("/auth/upload-image", { image: base64File, folder });
        if (onProgress) {
            onProgress(100);
        }
        return { success: true, url: res.data.url, fileId: res.data.url };
    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, message: error.message || "Upload failed" };
    }
};
