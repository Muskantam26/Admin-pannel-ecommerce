import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminByIdApi } from '../../api/admin-api';
import { PathRoutes } from '../../constant/Path';
import PageLoader from '../../Component/PageLoader';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

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
        <div className="p-6 bg-(--bg-main) min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-(--bg-hover) text-(--text-second) hover:text-(--text-main) transition-colors"
                        >
                            <FiArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-main)">Admin Details</h1>
                    </div>
                    <button
                        onClick={() => navigate(`${PathRoutes.ADD_ADMIN}?id=${admin._id || admin.id}`)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-(--bs-primary) text-(--bs-primary) rounded-lg hover:bg-(--bs-primary) hover:text-white transition-all font-medium"
                    >
                        <FiEdit /> Edit Admin
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-(--bg-box) rounded-xl border border-(--bs-border) p-6 text-center shadow-sm">
                            <div className="w-24 h-24 mx-auto rounded-full bg-(--bs-primary)/10 flex items-center justify-center text-(--bs-primary) text-3xl font-bold mb-4 overflow-hidden border-2 border-(--bg-main) shadow-md">
                                {admin.picture ? (
                                    <img src={admin.picture} alt={admin.username} className="w-full h-full object-cover" />
                                ) : (
                                    admin.username?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-(--text-main) mb-1">{admin.username}</h2>
                            <p className="text-(--text-second) mb-3 break-all">{admin.email}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                                ${admin.role === 'SUPER-ADMIN' ? 'bg-purple-100 text-purple-700' :
                                    admin.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'}`}>
                                {admin.role}
                            </span>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2">
                        <div className="bg-(--bg-box) rounded-xl border border-(--bs-border) p-6 shadow-sm mb-6">
                            <h3 className="text-lg font-bold text-(--text-main) mb-4 border-b border-(--bs-border) pb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-(--text-third) mb-1">User ID</p>
                                    <p className="text-base font-medium text-(--text-main) font-mono">{admin.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-third) mb-1">Mobile</p>
                                    <p className="text-base font-medium text-(--text-main)">{admin.mobile || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-third) mb-1">Created At</p>
                                    <p className="text-base font-medium text-(--text-main)">{new Date(admin.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-third) mb-1">Created By</p>
                                    <p className="text-base font-medium text-(--text-main)">{admin.createdBy || 'System'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="bg-(--bg-box) rounded-xl border border-(--bs-border) p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-(--text-main) mb-4 border-b border-(--bs-border) pb-2">Permissions/Scopes</h3>
                            <div className="flex flex-wrap gap-2">
                                {admin.permissions?.length > 0 ? (
                                    admin.permissions.map((perm, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-(--bg-main) border border-(--bs-border) rounded-md text-sm text-(--text-second)">
                                            {perm.replace(/_/g, ' ')}
                                            </span>
                                    ))
                                ) : (
                                    <p className="text-(--text-third) italic">No specific permissions assigned.</p>
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
