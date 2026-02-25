import React, { useState } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { MainHeading } from "../Component/Heading";
import DateTime from "../Component/DateTime";

const dummyData = [
  {
    _id: "WD-1",
    id: "WD-12345",
    createdAt: new Date().toISOString(),
    user: { username: "john_doe", id: "U-001" },
    investment: 5000,
    transactionId: "TXN987654321",
    details: {
      paymentMode: "Bank Transfer",
      account: "1234567890",
      ifsc: "HDFC000123",
    },
    status: "Pending",
  },
  {
    _id: "WD-2",
    id: "WD-12346",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: { username: "jane_smith", id: "U-002" },
    investment: 2500,
    transactionId: "TXN987654322",
    details: { paymentMode: "Crypto", address: "0x123...abc" },
    status: "Confirmed",
  },
  {
    _id: "WD-3",
    id: "WD-12347",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    user: { username: "mike_ross", id: "U-003" },
    investment: 10000,
    transactionId: "TXN987654323",
    details: { paymentMode: "UPI", upiId: "mike@upi" },
    status: "Cancelled",
  },
];

const WithdrawalRequestPage = () => {
  const [data, setData] = useState(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleAction = (tx, action) => {
    setSelectedTx(tx);
    if (action === "Confirm") {
      setShowConfirmModal(true);
    } else if (action === "Cancel") {
      setRejectReason("");
      setShowCancelModal(true);
    }
  };

  const submitProcess = (status) => {
    if (!selectedTx) return;

    if (status === "Cancelled" && !rejectReason.trim()) {
      return toast.warning("Please enter a reason for cancellation.");
    }

    setData((prevData) =>
      prevData.map((item) =>
        item._id === selectedTx._id ? { ...item, status } : item,
      ),
    );

    toast.success(`Withdrawal request ${status.toLowerCase()}`);
    setShowConfirmModal(false);
    setShowCancelModal(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const columns = [
        {
            name: "ID",
            selector: (row) => row.id || "N/A",
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => new Date(row.createdAt).toLocaleDateString(),
            cell: (row) => <DateTime date={row.createdAt} />,
            sortable: true,
            width: "120px"
        },

        {
            name: "User",
            // eslint-disable-next-line no-constant-binary-expression
            selector: (row) => `${row.user?.username} (${row.user?.id})` || "N/A",
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
            width: "200px"
        },
        {
            name: "Mode",
            selector: (row) => row.details?.paymentMode || "Manual",
            sortable: true,
            width: "100px"
        },
        {
            name: "Purchase By",
            selector: (row) => row.purchaseBy || "Manual",
            sortable: true,
            width: "100px"
        },
        {
            name: "Screenshot",
            imageSelector: (row) => row.file || null,
            cell: (row) => (
                row.file ? (
                    <button  className="text-blue-500 hover:text-blue-700">
                        <Eye size={18} />
                    </button>
                ) : <span className="text-gray-400">-</span>
            ),
            center: true,
            width: "80px"
        },
        {
            name: "Status",
            selector: (row) => row.status,
            cell: (row) => {
                let color = "bg-yellow-100 text-[var(--bs-warn)]";
                if (row.status === "Confirmed") color = "bg-green-100 text-[var(--bg-green)]";
                if (row.status === "Cancelled") color = "bg-[var(--bs-del)] text-[var(--bs-red)]";
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
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
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => handleAction(row, "Confirm")}
                            className="p-2 rounded-lg cursor-pointer bg-[var(--icon-btn)] text-[var(--icon-btn-text)]"
                            title="Confirm"
                        >
                            <CheckCircle size={14} />
                        </button>
                        <button
                            onClick={() => handleAction(row, "Cancel")}
                            className="p-2 rounded-lg cursor-pointer bg-[var(--icon-btn-second)] text-[var(--icon-text-second)]"
                            title="Cancel"
                        >
                            <XCircle size={14} />
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                )
            ),
            width: "120px",
            center: true
        },
    ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <MainHeading
          title={"Withdrawal Requests"}
          subtitle={"Manage all user withdrawal requests"}
        />
        <button
          onClick={() => setData(dummyData)}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600 self-end sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="card w-full bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <CommonDataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            selectable={true}
            showSearch={true}
          />
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold mb-2">Confirm Withdrawal?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to approve the withdrawal of{" "}
                <b>₹{selectedTx?.investment}</b> for{" "}
                {selectedTx?.user?.username}?
              </p>
              <div className="flex justify-end gap-3 flex-wrap">
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
              <h3 className="text-lg font-bold mb-2 text-red-600">
                Reject Withdrawal
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Please provide a reason for rejecting this withdrawal.
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none"
                rows="3"
                placeholder="Enter reason (e.g., Invalid bank details)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-3 mt-4 flex-wrap">
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
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

      
      </div>
    </>
  );
};

export default WithdrawalRequestPage;
