import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { FiSearch, FiShoppingCart, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../constant/Path';
import { getAllCartsApi } from '../../api/cart-api';
import CommonDataTable from '../../Component/CommonDataTable';

const CartPage = () => {
    const dispatch = useDispatch();
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const getAllCarts = async () => {
        dispatch(showLoader());
        const res = await getAllCartsApi();
        if (res.success) {
            setCarts(res.data);
            setFilteredCarts(res.data);
        } else {
            toast.error(res.message);
        }
        dispatch(hideLoader());
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getAllCarts();
    }, []);

    useEffect(() => {
        const results = carts.filter(cart =>
            cart.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cart.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cart.userId?.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredCarts(results);
        setCurrentPage(1);
    }, [searchTerm, carts]);

    const columns = [
        {
            name: "#",
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            width: "70px",
        },
        {
            name: "ID",
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <span className="font-semibold text-(--text-main)">{row?.id || "Unknown User"}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Username",
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <span className="text-xs text-(--text-second)">Fullname:- {row.userId?.fullName}</span>
                    <span className="text-[10px] text-(--text-third)">Mobile:- {row.userId?.mobile}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "User ID",
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <span className="font-semibold text-(--text-main)">{row.userId?.id || "Unknown User"}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Items Count",
            cell: (row) => {
                const totalItems = row.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
                return (
                    <span className="bg-[var(--bs-btn-mod)] text-(--bs-btn-forth) py-1 px-3 rounded-full text-xs font-bold">
                        {totalItems} Items
                    </span>
                );
            },
        },
        {
            name: "Total Price",
            cell: (row) => {
                const totalPrice = row.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
                return <span className="font-bold text-(--text-main)">₹{totalPrice.toLocaleString()}</span>;
            },
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <Link
                    to={PathRoutes.CART_DETAILS.replace(":id", row.userId?._id)}
                    className="inline-flex items-center justify-center p-2 rounded-lg cursor-pointer bg-(--icon-btn) text-(--icon-btn-text) transition-all"
                    title="View Details"
                >
                    <FiEye size={14} />
                </Link>
            ),
            center: true,
        },
    ];

    const paginatedData = filteredCarts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="p-6 min-h-screen bg-(--bg-main)">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-(--text-main) flex items-center gap-2">
                    <FiShoppingCart className="text-(--bs-primary)" /> All Carts
                </h1>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--text-third)" />
                    <input
                        type="text"
                        placeholder="Search by User Name, Email, or Mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-(--bs-border) bg-(--bg-box) text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--bs-primary) transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-(--bg-box) rounded-2xl shadow-sm border border-(--bs-border) overflow-hidden p-4">
                <div className="overflow-x-auto w-full">
                    <CommonDataTable
                        columns={columns}
                        data={paginatedData}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredCarts.length / rowsPerPage)}
                        onPageChange={(page) => setCurrentPage(page)}
                        rowsPerPage={rowsPerPage}
                        selectable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartPage;
