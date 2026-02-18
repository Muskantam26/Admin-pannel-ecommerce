import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiShield, FiClock, FiCreditCard, FiLink } from 'react-icons/fi';
import { Building2 } from 'lucide-react'; // Using lucide for Bank icon
import { toast } from 'react-toastify';
import Modal from '../../Component/Model/Modal';
import ConfirmationModal from '../../Component/Model/ConfirmationModal';
import { getBankDetailsApi, verifyBankApi } from '../../api/bank-api';

const BankDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bankData, setBankData] = useState(null);
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

    useEffect(() => {
        fetchBankDetails();
    }, [id]);

    const fetchBankDetails = async () => {
        setLoading(true);
        try {
            const res = await getBankDetailsApi(id);
            if (res.success) {
                setBankData(res.data);
            } else {
                toast.error(res.message || "Failed to load Bank details");
            }
        } catch (error) {
            console.error("Bank Fetch Error", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerApprove = () => {
        setConfirmModal({
            isOpen: true,
            type: 'VERIFIED',
            title: "Verify Bank Account",
            message: "Are you sure you want to verify this bank account?",
            isDanger: false
        });
    };

    // Actual API Call
    const handleFinalAction = async () => {
        const { type } = confirmModal;
        const reason = type === 'REJECTED' ? rejectReason : null;

        setActionLoading(true);
        try {
            const res = await verifyBankApi({
                bankId: id,
                status: type,
                reason
            });

            if (res.success) {
                toast.success(`Bank details ${type === 'VERIFIED' ? 'Verified' : 'Rejected'} successfully`);
                fetchBankDetails(); // Refresh
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

    if (loading) return <div className="p-20 text-center text-(--text-second)">Loading Details...</div>;
    if (!bankData) return <div className="p-20 text-center text-red-500 font-bold">Bank Details Not Found.</div>;

    const { userId: user, bankName, accountNumber, ifscCode, accountHolderName, branchName, upiId, status, isDefault, createdAt, updatedAt } = bankData;

    return (
        <div className="pb-20 min-h-screen bg-(--bg-main)">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-(--bs-border) hover:bg-gray-50 rounded-xl text-(--text-second) transition shadow-sm cursor-pointer">
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-(--text-main)">Bank Verification Details</h1>
                        <p className="text-sm text-(--text-second) flex items-center gap-2 mt-1">
                            <span className="font-mono bg-(--bg-box) px-1.5 py-0.5 rounded border border-(--bs-border) text-xs">#{id.slice(-6)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Submitted: {new Date(createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 shadow-sm
                    ${status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-200' :
                        status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}
                    `}>
                    {status === 'VERIFIED' && <FiCheckCircle />}
                    {status === 'REJECTED' && <FiXCircle />}
                    {status === 'PENDING' && <FiClock />}
                    {status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: User Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-(--bg-box) h-full rounded-3xl p-6 shadow-sm border border-(--bs-border) relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

                        <div className="relative pt-8 flex flex-col items-center mb-6 text-center">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                                {user?.picture ? (
                                    <img src={user.picture} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <FiUser size={40} className="text-gray-400" />
                                )}
                            </div>
                            <h4 className="text-xl font-bold text-(--text-main)">{user?.username || "Unknown User"}</h4>
                            <p className="text-sm text-(--text-second)">{user?.email}</p>
                        </div>

                        <div className="border-t border-(--bs-border) pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-(--text-second) flex items-center gap-2"><FiUser size={14} /> Mobile</span>
                                <span className="font-medium text-(--text-main)">{user?.mobile || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-(--text-second) flex items-center gap-2"><FiCalendar size={14} /> Joined</span>
                                <span className="font-medium text-(--text-main)">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl">
                                <span className="text-(--text-second) flex items-center gap-2"><FiShield size={14} /> KYC Status</span>
                                <span className={`font-bold flex items-center gap-1.5 ${user?.kyc ? 'text-green-600' : 'text-orange-500'}`}>
                                    <span className={`w-2 h-2 rounded-full ${user?.kyc ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                    {user?.kyc ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {status === 'PENDING' && (
                        <div className="bg-(--bg-box) rounded-3xl p-6 shadow-sm border border-(--bs-border) space-y-3">
                            <h3 className="text-base font-bold text-(--text-main) mb-2 uppercase tracking-wide">Verification Actions</h3>
                            <button
                                onClick={triggerApprove}
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-(--bs-btn-forth) hover:opacity-90 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2 cursor-pointer"
                            >
                                <FiCheckCircle size={18} /> Verify Account
                            </button>
                            <button
                                onClick={() => setIsRejectOpen(true)}
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition flex justify-center items-center gap-2 cursor-pointer"
                            >
                                <FiXCircle size={18} /> Reject Account
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Bank Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-(--bg-box) rounded-3xl p-8 shadow-sm border border-(--bs-border) h-full">
                        <div className="flex justify-between items-center mb-6 border-b border-(--bs-border) pb-4">
                            <h3 className="text-lg font-bold text-(--text-main) flex items-center gap-2">
                                <Building2 className="text-(--bs-primary)" /> Bank Account Information
                            </h3>
                            {isDefault && (
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wide">
                                    Primary Account
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">Bank Name</label>
                                <p className="text-lg font-medium text-(--text-main)">{bankName}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">Account Number</label>
                                <p className="text-lg font-mono font-medium text-(--text-main) tracking-wide bg-gray-50 p-2 rounded border border-gray-100 w-fit">{accountNumber}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">IFSC Code</label>
                                <p className="text-lg font-mono font-medium text-(--text-main) tracking-wide">{ifscCode}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">Account Holder Name</label>
                                <p className="text-lg font-medium text-(--text-main)">{accountHolderName}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">Branch Name</label>
                                <p className="text-base text-(--text-main)">{branchName || "N/A"}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider font-bold text-(--text-second)">UPI ID</label>
                                <div className="flex items-center gap-2">
                                    <FiCreditCard className="text-gray-400" />
                                    <p className="text-base text-(--text-main)">{upiId || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-(--bs-border) grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-(--text-second)">Last Updated</span>
                                <span className="font-mono text-(--text-main)">{new Date(updatedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-(--text-second)">Created At</span>
                                <span className="font-mono text-(--text-main)">{new Date(createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal isOpen={isRejectOpen}>
                <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Verification</h3>
                    <p className="text-gray-500 text-sm mb-4">Please provide a reason for rejection. This will be visible to the user.</p>
                    <textarea
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-4 resize-none"
                        rows={4}
                        placeholder="e.g. Account name mismatch, Invalid IFSC..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsRejectOpen(false)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--bs-border)] text-[var(--text-second)] bg-[var(--bg-box)] hover:bg-gray-50 transition font-medium cursor-pointer"
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
                                    message: "Are you sure you want to reject this Bank Account? This action cannot be undone.",
                                    isDanger: true
                                });
                            }}
                            disabled={!rejectReason || actionLoading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-md shadow-red-200 disabled:opacity-50 transition cursor-pointer"
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
                confirmText={confirmModal.type === 'VERIFIED' ? 'Verify' : 'Reject'}
            />
        </div>
    );
};

export default BankDetailsPage;
