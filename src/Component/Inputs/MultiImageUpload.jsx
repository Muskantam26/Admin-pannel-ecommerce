import React, { useState } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { uploadFile, convertToBase64 } from "../../utils/fileUpload";
import { toast } from "react-toastify";

const MultiImageUpload = ({ images = [], setImages, folder = "products" }) => {
    const [uploadingIds, setUploadingIds] = useState([]);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Create temporary IDs for new files to track upload status
        const newEntries = files.map(file => ({
            id: Date.now() + Math.random(),
            src: URL.createObjectURL(file), // Temporary local preview
            isUploading: true,
            file
        }));

        // Add to state immediately
        setImages([...images, ...newEntries]);

        // Process uploads
        for (const entry of newEntries) {
            try {
                const base64 = await convertToBase64(entry.file);
                const url = await uploadFile(base64, folder, (progress) => {
                    // Optional: Update progress specific to this file if needed
                });

                if (url) {
                    // Replace temp entry with final URL
                    setImages(prev => prev.map(img =>
                        img.id === entry.id ? { ...img, src: url, isUploading: false, file: null } : img
                    ));
                } else {
                    toast.error("Failed to upload image");
                    // Remove failed entry
                    setImages(prev => prev.filter(img => img.id !== entry.id));
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Error uploading image");
                setImages(prev => prev.filter(img => img.id !== entry.id));
            }
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    return (
        <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input type="file" multiple onChange={handleFileSelect} className="hidden" accept="image/*" />
            </label>

            {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {images.map((img) => (
                        <div key={img.id || img.src} className="relative group aspect-square">
                            <img
                                src={img.src}
                                alt="Product"
                                className={`w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm ${img.isUploading ? 'opacity-50' : ''}`}
                            />

                            {img.isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="text-white bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                    type="button"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
