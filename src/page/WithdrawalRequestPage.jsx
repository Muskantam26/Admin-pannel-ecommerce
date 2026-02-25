import React, { useState, useEffect, useMemo } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, RefreshCw, Eye, ArrowLeft } from "lucide-react";
import { MainHeading } from "../Component/Heading";
import { getAllTransations } from "../api/transaction-api";
import PageLoader from "../Component/PageLoader";

// Extracted logic for grouping to keep component clean
const groupDataByDate = (data) => {
  const grouped = data.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const dateStr = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!acc[dateStr]) {
      acc[dateStr] = {
        id: dateStr,
        startDate: dateStr,
        endDate: dateStr,
        dateRange: dateStr,
        timestamp: date.setHours(0, 0, 0, 0),
        userIds: new Set(),
        totalAmount: 0,
        requests: [],
      };
    }
    acc[dateStr].userIds.add(
      curr.user?.id || curr.user?._id || curr._id || Math.random(),
    );
    acc[dateStr].totalAmount += Number(curr.investment || 0);
    acc[dateStr].requests.push(curr);
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((item, index) => ({
      ...item,
      sno: index + 1,
      totalUsers: item.requests.length,
    }));
};

const PayoutPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modals state
  const [modalType, setModalType] = useState(null); // 'Approve' or 'Reject'
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await getAllTransations({});
      if (res?.success)
      setData(res?.data?.history || []);
    // console.log("payout response",res?.data?.history);
      else toast.error(res?.message || "Failed to fetch payouts.");
    } catch {
      toast.error("Error fetching payouts.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (status) => {
    if (status === "Rejected" && !rejectReason.trim()) {
      return toast.warning("Reason is required for rejection.");
    }

    setData((prev) =>
      prev.map((item) =>
        item._id === selectedPayout._id ? { ...item, status } : item,
      ),
    );

    toast.success(`Payout ${status} successfully`);
    closeModal();
  };

  const openModal = (payout, type) => {
    setSelectedPayout(payout);
    setModalType(type);
    setRejectReason("");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPayout(null);
  };

  const summaryData = useMemo(() => groupDataByDate(data), [data]);

  useEffect(() => {
    if (selectedGroup) {
      setSelectedGroup(
        summaryData.find((g) => g.id === selectedGroup.id) || null,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryData]);

  // Columns for Summary Table
  const summaryColumns = [
    { name: "S.No", selector: (row) => row.sno, width: "80px" },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
    { name: "Total Users", selector: (row) => row.totalUsers, center: true },
    {
      name: "Total Amount",
      selector: (row) => `₹${row.totalAmount}`,
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedGroup(row);
            setCurrentPage(1);
          }}
          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  // Columns for detailed Payouts Table
  const detailsColumns = [
    { name: "User ID", selector: (row) => `#${row.user?.id || "N/A"}` },
    { name: "User Name", selector: (row) => row.user?.username || "Unknown" },
    { name: "Mobile", selector: (row) => row.user?.mobile || "N/A" },
    { name: "Amount", selector: (row) => `₹${row.investment}` },
    {
      name: "Bank Details",
      cell: (row) => {
        const bank = row.user?.bankDetails || row.bankDetails;
        if (!bank)
          return (
            <span className="text-gray-400 text-xs text-center w-full block">
              N/A
            </span>
          );
        return (
          <div className="text-[11px] leading-tight text-gray-600 py-1">
            {bank.accountNumber && (
              <div>
                A/c: <span className="font-semibold">{bank.accountNumber}</span>
              </div>
            )}
            {bank.ifsc && (
              <div>
                IFSC: <span className="font-semibold">{bank.ifsc}</span>
              </div>
            )}
            {bank.bankName && (
              <div>
                Bank: <span className="font-semibold">{bank.bankName}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: "Status",
      cell: (row) => {
        const isSuccess = ["Confirmed", "Approved"].includes(row.status);
        const isFailed = ["Cancelled", "Rejected"].includes(row.status);
        const style = isSuccess
          ? "bg-green-100 text-green-700"
          : isFailed
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${style}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Action",
      center: true,
      cell: (row) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => openModal(row, "Approve")}
              className="p-1.5 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white rounded-md transition-colors"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => openModal(row, "Reject")}
              className="p-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-md transition-colors"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">Processed</span>
        ),
    },
  ];

  const displayData = selectedGroup ? selectedGroup.requests : summaryData;
  const paginatedData = displayData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          {selectedGroup && (
            <button
              onClick={() => {
                setSelectedGroup(null);
                setCurrentPage(1);
              }}
              className="p-2 bg-white shadow-sm rounded-full text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <MainHeading
            title={
              selectedGroup
                ? "Payout Details"
                : "Payouts"
            }
            subtitle={
              selectedGroup
                ? "Manage individual requests for this date"
                : "Manage your payout summaries"
            }
          />
        </div>
        <button
          onClick={fetchPayouts}
          className="p-2 bg-white shadow-sm rounded-full text-gray-600 hover:bg-gray-50 transition-all border border-gray-100 self-end sm:self-auto"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative flex-1">
        {loading && <PageLoader />}
        <CommonDataTable
          columns={selectedGroup ? detailsColumns : summaryColumns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={Math.ceil(displayData.length / rowsPerPage)}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          
        />
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            {modalType === "Approve" ? (
              <div className="text-center">
                <CheckCircle
                  className="text-green-500 mx-auto mb-3"
                  size={48}
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Approve Payout?
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Release{" "}
                  <span className="font-bold text-gray-800">
                    ₹{selectedPayout?.investment}
                  </span>{" "}
                  to {selectedPayout?.user?.username}.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction("Approved")}
                    className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  Reject Payout
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Provide a cancellation reason.
                </p>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-100 outline-none mb-4 resize-none transition-all"
                  rows="3"
                  placeholder="e.g. Invalid bank details..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction("Rejected")}
                    className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PayoutPage;
