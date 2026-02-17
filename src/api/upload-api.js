import { Axios } from "../constant/MainContent";
import axios from "axios"; // Import clean axios for external calls
import { v4 as uuidv4 } from 'uuid';


/**
 * API call to upload a file using ImageKit client-side SDK.
 * @param {File} file - The file object to upload.
 * @param {string} folder - The folder to upload to.
 * @param {Function} onProgress - Callback for upload progress (optional). (progressEvent) => {}
 * @returns {Promise<Object>} - The response data { success: true, url: ... }.
 */
export const uploadFileApi = async (base64File, folder = 'upload', onProgress) => {
    try {
        // 1. Get Auth Params from Backend
        const authRes = await Axios.get("/auth/upload-image");
        const { token, expire, signature } = authRes.data;

        const params = new URLSearchParams();
        params.append("file", base64File);
        params.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
        params.append("signature", signature);
        params.append("expire", expire);
        params.append("token", token);
        params.append("fileName", uuidv4());
        params.append("folder", `/aayucare/${folder}`);
        params.append("useUniqueFileName", "true");

        // 4. Upload to ImageKit
        const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", params, {
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });

        // Actually, let's explicitely set Content-Type to application/json just to be safe if that's what we want, 
        // OR rely on axios default.

        // Correct approach for axios with JSON:
        // axios.post(url, data_object) -> Content-Type: application/json

        return { success: true, url: res.data.url, fileId: res.data.fileId };

    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        return { success: false, message: error.message || "Upload failed" };
    }
};
