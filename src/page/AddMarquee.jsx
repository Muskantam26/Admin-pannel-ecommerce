import React, { useState } from 'react';
import { MainHeading, Heading } from '../Component/Heading';
import { InputField } from '../Component/InputBox';
import Button from '../Component/Btn';
import { RxCrossCircled } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import { createDisplayItemApi, updateDisplayItemApi, getAllDisplayItemsApi } from '../api/display-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/slice/loadingSlice';
import { useEffect } from 'react';

const AddMarquee = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const dispatch = useDispatch();
    const [marqueeData, setMarqueeData] = useState({
        type: 'MARQUEE',
        content: '',
        order: 0,
        isVisible: true
    });

    useEffect(() => {
        if (isEditMode) {
            fetchMarqueeDetails();
        }
    }, [id]);

    const fetchMarqueeDetails = async () => {
        dispatch(showLoader());
        try {
            const res = await getAllDisplayItemsApi();
            if (res.success) {
                const item = res.data.find(m => m.id === id || m._id === id);
                if (item) {
                    setMarqueeData({
                        type: item.type,
                        content: item.content,
                        order: item.order || 0,
                        isVisible: item.isVisible
                    });
                } else {
                    toast.error("Marquee not found");
                    navigate('/marquee');
                }
            }
        } catch (error) {
            console.error("Error fetching marquee:", error);
            toast.error("Failed to load marquee details");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMarqueeData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!marqueeData.content) {
            toast.error("Marquee text is required");
            return;
        }

        dispatch(showLoader());
        try {
            let res;
            if (isEditMode) {
                res = await updateDisplayItemApi(id, marqueeData);
            } else {
                res = await createDisplayItemApi(marqueeData);
            }

            if (res.success) {
                toast.success(isEditMode ? "Marquee text updated successfully" : "Marquee text added successfully");
                navigate('/marquee');
            }
        } catch (error) {
            console.error("Error saving marquee:", error);
            toast.error(error.response?.data?.message || "Failed to save marquee");
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="pb-10 bg-transparent animate-fade-in-up">
            <MainHeading
                title={isEditMode ? "Edit Marquee" : "Add New Marquee"}
                subtitle={isEditMode ? "Update existing marquee text details" : "Create and manage scrolling announcement text"}
            />

            <div className='rounded-2xl shadow-sm mt-8 bg-(--bg-box) p-6 md:p-8 border border-(--bs-border)'>
                <div className='flex justify-between items-center mb-8 pb-4 border-b border-dashed border-(--bs-border)'>
                    <Heading title={"Marquee Details"} titleSize="text-xl" />
                    <button
                        className="p-2 rounded-full hover:bg-red-50 text-(--text-second) hover:text-red-500 transition-all"
                        onClick={() => navigate('/marquee')}
                    >
                        <RxCrossCircled size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-3">
                            <InputField
                                label={"Marquee Text"}
                                name="content"
                                value={marqueeData.content}
                                onChange={handleChange}
                                placeholder="Enter scrolling announcement text here..."
                                required
                                className="py-3!"
                            />
                        </div>

                        <InputField
                            label={"Display Order"}
                            name="order"
                            type="number"
                            value={marqueeData.order}
                            onChange={handleChange}
                            placeholder="Sorting order (0, 1, 2...)"
                            className="py-3!"
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-(--text-main) font-semibold ml-1">Visibility Status</label>
                            <select
                                name="isVisible"
                                value={marqueeData.isVisible}
                                onChange={(e) => setMarqueeData(prev => ({ ...prev, isVisible: e.target.value === 'true' }))}
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
                            onClick={() => navigate('/marquee')}
                        />

                        <Button
                            title={"Save Marquee"}
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

export default AddMarquee;
