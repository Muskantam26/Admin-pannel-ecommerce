import React, { useEffect, useState } from 'react';
import { MainHeading } from '../Component/Heading';
import CommonDataTable from '../Component/CommonDataTable';
import { getAllDisplayItemsApi, deleteDisplayItemApi, toggleDisplayVisibilityApi } from '../api/display-api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../Component/Btn';
import ConfirmationModal from '../Component/Model/ConfirmationModal';

const Marquee = () => {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const fetchMarquees = async () => {
        setLoading(true);
        try {
            const res = await getAllDisplayItemsApi({ type: 'MARQUEE' });
            if (res.success) {
                // Ensure we only show MARQUEE type items
                const filtered = res.data.filter(item =>
                    item.type === 'MARQUEE' || item.type === 'marquee'
                );
                setMarquees(filtered);
            }
        } catch (error) {
            console.error("Error fetching marquees:", error);
            toast.error("Failed to load marquees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarquees();
    }, []);

    const handleToggleVisibility = async (id) => {
        try {
            const res = await toggleDisplayVisibilityApi(id);
            if (res.success) {
                toast.success(res.message);
                fetchMarquees();
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteDisplayItemApi(selectedId);
            if (res.success) {
                toast.success("Marquee deleted successfully");
                setIsModalOpen(false);
                fetchMarquees();
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to delete marquee");
        }
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "200px"
        },
        {
            name: "Marquee Text",
            selector: (row) => row.content,
            sortable: true,
            
            cell: (row) => (
                <div className="max-w-xs truncate font-medium text-(--text-main)" title={row.content}>
                    {row.content}
                </div>
            )
        },
        {
            name: "Order",
            selector: (row) => row.order,
            sortable: true,
            width: "200px"
        },
        {
            name: "Status",
            selector: (row) => row.isVisible,
            sortable: true,
            cell: (row) => (
                <button
                    onClick={() => handleToggleVisibility(row._id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${row.isVisible
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                >
                    {row.isVisible ? <FiEye /> : <FiEyeOff />}
                    {row.isVisible ? "VISIBLE" : "HIDDEN"}
                </button>
            ),
            width: "200px"
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedId(row._id);
                            setIsModalOpen(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
            width: "200px"
        }
    ];

    return (
        <div className="pb-10 bg-transparent animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <MainHeading
                    title={"Marquee Management"}
                    subtitle={"Manage scrolling text announcements for the website"}
                />
                <Button
                    title={"Add New Marquee"}
                    icon={<FiPlus size={18} />}
                    onClick={() => navigate('/add-marquee')}
                    className="bg-(--bs-btn) text-white shadow-md hover:shadow-xl transition-all"
                />
            </div>

            <div className="bg-(--bg-box) p-3 rounded-2xl shadow-sm border border-(--bs-border) overflow-hidden">
                <CommonDataTable
                    data={marquees}
                    columns={columns}
                    loading={loading}
                    title="Marquee List"
                />
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Marquee"
                message="Are you sure you want to delete this marquee? This action cannot be undone."
            />
        </div>
    );
};

export default Marquee;
