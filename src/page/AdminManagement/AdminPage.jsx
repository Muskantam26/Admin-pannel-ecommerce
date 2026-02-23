import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAdminsApi, deleteAdminApi } from '../../api/admin-api';
import { PathRoutes } from '../../constant/Path';
import PageLoader from '../../Component/PageLoader';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiTrash } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Button from '../../Component/Btn';
import { MainHeading } from '../../Component/Heading';
import CommonDataTable from '../../Component/CommonDataTable';

const AdminPage = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await getAllAdminsApi();
            if (response.success) {
                setAdmins(response.data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            toast.error(error.response?.data?.message || "Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteAdminApi(id);
                    if (response.success) {
                        toast.success(response.message);
                        fetchAdmins();
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to delete admin");
                }
            }
        });
    };

    const totalPages = Math.ceil(admins.length / rowsPerPage);
    const paginatedAdmins = admins.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const columns = [
        {
            name: "User",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--bs-primary)/10 flex items-center justify-center text-(--bs-primary) font-bold text-lg overflow-hidden shrink-0">
                        {row.picture ? (
                            <img src={row.picture} alt={row.username} className="w-full h-full object-cover" />
                        ) : (
                            row.username?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-(--text-main)">{row.username}</div>
                        <div className="text-xs text-(--text-third)">ID: {row.id}</div>
                    </div>
                </div>
            ),
            sortable: true,
            selector: (row) => row.username,
            width: "250px"
        },
        {
            name: "Role",
            selector: (row) => row.role,
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${row.role === 'SUPER-ADMIN' ? 'bg-purple-100 text-purple-700' :
                        row.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                            row.role === 'MANAGER' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'}`}>
                    {row.role}
                </span>
            ),
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Mobile",
            selector: (row) => row.mobile || 'N/A',
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex justify-end gap-2 my-2">
                    <button
                        onClick={() => navigate(`${PathRoutes.ADMIN_DETAILS}/${row._id || row.id}`)}
                        className="p-2 rounded-lg cursor-pointer bg-blue-100 text-blue-600 transition-colors"
                        title="View Details"
                    >
                        <FiEye size={14} />
                    </button>
                    <button
                        onClick={() => navigate(`${PathRoutes.ADD_ADMIN}?id=${row._id || row.id}`)}
                        className="p-2 rounded-lg cursor-pointer bg-indigo-100 text-indigo-600 transition-colors"
                        title="Edit"
                    >
                        <FiEdit size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id || row.id)}
                        className="p-2 rounded-lg cursor-pointer bg-red-100 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                        disabled={row.role === 'SUPER-ADMIN'}
                    >
                        <FiTrash size={14} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    if (loading) return <PageLoader />;

    return (
        <div className="p-6 bg-(--bg-main) min-h-screen text-(--text-main)">
            <div className="flex justify-between items-center mb-6">
                <MainHeading
                    title={"Admin Management"}
                    subtitle={"Manage all admins and their roles."}
                />

                <Button
                    onClick={() => navigate(PathRoutes.ADD_ADMIN)}
                    className="flex items-center gap-2 bg-(--bs-btn) text-(--text-white) px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                >
                    <FiPlus size={18} /> Add Admin
                </Button>
            </div>

            <div className="bg-(--bg-box) rounded-xl border border-(--bs-border) overflow-hidden shadow-sm p-3">
                <div className="overflow-x-auto w-full">
                    <CommonDataTable
                        columns={columns}
                        data={paginatedAdmins}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        selectable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
