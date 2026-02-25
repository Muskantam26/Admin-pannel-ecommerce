import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminByIdApi } from '../../api/admin-api';
import { PathRoutes } from '../../constant/Path';
import PageLoader from '../../Component/PageLoader';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { Mail, Phone, Calendar, User, Shield, Key, IdCard, CheckCircle2 } from 'lucide-react';
import Button from '../../Component/Btn';
import { Heading, MainHeading } from '../../Component/Heading';

const AdminDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getAdminByIdApi(id);
                if (response.success) {
                    setAdmin(response.data);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Failed to fetch admin details");
                navigate(PathRoutes.ADMIN_MANAGEMENT);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id, navigate]);

    if (loading) return <PageLoader />;
    if (!admin) return null;

    return (
        <div className="p-4 sm:p-6 bg-(--bg-main) min-h-screen">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate(-1)}
                            bg="bg-(--bg-box)"
                            text="text-(--text-second)"
                            className="p-2.5 rounded-xl border border-(--bs-border) hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm flex items-center justify-center"
                        >
                            <FiArrowLeft size={20} />
                        </Button>
                        <MainHeading 
                             title="Admin Profile"
                             subtitle="View and manage admin details"
                        />
                    </div>
                    <Button
                        onClick={() => navigate(`${PathRoutes.ADD_ADMIN}?id=${admin._id || admin.id}`)}
                        bg="bg-(--btn-hover)"
                        text="text-(--text-hover)"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-sm font-semibold"
                    >
                        <FiEdit size={16} /> Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-8 text-center shadow-sm relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
                            
                            <div className="relative w-28 h-28 mx-auto rounded-full bg-white dark:bg-(--bg-main) flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 overflow-hidden border-4 border-white dark:border-(--bg-box) shadow-lg mt-8">
                                {admin.picture ? (
                                    <img src={admin.picture} alt={admin.username} className="w-full h-full object-cover" />
                                ) : (
                                    admin.username?.charAt(0).toUpperCase()
                                )}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-(--text-main) tracking-tight">{admin.username}</h2>
                            
                            <div className="mt-4 flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border
                                    ${admin.role === 'SUPER-ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800' :
                                        admin.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' :
                                            'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                                    <Shield size={14} />
                                {admin.role}
                            </span>
                        </div>
                    </div>

                        {/* Quick Contact Info */}
                        <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-6 shadow-sm">
                            <div className="mb-5">
                                <Heading title="Contact Info" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1 w-0">
                                        <p className="text-xs text-(--text-third) font-medium mb-0.5">Email Address</p>
                                        <p className="text-sm font-semibold text-(--text-main) truncate">{admin.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex-1 w-0">
                                        <p className="text-xs text-(--text-third) font-medium mb-0.5">Phone Number</p>
                                        <p className="text-sm font-semibold text-(--text-main) truncate">{admin.mobile || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-(--bs-border) border-dashed">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-500">
                                    <User size={20} />
                                </div>
                                <Heading title="Account Information" />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <IdCard size={14} className="text-(--text-third)" />
                                        <p className="text-xs font-semibold text-(--text-third) uppercase tracking-wider">Admin ID</p>
                                    </div>
                                    <p className="text-base font-bold text-(--text-main) font-mono bg-(--bg-main) p-3 rounded-xl border border-(--bs-border) group-hover:border-blue-300 transition-colors">
                                        {admin.id}
                                    </p>
                                </div>
                                
                                <div className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={14} className="text-(--text-third)" />
                                        <p className="text-xs font-semibold text-(--text-third) uppercase tracking-wider">Date Joined</p>
                                    </div>
                                    <p className="text-base font-bold text-(--text-main) bg-(--bg-main) p-3 rounded-xl border border-(--bs-border) group-hover:border-blue-300 transition-colors">
                                        {new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>

                                <div className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User size={14} className="text-(--text-third)" />
                                        <p className="text-xs font-semibold text-(--text-third) uppercase tracking-wider">Created By</p>
                                    </div>
                                    <p className="text-base font-bold text-(--text-main) bg-(--bg-main) p-3 rounded-xl border border-(--bs-border) group-hover:border-blue-300 transition-colors">
                                        {admin.createdBy || 'System Configuration'}
                                    </p>
                                </div>
                                
                                <div className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield size={14} className="text-(--text-third)" />
                                        <p className="text-xs font-semibold text-(--text-third) uppercase tracking-wider">Account Status</p>
                                    </div>
                                    <div className="bg-(--bg-main) p-3 rounded-xl border border-(--bs-border) group-hover:border-blue-300 transition-colors flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-base font-bold text-(--text-main)">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-6 sm:p-8 shadow-sm">
                             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-(--bs-border) border-dashed">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-500">
                                    <Key size={20} />
                                </div>
                                <Heading title="Assigned Permissions" />
                            </div>
                            
                            <div className="flex flex-wrap gap-2.5">
                                {admin.permissions?.length > 0 ? (
                                    admin.permissions.map((perm, index) => (
                                        <div key={index} className="flex items-center gap-2 px-4 py-2 bg-(--bg-main) border border-(--bs-border) rounded-xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
                                            <CheckCircle2 size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-semibold text-(--text-main) text-sm tracking-wide">
                                            {perm.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-(--bs-border) rounded-xl bg-(--bg-main)">
                                        <Shield size={32} className="text-(--text-third) mb-3" />
                                        <p className="text-(--text-main) font-bold">No specific permissions</p>
                                        <p className="text-sm text-(--text-second) mt-1">This user inherits default permissions from their role.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailsPage;
