import React, { useState, useEffect } from 'react';
import { Heading, MainHeading } from '../Component/Heading';
import { InputField } from '../Component/InputBox';
import Button from '../Component/Btn';
import { FiSave, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { RxCrossCircled } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import BannerImg from "../assets/Bannerone.png"

const EditBanner = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock Data - In a real app, you would fetch this based on the ID
    const [bannerData, setBannerData] = useState({
        name: 'Summer Sale 2026',
        type: 'Slider Banner',
        page: 'Home Page',
        link: '/products/summer-sale',
        position: '1',
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        device: 'All Devices',
        status: 'Active',
        altText: 'Summer Sale Banner 50% Off',
        discount: '50% OFF',
        promoCode: 'SUMMER50',
        description: 'Exclusive summer sale on all electronics and fashion items. Limited time offer.',
        remarks: 'Priority placement requested by marketing team.',
        images: [
            { id: 1, src: BannerImg },
            { id: 2, src: BannerImg } 
        ]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBannerData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImgs = files.map((file, index) => ({
            id: Date.now() + index,
            src: URL.createObjectURL(file), 
            file: file
        }));

        setBannerData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }));
    };

    const removeImage = (id) => {
        setBannerData(prev => ({
            ...prev,
            images: prev.images.filter((img) => img.id !== id)
        }));
    };

    const handleSubmit = () => {
        console.log("Banner Updated:", bannerData);
        // Add Update API call here
        navigate('/site-manager');
    };

    return (
        <div>
             <MainHeading
                title={"Edit Banner"}
                subtitle={"Update banner details and configuration"}
            />

            <div className='rounded-xl shadow-2xl mt-5 bg-(--bg-box) p-5 space-y-5 animate-fade-in-up'>
                
                <div className='flex flex-row justify-between items-center'>
                    <Heading title={`Edit Banner #${id}`} />
                    <button
                        className="text-(--bs-btn-second)"
                        onClick={() => navigate('/site-manager')}
                    >
                        <RxCrossCircled
                            className="bg-(--bs-btn-second) text-(--text-white) rounded-2xl cursor-pointer hover:opacity-80 transition-opacity"
                            size={20}
                        />
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5'>
                    <InputField 
                        label={"Banner Name"}
                        name="name"
                        value={bannerData.name}
                        onChange={handleChange}
                        placeholder="e.g. Summer Sale"
                    />
                    <InputField 
                        label={"Banner Type"}
                        name="type"
                        value={bannerData.type}
                        onChange={handleChange}
                        placeholder="Slider / Group / Promo"
                    />
                    <InputField 
                        label={"Page Location"}
                        name="page"
                        value={bannerData.page}
                        onChange={handleChange}
                        placeholder="Home / Product / Contact"
                    />
                     <InputField 
                        label={"Target Link / Route"}
                        name="link"
                        value={bannerData.link}
                        onChange={handleChange}
                        placeholder="/products/sale"
                    />
                    <InputField 
                        label={"Display Position"}
                        name="position"
                        value={bannerData.position}
                        onChange={handleChange}
                        placeholder="1, 2, 3..."
                    />
                    <InputField 
                        label={"Device Visibility"}
                        name="device"
                        value={bannerData.device}
                        onChange={handleChange}
                        placeholder="All / Mobile / Desktop"
                    />
                    <InputField 
                        label={"Start Date"}
                        name="startDate"
                        type="date"
                        value={bannerData.startDate}
                        onChange={handleChange}
                    />
                     <InputField 
                        label={"End Date"}
                        name="endDate"
                        type="date"
                        value={bannerData.endDate}
                        onChange={handleChange}
                    />
                    <InputField 
                        label={"Status"}
                        name="status"
                        value={bannerData.status}
                        onChange={handleChange}
                        placeholder="Active / Inactive"
                    />
                    <InputField 
                        label={"Alt Text (SEO)"}
                        name="altText"
                        value={bannerData.altText}
                        onChange={handleChange}
                        placeholder="Describe the image"
                    />
                    <InputField 
                        label={"Discount Offer"}
                        name="discount"
                        value={bannerData.discount}
                        onChange={handleChange}
                        placeholder="e.g. 50% OFF"
                    />
                    <InputField 
                        label={"Promo Code"}
                        name="promoCode"
                        value={bannerData.promoCode}
                        onChange={handleChange}
                        placeholder="SUMMER50"
                    />
                </div>

                <Heading
                    title={"Detailed Description (Words Limit 1000)"}
                    titleSize='text-xs'
                />
                <textarea
                    name="description"
                    value={bannerData.description}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1000}
                    placeholder="Enter detailed banner description..."
                    className="w-full border border-(--input-border) rounded-md p-2 text-xs text-(--text-second) outline-none focus:border-blue-500"
                />

                <Heading
                    title={"Remarks / Internal Notes (Words Limit 500)"}
                    titleSize='text-xs'
                />
                <textarea
                    name="remarks"
                    value={bannerData.remarks}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                     placeholder="Enter internal notes..."
                    className="w-full border border-(--input-border) rounded-md p-2 text-xs text-(--text-second) outline-none focus:border-blue-500"
                />

                <Heading
                    title={"Banner Images"}
                    titleSize='text-xs'
                />
                
                 {/* Upload Trigger */}
                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-(--border-color) border-dashed rounded-xl cursor-pointer bg-(--bg-main) hover:border-blue-500 transition-colors mb-4">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud className="w-8 h-8 text-(--text-third) mb-2" />
                        <p className="mb-1 text-sm text-(--text-main) font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-(--text-third)">PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                    {bannerData.images.map((item) => (
                        <div key={item.id} className="relative group">
                            <img
                                src={item.src}
                                alt="banner preview"
                                className="rounded-2xl w-full h-32 object-cover border border-(--border-color)"
                            />
                            {/* Cross icon */}
                             <RxCrossCircled
                                size={20}
                                onClick={() => removeImage(item.id)}
                                className="absolute top-2 right-2 cursor-pointer 
                                bg-(--bs-btn-second) text-(--text-white) rounded-full shadow-md hover:bg-red-500 transition-colors"
                            />
                        </div>
                    ))}
                </div>

                <div className='flex gap-3 items-center justify-center mt-10 border-t border-(--border-color) pt-6'>
                    <Button
                        title={"Cancel"}
                        className='p-2 text-xs rounded-sm shadow-2xl px-5 border border-(--border-color) bg-transparent text-(--text-main)'
                        onClick={() => navigate('/site-manager')}
                    />

                    <Button
                        title={"Update Banner"}
                        className='p-2 text-xs rounded-sm shadow-2xl bg-(--bs-btn-third) px-5 text-white'
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditBanner;
