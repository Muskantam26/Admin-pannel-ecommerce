import React, { useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { getUserApi, toggleUserBlockApi, loginAsUserApi, toggleUserWithdrawalApi } from '../api/user-api';
import { MainHeading } from '../Component/Heading';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaNetworkWired, FaMoneyBillWave, FaLock, FaUnlock, FaSignInAlt, FaArrowLeft, FaEdit, FaBan, FaCheckCircle, FaWallet, FaIdCard, FaTimes } from 'react-icons/fa';
import UserCards from '../Component/UserCards';
import ConfirmationModal from '../Component/Model/ConfirmationModal';
import Modal from '../Component/Model/Modal';

import { FiFileText, FiDownload, FiShield, FiXCircle } from 'react-icons/fi';
import { PathRoutes } from '../constant/Path';
import IdentityCard from '../Component/IdentityCard';

const UserProfileDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);



    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        const res = await getUserApi(id);
        if (res.success) {
            setUser(res.data);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    const handleAction = (type) => {
        setModalConfig({ isOpen: true, type });
    };

    const confirmAction = async () => {
        let res;
        switch (modalConfig.type) {
            case 'block':
                res = await toggleUserBlockApi(user._id || user.id);
                break;
            case 'withdrawal':
                res = await toggleUserWithdrawalApi(user._id || user.id);
                break;
            case 'login':
                res = await loginAsUserApi(user._id || user.id);
                break;
            default:
                return;
        }

        if (res?.success) {
            toast.success(res.message);
            if (modalConfig.type === 'login') {
                window.open('/', '_blank');
            } else {
                fetchUserDetails();
            }
        } else {
            toast.error(res?.message || "Action Failed");
        }
        setModalConfig({ isOpen: false, type: '', data: null });
    };

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
    if (!user) return <div className="p-10 text-center text-red-500">User not found</div>;

    const InfoRow = ({ icon, label, value, isStatus }) => (
        <div className="flex items-center gap-3 py-3 border-b border-(--bs-border) last:border-0">
            <div className="text-(--text-second) text-lg opacity-70">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-(--text-second) uppercase font-semibold opacity-80">{label}</p>
                {isStatus ? value : <p className="text-(--text) font-medium break-all">{value || "N/A"}</p>}
            </div>
        </div>
    );



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-(--bs-btn-hover) text-(--text-second) bg-(--bg-box) rounded-lg transition-colors shadow-sm">
                        <FaArrowLeft />
                    </button>
                    <div className="relative">
                        <img
                            src={user.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                        />
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${user.active?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                    <div>
                        <MainHeading title={user.fullName || user.username} subtitle={`User ID: ${user.id || 'N/A'}`} />
                        <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.kyc ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                KYC {user.kyc ? 'Verified' : 'Pending'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.active?.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                {user.active?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleAction('login')}
                        className="flex items-center gap-2 px-4 py-2 bg-(--bs-btn) text-(--text-white) rounded-lg hover:opacity-90 transition-opacity shadow-sm font-medium text-sm"
                    >
                        <FaSignInAlt /> Login as User
                    </button>
                    <button
                        onClick={() => navigate(`/user-profile/edit/${user._id || user.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                    >
                        <FaEdit /> Edit Profile
                    </button>

                    <button
                        onClick={() => handleAction('withdrawal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-opacity shadow-sm hover:opacity-90 text-sm
                            ${user.active?.isWithdrawal ? 'bg-orange-500' : 'bg-green-600'}
                        `}
                    >
                        {user.active?.isWithdrawal ? <><FaBan /> Disable Withdrawal</> : <><FaCheckCircle /> Enable Withdrawal</>}
                    </button>

                    <button
                        onClick={() => handleAction('block')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-opacity shadow-sm hover:opacity-90 text-sm
                            ${user.active?.isBlocked ? 'bg-green-600' : 'bg-red-600'}
                        `}
                    >
                        {user.active?.isBlocked ? <><FaUnlock /> Unblock User</> : <><FaLock /> Block User</>}
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UserCards
                    icon={<FaMoneyBillWave className="text-green-600" />}
                    totalorders={"Total Income"}
                    iconBg='bg-green-100'
                    amount={`₹${user.income?.totalIncome?.toLocaleString() || 0}`}
                />
                <UserCards
                    icon={<FaWallet className="text-blue-600" />}
                    totalorders={"Total Deposit"}
                    iconBg='bg-blue-100'
                    amount={`₹${user.deposit?.toLocaleString() || 0}`}
                />
                <UserCards
                    icon={<FaMoneyBillWave className="text-purple-600" />}
                    totalorders={"Total Investment"}
                    iconBg='bg-purple-100'
                    amount={`₹${user.investment?.toLocaleString() || 0}`}
                />
                <UserCards
                    icon={<FaNetworkWired className="text-yellow-600" />}
                    totalorders={"Total Downline"}
                    iconBg='bg-yellow-100'
                    amount={user.totalDownlineUsers || 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaUser className="text-(--bs-text-primary)" /> Personal Details
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaUser />} label="Full Name" value={user.fullName} />
                        <InfoRow icon={<FaUser />} label="Username" value={user.username} />
                        <InfoRow icon={<FaEnvelope />} label="Email" value={user.email} />
                        <InfoRow icon={<FaPhone />} label="Mobile" value={user.mobile} />
                        <InfoRow icon={<FaCalendarAlt />} label="Joined Date" value={new Date(user.createdAt).toLocaleDateString()} />
                        <InfoRow icon={<FaIdCard />} label="Sponsor" value={`${user.sponsor?.username || 'N/A'} (${user.sponsor?.fullName || 'N/A'})`} />
                        <InfoRow icon={<FaCalendarAlt />} label="Active Date" value={user.active?.activeDate ? new Date(user.active.activeDate).toLocaleDateString() : 'Not Active'} />
                    </div>
                </div>

                {/* KYC & Bank Info */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaIdCard className="text-(--bs-text-primary)" /> KYC & Security
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaCheckCircle />} label="KYC Status" isStatus value={
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.kyc ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {user.kyc ? "Verified" : "Pending"}
                            </span>
                        } />
                        <InfoRow icon={<FaCalendarAlt />} label="KYC Date" value={user.kycDate ? new Date(user.kycDate).toLocaleDateString() : "N/A"} />
                        <InfoRow icon={<FaBan />} label="Withdrawal" isStatus value={
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.active?.isWithdrawal ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {user.active?.isWithdrawal ? "Enabled" : "Disabled"}
                            </span>
                        } />
                        <InfoRow icon={<FaBan />} label="Block Status" isStatus value={
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.active?.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {user.active?.isBlocked ? "Blocked" : "Active"}
                            </span>
                        } />
                    </div>
                </div>

                {/* Income Details */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaMoneyBillWave className="text-(--bs-text-primary)" /> Income Breakdown
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaMoneyBillWave />} label="Direct Income" value={`₹${user.income?.directBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="Level Income" value={`₹${user.income?.levelBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="ROI Income" value={`₹${user.income?.roiBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="Rank Reward" value={`₹${user.income?.rankBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaWallet />} label="Wallet Balance" value={`₹${user.deposit?.toLocaleString() || 0}`} />
                    </div>
                </div>
            </div>

            {/* Bank Details */}
            <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-(--text)">
                    <FaWallet className="text-(--bs-text-primary)" /> Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.bankDetails?.length > 0 ? (
                        user.bankDetails.map((bank, index) => (
                            <div key={index} className="relative overflow-hidden group bg-white  rounded-xl border border-(--bs-border) p-5 hover:shadow-lg transition-all duration-300">

                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaMoneyBillWave size={60} />
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                            <FaNetworkWired size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-(--text) uppercase tracking-wide">{bank.bankName}</h4>
                                            <p className="text-xs text-(--text-second) font-medium">{bank.branchName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {bank.isDefault && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold shadow-sm">
                                            DEFAULT
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-(--text-second) uppercase tracking-wider mb-0.5">Account Number</p>
                                            <p className="font-mono text-sm font-bold text-(--text) tracking-wide">{bank.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-(--text-second) uppercase tracking-wider mb-0.5">IFSC Code</p>
                                            <p className="font-mono text-sm font-bold text-(--text)">{bank.ifscCode}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-bold text-(--text-second) uppercase tracking-wider mb-0.5">Account Holder</p>
                                            <p className="text-sm font-medium text-(--text) truncate">{bank.accountHolderName}</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-dashed border-(--bs-border) flex justify-between items-center">
                                        <span className="text-[10px] text-(--text-second) font-medium italic">Added on: {new Date().toLocaleDateString()}</span> {/* Placeholder for added date */}
                                        <span className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5
                                            ${bank.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                bank.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                                        `}>
                                            <span className={`w-2 h-2 rounded-full ${bank.status === 'VERIFIED' ? 'bg-green-500' : bank.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                            {bank.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <FaWallet className="mx-auto text-4xl text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">No bank details found for this user.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ID Card Section */}
            <div className="bg-(--bg-box) rounded-3xl p-8 shadow-sm border border-(--bs-border)">
                <IdentityCard user={user} />
            </div>

            {/* KYC Documents Section */}
            {user.kycdocs?.docs?.length > 0 && (
                <div className="bg-(--bg-box) rounded-3xl p-8 shadow-sm border border-(--bs-border)">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-(--bs-border)">
                        <h3 className="text-lg font-bold text-(--text) flex items-center gap-2">
                            <FiFileText className="text-(--bs-primary)" /> Submitted KYC Documents
                        </h3>
                        {/* Link to full KYC details if needed */}
                        <button
                            onClick={() => navigate(`/${PathRoutes.KYC_DETAILS}/${user.kycdocs._id}`)}
                            className="text-sm text-(--bs-primary) hover:underline flex items-center gap-1"
                        >
                            View Full Verification Details <FaArrowLeft className="rotate-180" size={10} />
                        </button>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${user.kycdocs.docs.length > 3 ? 3 : user.kycdocs.docs.length} gap-6`}>
                        {user.kycdocs.docs.map((doc, idx) => (
                            <div key={idx} className="bg-(--bg-main) rounded-2xl p-5 border border-(--bs-border) w-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-second) block mb-1">Document Type</span>
                                        <h4 className="font-bold text-(--text)">{doc.type?.replace('_', ' ')}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-second) block mb-1">Number</span>
                                        <p className="font-mono text-sm bg-white px-2 py-1 rounded border border-(--bs-border) text-(--text)">{doc.number}</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-4 grid md:grid-cols-2 grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-xs text-(--text-second) mb-2 font-medium">Front Side</p>
                                        <div
                                            onClick={() => setPreviewImage(doc.front)}
                                            className="block w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative group border border-(--bs-border) cursor-pointer"
                                        >
                                            <img src={doc.front} alt="Front" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm">
                                                <span className="bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/40 flex items-center gap-2 text-sm font-medium backdrop-blur-md">
                                                    <FiShield size={16} /> View Preview
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {doc.back && (
                                        <div>
                                            <p className="text-xs text-(--text-second) mb-2 font-medium">Back Side</p>
                                            <div
                                                onClick={() => setPreviewImage(doc.back)}
                                                className="block w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative group border border-(--bs-border) cursor-pointer"
                                            >
                                                <img src={doc.back} alt="Back" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm">
                                                    <span className="bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/40 flex items-center gap-2 text-sm font-medium backdrop-blur-md">
                                                        <FiShield size={16} /> View Preview
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={confirmAction}
                title={
                    modalConfig.type === 'block' ? (user.active?.isBlocked ? "Unblock User" : "Block User") :
                        modalConfig.type === 'withdrawal' ? (user.active?.isWithdrawal ? "Disable Withdrawal" : "Enable Withdrawal") :
                            "Login As User"
                }
                message={
                    modalConfig.type === 'block' ? `Are you sure you want to ${user.active?.isBlocked ? "unblock" : "block"} ${user.username}?` :
                        modalConfig.type === 'withdrawal' ? `Are you sure you want to ${user.active?.isWithdrawal ? "disable" : "enable"} withdrawal for ${user.username}?` :
                            `Are you sure you want to login to the user panel as ${user.username}?`
                }
                isDanger={modalConfig.type === 'block' && !user.active?.isBlocked}
                confirmText={
                    modalConfig.type === 'block' ? (user.active?.isBlocked ? "Unblock" : "Block") :
                        modalConfig.type === 'withdrawal' ? (user.active?.isWithdrawal ? "Disable" : "Enable") :
                            "Login"
                }
            />

            {/* Image Preview Modal */}
            <Modal isOpen={!!previewImage}>
                <div className="p-4 relative flex flex-col items-center">
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 transition"
                    >
                        <FiXCircle size={28} />
                    </button>

                    <div className="w-full flex justify-center mb-6 mt-4">
                        <img
                            src={previewImage}
                            alt="Document Preview"
                            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                        />
                    </div>

                    <a
                        href={previewImage}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3 bg-(--bs-primary) text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-blue-500/20"
                    >
                        <FiDownload size={20} /> Download Document
                    </a>
                </div>
            </Modal>

            {/* Edit Profile Modal (Placeholder for now) */}
            <Modal isOpen={isEditOpen}>
                <div className="p-6 w-full max-w-lg bg-(--bg-box) rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-(--text)">Edit Profile</h3>
                        <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="py-4 text-center text-(--text-second) bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaEdit className="mx-auto mb-2 text-3xl opacity-50" />
                        <p>Edit functionality Coming Soon.</p>
                        <p className="text-xs">We can implement the form fields here.</p>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 rounded-lg border border-(--bs-border) text-(--text-second) hover:bg-(--bs-btn-hover)"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default UserProfileDetails;
