import React, { useEffect, useState } from 'react';
import { MainHeading } from '../../Component/Heading';
import CommonDataTable from '../../Component/CommonDataTable';
import { getAllBanksApi, verifyBankApi } from '../../api/bank-api';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Check, X, Building2 } from 'lucide-react';
import { PathRoutes } from '../../constant/Path';
import ConfirmationModal from '../../Component/Model/ConfirmationModal';
import { toast } from 'react-toastify';
import Button from '../../Component/Btn';
import { FiPlus } from 'react-icons/fi';
import PageLoader from '../../Component/PageLoader';

const BankRequestPage = () => {
    const navigate = useNavigate();
    const [bankList, setBankList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const rowsPerPage = 10;
    const [statusFilter, setStatusFilter] = useState('');

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });

    useEffect(() => {
        fetchBankRequests();
    }, [currentPage, statusFilter]);

    const fetchBankRequests = async () => {
        setLoading(true);
        try {
            const res = await getAllBanksApi({
                page: currentPage,
                limit: rowsPerPage,
                status: statusFilter
            });
            if (res.banks) {
                setBankList(res.banks);
                setTotalPages(res.pagination?.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching Bank requests", error);
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

        const status = type === 'approve' ? 'VERIFIED' : 'REJECTED';
        const reason = type === 'reject' ? 'Rejected by Admin' : null;

        try {
            const res = await verifyBankApi({ bankId: data._id, status, reason });
            if (res.success) {
                toast.success(res.message);
                fetchBankRequests();
            } else {
                toast.error(res.message);
            }
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
            name: "User Details",
            cell: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <img
                        src={row.userId?.picture || "https://img.icons8.com/color/48/user-male--v2.png"}
                        alt=""
                        className="w-9 h-9 rounded-full border border-(--bs-border) object-cover bg-gray-50"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-(--text-main) hover:text-blue-600 transition-colors cursor-pointer">{row.userId?.username || "Unknown"}</p>
                            {row.userId?.id && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-mono">{row.userId.id}</span>}
                        </div>
                        <p className="text-xs text-(--text-second)">{row.userId?.email}</p>
                    </div>
                </div>
            ),
            width: "250px"
        },
        {
            name: "Bank Info",
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-sm font-semibold text-(--text-main)">{row.bankName}</span>
                    </div>
                    {row.branchName && (
                        <span className="text-xs text-(--text-second) ml-5">{row.branchName}</span>
                    )}
                </div>
            ),
            width: "200px"
        },
        {
            name: "Account Details",
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-(--text-second) uppercase tracking-wider">Account No</span>
                        <span className="text-sm font-mono text-(--text-main)">{row.accountNumber}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-(--text-second) uppercase tracking-wider">IFSC</span>
                        <span className="text-xs font-mono text-gray-500">{row.ifscCode}</span>
                    </div>
                </div>
            ),
            width: "180px"
        },
        {
            name: "Account Holder",
            selector: (row) => row.accountHolderName,
            sortable: true,
            cell: (row) => <span className="text-sm font-medium text-(--text-main)">{row.accountHolderName}</span>,
            width: "180px"
        },
        {
            name: "Status",
            cell: (row) => {
                let statusColor = "bg-gray-100 text-gray-600";
                let Icon = Clock;

                if (row.status === 'VERIFIED') {
                    statusColor = "bg-green-50 text-green-700 border border-green-200";
                    Icon = CheckCircle;
                } else if (row.status === 'REJECTED') {
                    statusColor = "bg-red-50 text-red-700 border border-red-200";
                    Icon = XCircle;
                } else if (row.status === 'PENDING') {
                    statusColor = "bg-amber-50 text-amber-700 border border-amber-200";
                    Icon = Clock;
                }

                return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide w-fit border ${statusColor}`}>
                        <Icon size={12} strokeWidth={2.5} />
                        {row.status}
                    </div>
                );
            },
            width: "140px"
        },
        {
            name: "Date",
            selector: (row) => new Date(row.createdAt).toLocaleDateString(),
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm text-(--text-main) font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-(--text-second) font-mono">{new Date(row.createdAt).toLocaleTimeString()}</span>
                </div>
            ),
            width: "140px"
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleAction('approve', row)}
                                className="h-8 px-3 flex items-center gap-1 whitespace-nowrap justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all active:scale-95 border border-green-200 shadow-sm"
                                title="Approve Request"
                            >
                                <Check size={16} strokeWidth={2.5} /> Verify
                            </button>
                            <button
                                onClick={() => handleAction('reject', row)}
                                className="h-8 px-3 flex items-center gap-1 whitespace-nowrap justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-200 shadow-sm"
                                title="Reject Request"
                            >
                                <X size={16} strokeWidth={2.5} /> Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => navigate(`/bank-details/${row._id}`)}
                        className="h-8 px-3 whitespace-nowrap bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center gap-2 text-xs font-bold border border-blue-200 shadow-sm ml-auto cursor-pointer"
                        title="View Details"
                    >
                        <Eye size={14} /> View
                    </button>
                </div>
            ),
            width: "350px"
        }
    ];

    return (
        <div className="pb-20 min-h-screen bg-(--bg-main)">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <MainHeading
                    title={"Bank Requests"}
                    subtitle={"Manage user bank account verification requests."}
                />
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            className="pl-3 pr-8 py-2.5 bg-white border border-(--bs-border) rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all appearance-none cursor-pointer text-(--text-main)"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    <Button
                        onClick={() => navigate(PathRoutes.ADD_BANK)}
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
                    <CommonDataTable
                        columns={columns}
                        data={bankList}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pagination
                    />
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={confirmAction}
                title={modalConfig.type === 'approve' ? "Verify Bank Account" : "Reject Bank Account"}
                message={
                    modalConfig.type === 'approve'
                        ? `Are you sure you want to verify bank details for ${modalConfig.data?.userId?.username}?`
                        : `Are you sure you want to reject bank details for ${modalConfig.data?.userId?.username}?`
                }
                isDanger={modalConfig.type === 'reject'}
                confirmText={modalConfig.type === 'approve' ? "Verify" : "Reject"}
            />
        </div>
    );
};

export default BankRequestPage;
