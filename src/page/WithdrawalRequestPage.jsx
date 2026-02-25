import React, { useState, useEffect } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { MainHeading } from "../Component/Heading";
import DateTime from "../Component/DateTime";
import { getAllTransations } from "../api/transaction-api";
import PageLoader from "../Component/PageLoader";

const PayoutPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal States
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await getAllTransations({});
      if (res?.success) {
        // Filtering or mapping logic can be added here if specific payout types exist
        setData(res?.data?.history || []);
      } else {
        toast.error(res?.message || "Failed to fetch payout records.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Internal Server Error while fetching payouts.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (payout, action) => {
    setSelectedPayout(payout);
    if (action === "Approve") {
      setShowApproveModal(true);
    } else if (action === "Reject") {
      setRejectReason("");
      setShowRejectModal(true);
    }
  };

  const submitPayoutStatus = (status) => {
    if (!selectedPayout) return;

    if (status === "Rejected" && !rejectReason.trim()) {
      return toast.warning("Please provide a reason for rejection.");
    }

    // Update local state (Optimistic UI)
    // Note: In a real app, you would call an API like updatePayoutStatus(id, status, reason)
    setData((prevData) =>
      prevData.map((item) =>
        item._id === selectedPayout._id ? { ...item, status } : item
      )
    );

    toast.success(`Payout ${status} successfully`);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedPayout(null);
  };

  // Pagination Logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      name: "Payout ID",
      selector: (row) => row.id || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Requested Date",
      cell: (row) => <DateTime date={row.createdAt} />,
      sortable: true,
    },
    {
      name: "Recipient",
      selector: (row) => row.user?.username || "Unknown",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.user?.username}</span>
          <span className="text-[10px] text-gray-500">ID: {row.user?.id}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.investment,
      cell: (row) => <span className="font-bold text-gray-800">₹{row.investment}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        let style = "bg-yellow-100 text-yellow-700";
        if (row.status === "Confirmed" || row.status === "Approved") style = "bg-green-100 text-green-700";
        if (row.status === "Cancelled" || row.status === "Rejected") style = "bg-red-100 text-red-700";
        
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${style}`}>
            {row.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(row, "Approve")}
              className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
              title="Approve Payout"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => handleAction(row, "Reject")}
              className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
              title="Reject Payout"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">Processed</span>
        ),
      center: true,
    },
  ];

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <MainHeading
          title="Payout"
        />
        
        <button
          onClick={fetchPayouts}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-all"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[60vh]">
        <div className="p-1">
          {loading && <PageLoader />}
          <CommonDataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            selectable={false}
            showSearch={true}
          />
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-up-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Approve Payout?</h3>
            <p className="text-gray-500 mt-2 text-sm">
              You are about to release <span className="font-bold text-gray-900">₹{selectedPayout?.investment}</span> to {selectedPayout?.user?.username}. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => submitPayoutStatus("Approved")}
                className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-200"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-up-center">
            <h3 className="text-xl font-bold text-red-600">Reject Payout</h3>
            <p className="text-gray-500 mt-1 text-sm mb-4">
              Provide a reason for the recipient to see.
            </p>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-100 outline-none resize-none transition-all"
              rows="4"
              placeholder="e.g. Incorrect bank details, Account verification pending..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => submitPayoutStatus("Rejected")}
                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutPage;