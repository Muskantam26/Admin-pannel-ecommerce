import React, { useState, useRef, useEffect } from 'react';
import { MainHeading, Heading } from '../Component/Heading';
import { InputField } from '../Component/InputBox';
import Button from '../Component/Btn';
import { RxCrossCircled } from 'react-icons/rx';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { createDisplayItemApi, updateDisplayItemApi, getAllDisplayItemsApi } from '../api/display-api';
import { uploadFileApi } from '../api/upload-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/slice/loadingSlice';

const AddBanner = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [bannerData, setBannerData] = useState({
        type: 'BANNER',
        content: '',
        link: '',
        order: 0,
        isVisible: true
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isEditMode) {
            fetchBannerDetails();
        }
    }, [id]);

    const fetchBannerDetails = async () => {
        dispatch(showLoader());
        try {
            // Ideally should be a getById endpoint, but we can filter from get-all
            const res = await getAllDisplayItemsApi();
            if (res.success) {
                const item = res.data.find(b => b.id === id || b._id === id);
                if (item) {
                    setBannerData({
                        type: item.type,
                        content: item.content,
                        link: item.link || '',
                        order: item.order || 0,
                        isVisible: item.isVisible
                    });
                    setPreviewUrl(item.content);
                } else {
                    toast.error("Banner not found");
                    navigate('/banner');
                }
            }
        } catch (error) {
            console.error("Error fetching banner:", error);
            toast.error("Failed to load banner details");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBannerData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                // When a new image is selected, we clear the content URL until it's uploaded
                setBannerData(prev => ({ ...prev, content: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl('');
        setUploadProgress(0);
        setBannerData(prev => ({ ...prev, content: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!previewUrl) {
            toast.error("Please select a banner image");
            return;
        }

        dispatch(showLoader());
        try {
            let finalContent = bannerData.content;

            // 1. If a new image was selected, upload it
            if (selectedImage) {
                const uploadRes = await uploadFileApi(previewUrl, 'banners', (progress) => {
                    setUploadProgress(progress);
                });

                if (!uploadRes.success) {
                    toast.error("Image upload failed");
                    return;
                }
                finalContent = uploadRes.url;
            }

            // 2. Save or Update
            const finalData = {
                ...bannerData,
                content: finalContent
            };

            let res;
            if (isEditMode) {
                res = await updateDisplayItemApi(id, finalData);
            } else {
                res = await createDisplayItemApi(finalData);
            }

            if (res.success) {
                toast.success(isEditMode ? "Banner updated successfully" : "Banner added successfully");
                navigate('/banner');
            }
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error(error.response?.data?.message || "Failed to save banner");
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="pb-10 bg-transparent animate-fade-in-up">
            <MainHeading
                title={isEditMode ? "Edit Banner" : "Add New Banner"}
                subtitle={isEditMode ? "Update existing banner details" : "Create high-quality banners for your website"}
            />

            <div className='rounded-2xl shadow-sm mt-8 bg-(--bg-box) p-6 md:p-8 border border-(--bs-border)'>
                <div className='flex justify-between items-center mb-8 pb-4 border-b border-dashed border-(--bs-border)'>
                    <Heading title={"Banner Details"} titleSize="text-xl" />
                    <button
                        className="p-2 rounded-full hover:bg-red-50 text-(--text-second) hover:text-red-500 transition-all"
                        onClick={() => navigate('/banner')}
                    >
                        <RxCrossCircled size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <label className="text-sm text-(--text-main) font-bold ml-1">Banner Image</label>
                        <p className="text-xs text-(--text-third) mb-4 ml-1">Recommended size: 1920x600 pixels for best appearance on sliders.</p>
                        {!previewUrl ? (
                            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-(--bs-border) border-dashed rounded-3xl cursor-pointer bg-(--bg-main) hover:border-(--bs-btn) transition-all group overflow-hidden relative">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-5 rounded-2xl bg-white text-(--bs-btn) mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <FiUploadCloud size={40} />
                                    </div>
                                    <p className="mb-2 text-base text-(--text-main) font-semibold">Drop your image here, or browse</p>
                                    <p className="text-xs text-(--text-third)">Supports: JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        ) : (
                            <div className="relative group rounded-3xl overflow-hidden border border-(--bs-border) shadow-xl h-96">
                                <img
                                    src={previewUrl}
                                    alt="banner preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-4 bg-white/20 hover:bg-red-500 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 group/btn"
                                    >
                                        <FiX size={32} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="absolute inset-x-0 bottom-0 h-2 bg-white/20">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <InputField
                                label={"Target Link / Route"}
                                name="link"
                                value={bannerData.link}
                                onChange={handleChange}
                                placeholder="e.g. /products/sale or https://google.com"
                                className="py-3!"
                            />
                        </div>

                        <InputField
                            label={"Display Order"}
                            name="order"
                            type="number"
                            value={bannerData.order}
                            onChange={handleChange}
                            placeholder="Sorting order (0, 1, 2...)"
                            className="py-3!"
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-(--text-main) font-semibold ml-1">Visibility Status</label>
                            <select
                                name="isVisible"
                                value={bannerData.isVisible}
                                onChange={(e) => setBannerData(prev => ({ ...prev, isVisible: e.target.value === 'true' }))}
                                className="w-full bg-transparent border border-(--input-border) rounded-xl p-3 text-sm text-(--text-main) outline-none focus:border-(--bs-btn) transition-all"
                            >
                                <option value="true">Active (Visible to users)</option>
                                <option value="false">Inactive (Hidden from users)</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex gap-4 items-center justify-center md:justify-end mt-12 pt-8 border-t border-(--bs-border)'>
                        <Button
                            title={"Cancel"}
                            type="button"
                            bg="bg-white"
                            text="text-(--text-main)"
                            className='px-10 py-3 text-sm rounded-xl border border-(--bs-border) hover:bg-(--bg-main) hover:shadow-md transition-all'
                            onClick={() => navigate('/banner')}
                        />

                        <Button
                            title={isEditMode ? "Update Banner" : "Save Banner"}
                            type="submit"
                            bg="bg-(--bs-btn)"
                            className='px-12 py-3 text-sm rounded-xl text-white shadow-[0_10px_20px_-10px_rgba(30,27,57,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(30,27,57,0.6)] transition-all'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBanner;
