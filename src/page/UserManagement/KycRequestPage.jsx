import React, { useEffect, useState } from 'react';
import { MainHeading } from '../../Component/Heading';
import CommonDataTable from '../../Component/CommonDataTable';
import { getAllKycApi, verifyKycApi } from '../../api/kyc-api';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { FiPlus } from 'react-icons/fi';
import Button from '../../Component/Btn';
import { PathRoutes } from '../../constant/Path';
import ConfirmationModal from '../../Component/Model/ConfirmationModal';
import { toast } from 'react-toastify';
import PageLoader from '../../Component/PageLoader';

const KycRequestPage = () => {
    const navigate = useNavigate();
    const [kycList, setKycList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const rowsPerPage = 10;
    const [statusFilter, setStatusFilter] = useState('');

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });

    useEffect(() => {
        fetchKycRequests();
    }, [currentPage, statusFilter]);

    const fetchKycRequests = async () => {
        setLoading(true);
        try {
            const res = await getAllKycApi({
                page: currentPage,
                limit: rowsPerPage,
                status: statusFilter
            });
            if (res.kycs) {
                setKycList(res.kycs);
                setTotalPages(res.pagination?.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching KYC requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (type, row) => {
        setModalConfig({ isOpen: true, type, data: row });
    };

    const confirmAction = async () => {
        const { type, data } = modalConfig;
        if (!data) return;

        const status = type === 'approve' ? 'APPROVED' : 'REJECTED';
        const reason = type === 'reject' ? 'Rejected by Admin' : null; // Simple rejection for now

        try {
            const res = await verifyKycApi({ kycId: data._id, status, reason });
            if (res.success) {
                toast.success(res.message);
                fetchKycRequests();
            } else {
                toast.error(res.message);
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Action Failed");
        }
        setModalConfig({ isOpen: false, type: '', data: null });
    };

    // Columns configuration
    const columns = [
        {
            name: "#",
            cell: (row, index) => <span className="text-(--text-second) text-xs font-mono">{(currentPage - 1) * rowsPerPage + index + 1}</span>,
            width: "50px"
        },
        {
            name: "Request ID",
            selector: (row) => row?.id,
            cell: (row) => <span className="text-(--text-second) text-xs font-mono">{row?.id}</span>,
            width: "120px"
        },

        {
            name: "User Details",
            selector: (row) => `${row.user?.username} (${row.user?.email})`,
            imageSelector: (row) => row.user?.picture || "https://img.icons8.com/color/48/user-male--v2.png",
            cell: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <img
                        src={row.user?.picture || "https://img.icons8.com/color/48/user-male--v2.png"}
                        alt=""
                        className="w-9 h-9 rounded-full border border-[var(--bs-border)] object-cover bg-[var(--bg-box)]"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-(--text-main) hover:text-(--bs-primary) transition-colors cursor-pointer">{row.user?.username || "Unknown"}</p>
                            {row.user?.id && <span className="text-[10px] bg-[var(--bg-main)] text-(--bs-primary) px-1.5 py-0.5 rounded border border-[var(--bs-border)] font-mono">{row.user.id}</span>}
                        </div>
                        <p className="text-xs text-(--text-second)">{row.user?.email}</p>
                    </div>
                </div>
            ),
            width: "280px"
        },
        {
            name: "Status",
            selector: (row) => row.status,
            cell: (row) => {
                let statusColor = "bg-yellow-100 text-yellow-600";
                if (row.status === 'APPROVED') {
                    statusColor = "bg-green-100 text-green-600";
                } else if (row.status === 'REJECTED') {
                    statusColor = "bg-red-100 text-red-600";
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {row.status}
                    </span>
                );
            },
            width: "140px"
        },
        {
            name: "Approved At",
            selector: (row) => new Date(row.approveDate).toLocaleDateString(),
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm text-(--text-main) font-medium">{new Date(row.approveDate).toLocaleDateString()}</span>
                    <span className="text-[10px] text-(--text-second) font-mono">{new Date(row.approveDate).toLocaleTimeString()}</span>
                </div>
            ),
            width: "150px"
        },
        {
            name: "Submitted At",
            selector: (row) => new Date(row.createdAt).toLocaleDateString(),
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm text-(--text-main) font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-(--text-second) font-mono">{new Date(row.createdAt).toLocaleTimeString()}</span>
                </div>
            ),
            width: "150px"
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/kyc-details/${row._id}`)}
                        className="p-2 rounded-lg cursor-pointer bg-blue-100 text-blue-600"
                        title="View Details"
                    >
                        <Eye size={14} />
                    </button>
                    {row.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleAction('approve', row)}
                                className="p-2 rounded-lg cursor-pointer bg-green-100 text-green-600"
                                title="Approve Request"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => handleAction('reject', row)}
                                className="p-2 rounded-lg cursor-pointer bg-red-100 text-red-600"
                                title="Reject Request"
                            >
                                <X size={14} />
                            </button>
                        </>
                    )}
                </div>
            ),
            width: "150px"
        }
    ];

    return (
        <div className="pb-20 min-h-screen bg-(--bg-main)">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <MainHeading
                    title={"KYC Requests"}
                    subtitle={"Manage user verification requests and approvals."}
                />
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            className="pl-3 pr-8 py-2.5 bg-[var(--bg-main)] border border-(--bs-border) rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--bs-primary)]/20 focus:border-[var(--bs-primary)] shadow-sm transition-all appearance-none cursor-pointer text-(--text-main)"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    <Button
                        onClick={() => navigate(PathRoutes.ADD_KYC)}
                        className="flex items-center gap-2 bg-(--bs-btn) text-(--text-white) px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        <FiPlus size={18} /> Add Request
                    </Button>
                </div>
            </div>

            <div className="bg-(--bg-box) rounded-2xl shadow-sm border border-(--bs-border) overflow-hidden p-4">
                {loading ? (
                    <PageLoader/>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <CommonDataTable
                            columns={columns}
                            data={kycList}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pagination
                        />
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={confirmAction}
                title={modalConfig.type === 'approve' ? "Approve KYC Request" : "Reject KYC Request"}
                message={
                    modalConfig.type === 'approve'
                        ? `Are you sure you want to approve KYC for ${modalConfig.data?.user?.username}?`
                        : `Are you sure you want to reject KYC for ${modalConfig.data?.user?.username}?`
                }
                isDanger={modalConfig.type === 'reject'}
                confirmText={modalConfig.type === 'approve' ? "Approve" : "Reject"}
            />
        </div>
    );
};

export default KycRequestPage;
