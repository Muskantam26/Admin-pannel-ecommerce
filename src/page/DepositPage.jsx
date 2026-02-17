import React, { useEffect, useState } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { getAllDepositsApi, processDepositApi } from "../api/transaction-api";
import { toast } from "react-toastify";
import Loader from "../Component/PageLoader";
import { CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react";

const DepositPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Modal States
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        setLoading(true);
        const res = await getAllDepositsApi();
        if (res.success) {
            setData(res.data);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    const handleAction = (tx, action) => {
        setSelectedTx(tx);
        if (action === "Confirm") {
            setShowConfirmModal(true);
        } else if (action === "Cancel") {
            setRejectReason("");
            setShowCancelModal(true);
        }
    };

    const submitProcess = async (status) => {
        if (!selectedTx) return;

        if (status === "Cancelled" && !rejectReason.trim()) {
            return toast.warning("Please enter a reason for cancellation.");
        }

        setLoading(true);
        const payload = {
            id: selectedTx._id,
            status: status,
            remarks: status === "Cancelled" ? rejectReason : "Confirmed by Admin"
        };

        const res = await processDepositApi(payload);
        if (res.success) {
            toast.success(res.message);
            setShowConfirmModal(false);
            setShowCancelModal(false);
            fetchDeposits(); // Refresh data
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    // Pagination Logic
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const columns = [
        {
            name: "Date",
            selector: (row) => new Date(row.createdAt).toLocaleDateString(),
            sortable: true,
            width: "120px"
        },
        {
            name: "User",
            selector: (row) => row.user?.username || row.user?.email || "N/A",
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row) => `₹${row.investment}`,
            sortable: true,
            width: "100px"
        },
        {
            name: "Tx ID",
            selector: (row) => row.transactionId || "N/A",
            sortable: true,
        },
        {
            name: "Mode",
            selector: (row) => row.details?.paymentMode || "Manual",
            sortable: true,
            width: "100px"
        },
        {
            name: "Screenshot",
            cell: (row) => (
                row.file ? (
                    <button onClick={() => setPreviewImage(row.file)} className="text-blue-500 hover:text-blue-700">
                        <Eye size={18} />
                    </button>
                ) : <span className="text-gray-400">-</span>
            ),
            center: true,
            width: "80px"
        },
        {
            name: "Status",
            cell: (row) => {
                let color = "bg-yellow-100 text-yellow-700";
                if (row.status === "Confirmed") color = "bg-green-100 text-green-700";
                if (row.status === "Cancelled") color = "bg-red-100 text-red-700";
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
                        {row.status}
                    </span>
                );
            },
            sortable: true,
            width: "120px"
        },
        {
            name: "Actions",
            cell: (row) => (
                row.status === "Pending" ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction(row, "Confirm")}
                            className="text-green-500 hover:text-green-700 p-1 bg-green-50 rounded-full"
                            title="Confirm"
                        >
                            <CheckCircle size={18} />
                        </button>
                        <button
                            onClick={() => handleAction(row, "Cancel")}
                            className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-full"
                            title="Cancel"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                )
            ),
            width: "100px",
            center: true
        },
    ];

    return (
        <div className="card w-full bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Deposit Requests</h2>
                <button onClick={fetchDeposits} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {loading && <Loader />}
                <CommonDataTable
                    columns={columns}
                    data={paginatedData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    selectable={false}
                />
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-2">Confirm Deposit?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to approve the deposit of <b>₹{selectedTx?.investment}</b> for {selectedTx?.user?.username}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                            >
                                No, Go Back
                            </button>
                            <button
                                onClick={() => submitProcess("Confirmed")}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
                            >
                                Yes, Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-2 text-red-600">Reject Deposit</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Please provide a reason for rejecting this deposit.
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none"
                            rows="3"
                            placeholder="Enter reason (e.g., Transaction ID mismatch, Invalid screenshot)..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => submitProcess("Cancelled")}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                            >
                                Reject Deposit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Proof"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                    />
                    <button
                        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                        onClick={() => setPreviewImage(null)}
                    >
                        <XCircle size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepositPage;
