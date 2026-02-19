import React, { useState, useEffect } from 'react'
import { MainHeading } from '../Component/Heading'
import { IoDiamond } from "react-icons/io5";
import { FaCrown, FaGem, FaBoxOpen, FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import AddNewPackage from "./AddNewPackage";
import { getAllPackagesApi, createPackageApi, updatePackageApi, deletePackageApi } from "../api/package-api";
import { toast } from "react-toastify";

import ConfirmationModal from "../Component/Model/ConfirmationModal";
import PageLoader from '../Component/PageLoader';




const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await getAllPackagesApi();
            console.log(res);
            if (res.success) {
                setPackages(res.data || []);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
             toast.error("Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePackage = async (data) => {
        let res;
        if (editingPackage) {
            res = await updatePackageApi(editingPackage._id, data);
        } else {
            res = await createPackageApi(data);
        }

        if (res.success) {
            toast.success(res.message || "Saved successfully");
            setIsAddPackageOpen(false);
            setEditingPackage(null);
            fetchPackages();
        } else {
            toast.error(res.message || "Failed to save");
        }
    };

    const handleDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    }

    const onConfirmDelete = async () => {
        if (!deleteModal.id) return;

        try {
            const res = await deletePackageApi(deleteModal.id);
            if (res.success) {
                toast.success(res.message);
                fetchPackages();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error deleting package");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    }

    const openAdd = () => {
        setEditingPackage(null);
        setIsAddPackageOpen(true);
    }

    const openEdit = (pkg) => {
        setEditingPackage(pkg);
        setIsAddPackageOpen(true);
    }

    const getIcon = (pkg) => {
        const name = pkg.name?.toLowerCase() || "";
        if (name.includes('diamond')) return <IoDiamond className="text-4xl text-[#9DB29B]" />;
        if (name.includes('gold')) return <FaCrown className="text-4xl text-yellow-500" />;
        if (name.includes('silver')) return <FaGem className="text-4xl text-gray-400" />;
        return <FaBoxOpen className="text-4xl text-orange-400" />;
    };

    return (
        <div className='space-y-6'>
            {!isAddPackageOpen ? (
                <>
                    <div className='flex justify-between items-center'>
                        <MainHeading
                            title={"Membership Packages"}
                            subtitle={"Choose the best plan for your needs"}
                        />
                        <button
                            onClick={openAdd}
                            className='bg-(--bs-btn) text-(--text-white) px-4 py-2 rounded-lg text-sm font-medium cursor-pointer'>
                            Add New Package
                        </button>
                    </div>

                    {loading ? <PageLoader/> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg._id}
                                    className={`relative rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center
                         ${pkg.theme === 'dark'
                                            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border border-gray-700 shadow-xl'
                                            : 'bg-white text-gray-800 border border-gray-100 shadow-lg'
                                        }
                     `}
                                >
                                    {/* Badge for Diamond or Best Value logic if needed */}
                                    {pkg.name?.toLowerCase().includes('diamond') && (
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                                            Best Value
                                        </div>
                                    )}

                                    {/* Icon Circle */}
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg
                         ${pkg.theme === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-100'}
                     `}>
                                        {getIcon(pkg)}
                                    </div>

                                    <h2 className={`text-2xl font-bold mb-2 ${pkg.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {pkg.name}
                                    </h2>

                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className={`text-3xl font-extrabold ${pkg.theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            ₹{pkg.price?.toLocaleString()}
                                        </span>
                                        {pkg.mrp && pkg.mrp > pkg.price && (
                                            <span className={`text-sm decoration-line-through ${pkg.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                ₹{pkg.mrp?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    

                                    {/* Stats Grid */}
                                    <div className={`w-full grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl
                         ${pkg.theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}
                     `}>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">C.T.O Limit</p>
                                            <p className="font-bold text-sm">{pkg.cto}</p>
                                        </div>
                                        <div className="text-center border-l border-gray-200/20">
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">Point Value</p>
                                            <p className="font-bold text-sm">{pkg.pv}</p>
                                        </div>
                                    </div>

                                    {/* Benefits List */}
                                    <ul className="w-full space-y-3 mb-8 text-left h-32 overflow-y-auto custom-scrollbar">
                                        {pkg.benefits?.map((benefit, index) => (
                                            <li key={index} className="flex items-center text-sm gap-3">
                                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                     ${pkg.theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}
                                 `}>
                                                    <FaCheck size={10} />
                                                </span>
                                                <span className="opacity-90">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 w-full mt-auto">
                                        <button
                                            onClick={() => openEdit(pkg)}
                                            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1
                                ${pkg.theme === 'dark'
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                                                }
                            `}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg._id)}
                                            className={`px-3 py-2 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center
                                ${pkg.theme === 'dark'
                                                    ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                                                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                                                }
                            `}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <ConfirmationModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, id: null })}
                        onConfirm={onConfirmDelete}
                        title="Delete Package"
                        message="Are you sure you want to delete this package? This action cannot be undone."
                    />

                </>
            ) : (
                <AddNewPackage
                    onClose={() => setIsAddPackageOpen(false)}
                    onSaveClick={handleSavePackage}
                    initialData={editingPackage}
                />
            )}
        </div>
    )
}

export default Packages
