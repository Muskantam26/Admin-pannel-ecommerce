import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

const UserProfileDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const idCardRef = useRef(null);

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

    const handleDownloadPNG = async () => {
        if (idCardRef.current) {
            try {
                const canvas = await html2canvas(idCardRef.current, { scale: 2, useCORS: true });
                const link = document.createElement('a');
                link.download = `${user.fullName || 'User'}_ID_Card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error("Error downloading PNG:", error);
                toast.error("Failed to download ID Card");
            }
        }
    };

    const handleDownloadPDF = async () => {
        if (idCardRef.current) {
            try {
                const canvas = await html2canvas(idCardRef.current, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // Center the image
                const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
                const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

                pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
                pdf.save(`${user.fullName || 'User'}_ID_Card.pdf`);
            } catch (error) {
                console.error("Error downloading PDF:", error);
                toast.error("Failed to download ID Card PDF");
            }
        }
    };

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
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                    <FaWallet className="text-(--bs-text-primary)" /> Bank Details
                </h3>
                <div className="space-y-3">
                    {user.bankDetails?.length > 0 ? (
                        user.bankDetails.map((bank, index) => (
                            <div key={index} className="p-3 bg-(--bg-main) rounded-xl border border-(--bs-border)">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm text-(--text)">{bank.bankName}</h4>
                                    {bank.isDefault && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-(--text-second)">A/C: <span className="text-(--text) font-medium">{bank.accountNumber}</span></p>
                                    <p className="text-xs text-(--text-second)">IFSC: <span className="text-(--text) font-medium">{bank.ifscCode}</span></p>
                                    <p className="text-xs text-(--text-second)">Branch: <span className="text-(--text) font-medium">{bank.branchName || 'N/A'}</span></p>
                                    <p className="text-xs text-(--text-second)">Holder: <span className="text-(--text) font-medium">{bank.accountHolderName}</span></p>
                                    <p className="text-xs mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${bank.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : bank.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {bank.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-(--text-second) text-center py-4 italic">No bank details found.</p>
                    )}
                </div>
            </div>

            {/* ID Card Section */}
            <div className="bg-(--bg-box) rounded-3xl p-8 shadow-sm border border-(--bs-border)">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-(--text)">
                        <FaIdCard className="text-(--bs-text-primary)" /> Identity Card
                    </h3>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPNG}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold"
                        >
                            <FiDownload /> Download PNG
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-semibold"
                        >
                            <FiFileText /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-start">
                    {/* ID Card Design */}
                    <div ref={idCardRef} className="relative w-full max-w-[480px] aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl text-white select-none">
                        {/* Background */}
                        <div className="absolute inset-0 bg-[#1a3c2f] z-0">
                            {/* Texture/Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a5c48] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0f261e] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1px', borderStyle: 'solid' }}>
                                        <FaCheckCircle className="text-[#a8d5ba]" size={20} />
                                    </div>
                                    <span className="text-2xl font-serif tracking-wide font-bold">AYURVEDA</span>
                                </div>
                                <div className="opacity-80">
                                    <FiShield size={24} />
                                </div>
                            </div>

                            {/* Middle - Photo & Details */}
                            <div className="flex items-center gap-6 my-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-2 border-[#a8d5ba] p-1">
                                        <img
                                            src={user.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover bg-white"
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-[#a8d5ba] text-[#1a3c2f] rounded-full p-1 border-2 border-[#1a3c2f]">
                                        <FaCheckCircle size={12} />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold font-serif mb-1">{user.fullName || user.username}</h2>
                                    <p className="text-[#a8d5ba] font-medium tracking-wider text-sm uppercase mb-1">
                                        {user.basicDetails?.rankName || "Distributor"}
                                    </p>
                                    <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                        ID: {user.id || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-[#a8d5ba] uppercase tracking-wider mb-1">Valid Thru</p>
                                    <p className="font-mono text-lg font-bold">12/2028</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {/* Signature Placeholder */}
                                    <div className="text-center">
                                        <p className="font-cursive text-xl opacity-90 leading-none" style={{ fontFamily: 'cursive' }}>{user.fullName?.split(' ')[0] || user.username} S.</p>
                                        <div className="h-px w-24 my-1" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                                        <p className="text-[8px] text-[#a8d5ba] uppercase tracking-wider">Authorized Signature</p>
                                    </div>

                                    {/* QR Placeholder */}
                                    {/* <div className="w-10 h-10 bg-white rounded-lg p-0.5">
                                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.id}`} alt="QR" className="w-full h-full" />
                                     </div> */}
                                </div>
                            </div>
                            <div className="absolute bottom-6 right-6">
                                <div className="w-12 h-12 bg-white rounded-xl p-1">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.id}`} alt="QR" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            )}

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
        </div>
    );
};

export default UserProfileDetails;
