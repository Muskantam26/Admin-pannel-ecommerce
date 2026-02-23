import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAdminsApi, deleteAdminApi } from '../../api/admin-api';
import { PathRoutes } from '../../constant/Path';
import PageLoader from '../../Component/PageLoader';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Button from '../../Component/Btn';
import { MainHeading } from '../../Component/Heading';

const AdminPage = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

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

            <div className="bg-(--bg-box) rounded-xl border border-(--bs-border) overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-(--bg-main) border-b border-(--bs-border) text-(--text-second) text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Mobile</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-(--bs-border)">
                            {admins.map((admin) => (
                                <tr key={admin._id || admin.id} className="hover:bg-(--bg-main)/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-(--bs-primary)/10 flex items-center justify-center text-(--bs-primary) font-bold text-lg overflow-hidden">
                                                {admin.picture ? (
                                                    <img src={admin.picture} alt={admin.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    admin.username?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{admin.username}</div>
                                                <div className="text-xs text-(--text-third)">ID: {admin.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${admin.role === 'SUPER-ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                admin.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                                                    admin.role === 'MANAGER' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-(--text-second)">{admin.email}</td>
                                    <td className="p-4 text-sm text-(--text-second)">{admin.mobile || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`${PathRoutes.ADMIN_DETAILS}/${admin._id || admin.id}`)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                            {/* Prevent editing/deleting Super Admins if needed, or backend handles it */}
                                            {/* Assuming current user can create/edit based on middleware checks */}
                                            <button
                                                onClick={() => navigate(`${PathRoutes.ADD_ADMIN}?id=${admin._id || admin.id}`)} // Using query param or route param for edit
                                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin._id || admin.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={admin.role === 'SUPER-ADMIN'}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-(--text-third)">
                                        No admins found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
