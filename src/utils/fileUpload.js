import { toast } from "react-toastify";
import { uploadFileApi } from "../api/upload-api";

/**
 * Uploads a file (image or video) to the server.
 * @param {File} file - The file object to upload.
 * @returns {Promise<string|null>} - Returns the file URL if successful, otherwise null.
 */
export const uploadFile = async (base64File, folder = 'upload', onProgress) => {
    if (!base64File) return null;
    try {
        const data = await uploadFileApi(base64File, folder, onProgress);
        if (data.success) {
            toast.success("File uploaded successfully");
            return data.url;
        } else {
            toast.error(data.message || "Upload failed");
            return null;
        }
    } catch (error) {
        console.error("File upload error:", error);
        toast.error("File upload failed");
        return null;
    }
};


/**
 * Converts a File object to a Base64 string.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - The Base64 string.
 */
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
