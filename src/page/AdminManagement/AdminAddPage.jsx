import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAdminByIdApi, createAdminApi, updateAdminFullApi, sendOtpApi, verifyOtpApi } from '../../api/admin-api';
import { PathRoutes } from '../../constant/Path';
import PageLoader from '../../Component/PageLoader';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';
import Button from '../../Component/Btn';
import OtpModal from '../../Component/Model/OtpModal';

import { PERMISSIONS_TREE, ROLES } from '../../constant/SidebarData';

const AdminAddPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const adminId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        password: '',
        role: 'STAFF',
        permissions: []
    });

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (adminId) {
            fetchAdminDetails();
        }
    }, [adminId]);

    const fetchAdminDetails = async () => {
        setLoading(true);
        try {
            const response = await getAdminByIdApi(adminId);
            if (response.success) {
                const { username, email, mobile, role, permissions } = response.data;
                setFormData({
                    username: username || '',
                    email: email || '',
                    mobile: mobile || '',
                    password: '',
                    role: role || 'STAFF',
                    permissions: permissions || []
                });
                setIsEmailVerified(true); // Assume existing admin email is verified
            }
        } catch (error) {
            toast.error("Failed to fetch admin details");
            navigate(PathRoutes.ADMIN_MANAGEMENT);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'email') {
            setIsEmailVerified(false); // Reset verification if email changes
        }
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error("Please enter an email address");
            return;
        }
        setVerifying(true);
        try {
            const response = await sendOtpApi({ email: formData.email });
            if (response.success) {
                toast.success("OTP sent to your email");
                setShowOtpModal(true);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        try {
            const response = await verifyOtpApi({ email: formData.email, otp });
            if (response.success) {
                toast.success("Email verified successfully");
                setIsEmailVerified(true);
                setShowOtpModal(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP");
            throw error; // Re-throw to handle loading state in modal if needed
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            toast.error("Please verify email address first");
            return;
        }

        setLoading(true);

        try {
            let response;
            if (adminId) {
                const updateData = { ...formData, adminId };
                if (!updateData.password) delete updateData.password;
                response = await updateAdminFullApi(updateData);
            } else {
                response = await createAdminApi(formData);
            }

            if (response.success) {
                toast.success(response.message);
                navigate(PathRoutes.ADMIN_MANAGEMENT);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading && adminId && !formData.email) return <PageLoader />;

    return (
        <div className="p-6 bg-(--bg-main) min-h-screen">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all shadow-sm"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-(--text-main)">
                                {adminId ? 'Edit Administrator' : 'Create New Administrator'}
                            </h1>
                            <p className="text-sm text-(--text-second) mt-1">
                                {adminId ? 'Update admin details and permissions' : 'Add a new admin to manage the platform'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-(--bs-btn) text-(--text-white) px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <FiSave size={18} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1">
                    <div className='grid grid-cols-12 gap-8'>
                        {/* Left Column: Profile Information */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            {/* Basic Details Card */}
                            <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                                    <span className="p-2 rounded-lg bg-blue-50 text-blue-600"><FiUser /></span>
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-(--text-second)">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FiUser />
                                            </div>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-(--bg-main) border border-(--bs-border) text-(--text-main) focus:ring-2 focus:ring-(--bs-primary)/20 focus:border-(--bs-primary) outline-none transition-all placeholder:text-gray-400"
                                                placeholder="johndoe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-(--text-second)">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FiMail />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className={`w-full pl-10 pr-24 py-3 rounded-xl bg-(--bg-main) border text-(--text-main) focus:ring-2 outline-none transition-all placeholder:text-gray-400 ${isEmailVerified
                                                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                                                    : 'border-(--bs-border) focus:border-(--bs-primary) focus:ring-(--bs-primary)/20'
                                                    }`}
                                                placeholder="john@example.com"
                                            />
                                            <div className="absolute inset-y-0 right-1 flex items-center">
                                                {isEmailVerified ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center gap-1">
                                                        <FiCheckCircle /> Verified
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={verifying || !formData.email}
                                                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {verifying ? 'Sending...' : 'Verify'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-(--text-second)">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FiPhone />
                                            </div>
                                            <input
                                                type="text"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-(--bg-main) border border-(--bs-border) text-(--text-main) focus:ring-2 focus:ring-(--bs-primary)/20 focus:border-(--bs-primary) outline-none transition-all placeholder:text-gray-400"
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Card */}
                            <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                                    <span className="p-2 rounded-lg bg-red-50 text-red-600"><FiLock /></span>
                                    Security
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-(--text-second)">
                                            {adminId ? 'New Password' : 'Password'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FiLock />
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!adminId}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-(--bg-main) border border-(--bs-border) text-(--text-main) focus:ring-2 focus:ring-(--bs-primary)/20 focus:border-(--bs-primary) outline-none transition-all placeholder:text-gray-400"
                                                placeholder={adminId ? "Leave blank to keep current" : "Create a strong password"}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Must be at least 8 characters with numbers and symbols.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Roles & Permissions */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            {/* Role Selection */}
                            <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                                    <span className="p-2 rounded-lg bg-orange-50 text-orange-600"><FiShield /></span>
                                    Role Assignment
                                </h2>
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-(--text-second)">Select Role</label>
                                    <div className="space-y-3">
                                        {ROLES.map(role => (
                                            <label
                                                key={role}
                                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.role === role
                                                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                    : 'border-(--bs-border) hover:bg-(--bg-hover)'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value={role}
                                                        checked={formData.role === role}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className={`font-medium ${formData.role === role ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {role}
                                                    </span>
                                                </div>
                                                {formData.role === role && <FiCheckCircle className="text-blue-600" />}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Selection */}
                        </div>
                    </div>
                    <div className="bg-(--bg-box) rounded-2xl border border-(--bs-border) p-8 shadow-sm w-full mt-4">
                        <h2 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-purple-50 text-purple-600"><FiCheckCircle /></span>
                            Access Permissions
                        </h2>
                        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {PERMISSIONS_TREE.map((group) => (
                                <div key={group.value} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                                    {/* Parent Permission */}
                                    <label className="flex items-center gap-3 cursor-pointer group mb-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(group.value)
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 group-hover:border-blue-400 bg-white'
                                            }`}>
                                            {formData.permissions.includes(group.value) && <FiCheckCircle size={14} />}
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(group.value)}
                                                onChange={() => handlePermissionChange(group.value)}
                                                className="hidden"
                                            />
                                        </div>
                                        <span className={`font-semibold transition-colors ${formData.permissions.includes(group.value) ? 'text-blue-700' : 'text-gray-800'
                                            }`}>
                                            {group.label}
                                        </span>
                                    </label>

                                    {/* Child Permissions */}
                                    {group.children.length > 0 && (
                                        <div className="ml-8 grid grid-cols-1 md:grid-cols-1 gap-2">
                                            {group.children.map(child => (
                                                <label
                                                    key={child.value}
                                                    className="flex items-center gap-3 cursor-pointer group"
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(child.value)
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'border-gray-300 group-hover:border-blue-400 bg-white'
                                                        }`}>
                                                        {formData.permissions.includes(child.value) && <FiCheckCircle size={10} />}
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.permissions.includes(child.value)}
                                                            onChange={() => handlePermissionChange(child.value)}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                    <span className={`text-sm transition-colors ${formData.permissions.includes(child.value) ? 'text-blue-700' : 'text-gray-600'
                                                        }`}>
                                                        {child.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </form>
            </div>

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                email={formData.email}
                onVerify={handleVerifyOtp}
            />
        </div>
    );
};

export default AdminAddPage;
