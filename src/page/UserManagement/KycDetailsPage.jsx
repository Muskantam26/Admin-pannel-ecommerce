import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiUser, FiFileText, FiDownload, FiClock, FiCalendar, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '../../Component/Model/Modal';
import ConfirmationModal from '../../Component/Model/ConfirmationModal';
import { Axios } from '../../constant/MainContent';
import { verifyKycApi } from '../../api/kyc-api';

const KycDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Rejection Modal State
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        title: "",
        message: "",
        isDanger: false
    });

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchKycDetails();
    }, [id]);

    const fetchKycDetails = async () => {
        setLoading(true);
        try {
            const res = await Axios.get(`/kyc/admin/${id}`);
            if (res.data.success) {
                setKycData(res.data.data);
            } else {
                toast.error("Failed to load KYC details");
            }
        } catch (error) {
            console.error("KYC Fetch Error", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerApprove = () => {
        setConfirmModal({
            isOpen: true,
            type: 'APPROVED',
            title: "Approve KYC",
            message: "Are you sure you want to approve this KYC? The user will be marked as verified.",
            isDanger: false
        });
    };

    // Actual API Call
    const handleFinalAction = async () => {
        const { type } = confirmModal;
        const reason = type === 'REJECTED' ? rejectReason : null;

        setActionLoading(true);
        try {
            const res = await verifyKycApi({
                kycId: id,
                status: type,
                reason
            });

            if (res.success) {
                toast.success(`KYC ${type} successfully`);
                fetchKycDetails();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            } else {
                toast.error(res.message || "Action failed");
            }
        } catch (error) {
            console.error("Verification Error", error);
            toast.error("Something went wrong");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-[var(--text-second)]">Loading Details...</div>;
    if (!kycData) return <div className="p-20 text-center text-red-500 font-bold">KYC Not Found or Error Loading.</div>;

    const { user, docs, status, reason, createdAt } = kycData;

    return (
        <div className="pb-20 min-h-screen bg-[var(--bg-main)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-[var(--bg-main)] border border-[var(--bs-border)] hover:bg-[var(--bg-box)] rounded-xl text-[var(--text-second)] cursor-pointer transition shadow-sm">
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-main)]">KYC Verification Details</h1>
                        <p className="text-sm text-[var(--text-second)] flex items-center gap-2 mt-1">
                            <span className="font-mono bg-[var(--bg-box)] px-1.5 py-0.5 rounded border border-[var(--bs-border)] text-xs">#{id.slice(-6)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Submitted: {new Date(createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 shadow-sm
                    ${status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                        status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}
                    `}>
                    {status === 'APPROVED' && <FiCheckCircle />}
                    {status === 'REJECTED' && <FiXCircle />}
                    {status === 'PENDING' && <FiClock />}
                    {status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: User Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[var(--bg-box)]  h-full rounded-3xl p-6 shadow-sm border border-[var(--bs-border)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

                        <div className="relative pt-8 flex flex-col items-center mb-6 text-center">
                            <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-main)] shadow-md overflow-hidden mb-4 bg-[var(--bg-main)] flex items-center justify-center">
                                {user?.picture ? (
                                    <img src={user.picture} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <FiUser size={40} className="text-[var(--text-second)]" />
                                )}
                            </div>
                            <h4 className="text-xl font-bold text-[var(--text-main)]">{user?.username || "Unknown User"}</h4>
                            <p className="text-sm text-[var(--text-second)]">{user?.email}</p>
                        </div>

                        <div className="border-t border-[var(--bs-border)] pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--text-second)] flex items-center gap-2"><FiUser size={14} /> Mobile</span>
                                <span className="font-medium text-[var(--text-main)]">{user?.mobile || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--text-second)] flex items-center gap-2"><FiCalendar size={14} /> Joined</span>
                                <span className="font-medium text-[var(--text-main)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--bs-border)]">
                                <span className="text-[var(--text-second)] flex items-center gap-2"><FiShield size={14} /> KYC Status</span>
                                <span className={`font-bold flex items-center gap-1.5 ${user?.kyc ? 'text-green-600' : 'text-orange-500'}`}>
                                    <span className={`w-2 h-2 rounded-full ${user?.kyc ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                    {user?.kyc ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {status === 'PENDING' && (
                        <div className="bg-[var(--bg-box)] rounded-3xl p-6 shadow-sm border border-[var(--bs-border)] space-y-3">
                            <h3 className="text-base font-bold text-[var(--text-main)] mb-2 uppercase tracking-wide">Verification Actions</h3>
                            <button
                                onClick={triggerApprove}
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-(--btn-hover) hover:opacity-90 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2"
                            >
                                <FiCheckCircle size={18} /> Approve Request
                            </button>
                            <button
                                onClick={() => setIsRejectOpen(true)}
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-[var(--bg-main)] border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition flex justify-center items-center gap-2 cursor-pointer"
                            >
                                <FiXCircle size={18} /> Reject Request
                            </button>
                        </div>
                    )}

                    {status === 'REJECTED' && (
                        <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
                            <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2"><FiXCircle /> Rejection Reason</h3>
                            <p className="text-red-700 text-sm leading-relaxed bg-[var(--bg-main)]/50 p-3 rounded-lg border border-red-100">{reason || "No reason provided."}</p>
                        </div>
                    )}
                </div>

                {/* Right: Docs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[var(--bg-box)] rounded-3xl p-8 shadow-sm border border-[var(--bs-border)] h-full">
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2 pb-4 border-b border-[var(--bs-border)]">
                            <FiFileText className="text-[var(--bs-primary)]" /> Submitted Documents
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            {docs && docs.map((doc, idx) => (
                                <div key={idx} className="bg-[var(--bg-main)] rounded-2xl p-5 border border-[var(--bs-border)]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-second)] block mb-1">Document Type</span>
                                            <h4 className="font-bold text-[var(--text-main)]">{doc.type?.replace('_', ' ')}</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-second)] block mb-1">Number</span>
                                            <p className="font-mono text-sm bg-[var(--bg-box)] px-2 py-1 rounded border border-[var(--bs-border)] text-[var(--text-main)]">{doc.number}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-[var(--text-second)] mb-2 font-medium">Front Side</p>
                                            <div
                                                onClick={() => setPreviewImage(doc.front)}
                                                className="block w-full aspect-video bg-[var(--bg-box)] rounded-xl overflow-hidden relative group border border-[var(--bs-border)] cursor-pointer"
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
                                                <p className="text-xs text-[var(--text-second)] mb-2 font-medium">Back Side</p>
                                                <div
                                                    onClick={() => setPreviewImage(doc.back)}
                                                    className="block w-full aspect-video bg-[var(--bg-box)] rounded-xl overflow-hidden relative group border border-[var(--bs-border)] cursor-pointer"
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
                </div>
            </div>

            {/* Reject Modal */}
            <Modal isOpen={isRejectOpen}>
                <div className="bg-[var(--bg-main)] p-6 rounded-2xl w-full max-w-md">
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Reject Verification</h3>
                    <p className="text-[var(--text-second)] text-sm mb-4">Please provide a reason for rejection. This will be visible to the user.</p>
                    <textarea
                        className="w-full border border-[var(--bs-border)] bg-[var(--bg-box)] text-[var(--text-main)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-4 resize-none"
                        rows={4}
                        placeholder="e.g. ID proof is blurry, Name mismatch..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsRejectOpen(false)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--bs-border)] text-[var(--text-second)] bg-[var(--bg-box)] hover:bg-[var(--bg-main)] transition font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setIsRejectOpen(false);
                                setConfirmModal({
                                    isOpen: true,
                                    type: 'REJECTED',
                                    title: "Confirm Rejection",
                                    message: "Are you sure you want to reject this KYC? This action cannot be undone.",
                                    isDanger: true
                                });
                            }}
                            disabled={!rejectReason || actionLoading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-md shadow-red-200 disabled:opacity-50 transition"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleFinalAction}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={confirmModal.isDanger}
                confirmText={confirmModal.type === 'APPROVED' ? 'Approve' : 'Reject'}
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
                        className="px-8 py-3 bg-[var(--bs-primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-blue-500/20"
                    >
                        <FiDownload size={20} /> Download Document
                    </a>
                </div>
            </Modal>
        </div>
    );
};

export default KycDetailsPage;
