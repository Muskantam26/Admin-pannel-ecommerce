import React, { useEffect, useState } from 'react'
import { Heading, MainHeading } from '../../Component/Heading'
import { InputField } from '../../Component/InputBox'
import CommonDataTable from '../../Component/CommonDataTable'
import OrderProgressBar from '../../Component/OrderProgressBar'
import Button from '../../Component/Btn'
import { 
    FiPackage, FiUser, FiMail, FiPhone, FiMapPin, 
    FiCreditCard, FiCalendar, FiDollarSign, FiClock,
    FiTruck, FiCheckCircle, FiFileText
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { getOrderByIdApi, updateOrderStatusApi } from '../../api/order-api'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slice/loadingSlice'
import ConfirmationModal from '../../Component/Model/ConfirmationModal'

const ORDER_STATUS_OPTIONS = [
    'PENDING',
    'PLACED',
    'PROCESSING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED'
];

const ViewOrdersDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const dispatch = useDispatch();
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        isDanger: false
    });

    const fetchOrderDetails = async () => {
        dispatch(showLoader());
        try {
            const response = await getOrderByIdApi(id);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to fetch order details");
        } finally {
            dispatch(hideLoader());
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const executeUpdateStatus = async (newStatus) => {
        try {
            const response = await updateOrderStatusApi(id, { status: newStatus });
            if (response.success) {
                toast.success(`Order marked as ${newStatus}`);
                fetchOrderDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleUpdateStatus = (newStatus) => {
        setConfirmation({
            isOpen: true,
            title: `Mark as ${newStatus}`,
            message: `Are you sure you want to mark this order as ${newStatus}?`,
            onConfirm: () => executeUpdateStatus(newStatus),
            isDanger: newStatus === 'CANCELLED'
        });
    }

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
    };

    const columns = [
        {
            name: "Product Image",
            cell: (row) => (
                <img
                    src={row.image}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-md"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                />
            ),
            width: "100px"
        },
        {
            name: "Product Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Price",
            selector: (row) => `₹${row.price}`,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
        },
        {
            name: "Total",
            selector: (row) => `₹${row.price * row.quantity}`,
        },
    ]

    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="p-2 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <MainHeading 
                    title="Order Management"
                    subtitle="Manage and track order details efficiently"
                />
                
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => window.open(`/invoice/${id}`, '_blank')}
                        className="flex items-center gap-2 bg-[var(--bs-btn)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--btn-hover)] transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <FiFileText size={16} />
                        Invoice
                    </button>
                    
                    <InteractiveStatusBadge
                        currentStatus={order.orderStatus}
                        onStatusChange={handleUpdateStatus}
                    />
                </div>
            </div>

            {/* Order Header Card */}
            <div className="bg-[var(--bg-box)] rounded-2xl shadow-xl overflow-hidden border border-[var(--bs-border)]">
                <div className="bg-[var(--bg-main)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--bs-btn)] rounded-xl backdrop-blur-sm">
                            <FiPackage className="text-[var(--text-white)] text-2xl" />
                        </div>
                        <Heading 
                            title={`Order #${order.orderId || order._id.slice(-6).toUpperCase()}`}
                            subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
                            titleSize="text-xl"
                            subtitleSize="text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-6 text-[var(--text-main)] mt-4 md:mt-0 w-full md:w-auto md:justify-end border-t border-[var(--bs-border)] pt-4 md:border-0 md:pt-0">
                        <div className="text-left md:text-right w-full">
                            <p className="text-(--text-second) text-xs uppercase tracking-wider font-bold">Total Amount</p>
                            <p className="text-2xl font-black text-indigo-400">₹{order.totalPrice}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Column 1: Customer Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-4 border-b pb-2">
                                    <FiUser className="text-indigo-600" />
                                    Customer Information
                                </h3>
                                <div className="space-y-4">
                                    <DataRow 
                                        label="Full Name" 
                                        value={order.userId?.fullName || order.userId?.username || "N/A"} 
                                        icon={<FiUser />}
                                    />
                                    <DataRow 
                                        label="Email" 
                                        value={order.userId?.email || "N/A"} 
                                        icon={<FiMail />}
                                    />
                                    <DataRow 
                                        label="Phone" 
                                        value={order.userId?.mobile || "N/A"} 
                                        icon={<FiPhone />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Payment info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-4 border-b pb-2">
                                    <FiCreditCard className="text-indigo-600" />
                                    Payment Details
                                </h3>
                                <div className="space-y-4">
                                    <DataRow 
                                        label="Method" 
                                        value={order.paymentMethod} 
                                        icon={<FiCreditCard />}
                                    />
                                    <DataRow 
                                        label="Status" 
                                        value={order.paymentStatus} 
                                        badge={order.paymentStatus === 'PAID' ? 'success' : 'danger'}
                                        icon={<FiCheckCircle />}
                                    />
                                    <DataRow 
                                        label="Order Type" 
                                        value={order.orderType || 'REPURCHASE'} 
                                        icon={<FiClock />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Shipping Address */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-4 border-b pb-2">
                                    <FiMapPin className="text-indigo-600" />
                                    Shipping Address
                                </h3>
                                <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--bs-border)] flex gap-3">
                                    <FiMapPin className="text-[var(--icon-color)] mt-1 shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-[var(--text-main)]">{order.shippingAddress?.name}</p>
                                        <p className="text-sm text-(--text-second) leading-relaxed">
                                            {order.shippingAddress?.address},<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}
                                        </p>
                                        <p className="text-sm text-indigo-600 font-medium mt-2">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[var(--bg-box)] rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--bs-border)] overflow-hidden'>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FiPackage size={20} />
                    </div>
                    <Heading title={"Order Items"} />
                </div>

                <div className="overflow-x-auto w-full">
                    <CommonDataTable
                        columns={columns}
                        data={order.items || []}
                        pagination={false}
                    />
                </div>
            </div>


            <div className='bg-[var(--bg-box)] rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--bs-border)]'>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FiTruck size={20} />
                    </div>
                    <Heading title={"Order Progress"} />
                </div>

                <div className="max-w-3xl mx-auto py-4">
                    <OrderProgressBar status={order.orderStatus} trackHistory={order.history} />
                </div>

                <div className='flex flex-wrap justify-center gap-4 mt-10 p-4 border-t border-gray-50'>
                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                        <button
                            className='px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all shadow-sm border border-red-100 active:scale-95'
                            onClick={() => handleUpdateStatus('CANCELLED')}
                        >
                            Cancel Order
                        </button>
                    )}

                    {order.orderStatus === 'PENDING' && (
                        <QuickActionBtn title="Confirm Order" color="blue" onClick={() => handleUpdateStatus('PROCESSING')} icon={<FiCheckCircle />} />
                    )}
                    {order.orderStatus === 'PROCESSING' && (
                        <QuickActionBtn title="Place Order" color="indigo" onClick={() => handleUpdateStatus('PLACED')} icon={<FiPackage />} />
                    )}
                    {order.orderStatus === 'PLACED' && (
                        <QuickActionBtn title="Confirm Order" color="blue" onClick={() => handleUpdateStatus('CONFIRMED')} icon={<FiCheckCircle />} />
                    )}
                    {order.orderStatus === 'CONFIRMED' && (
                        <QuickActionBtn title="Mark Shipped" color="purple" onClick={() => handleUpdateStatus('SHIPPED')} icon={<FiTruck />} />
                    )}
                    {order.orderStatus === 'SHIPPED' && (
                        <QuickActionBtn title="Mark Delivered" color="green" onClick={() => handleUpdateStatus('DELIVERED')} icon={<FiCheckCircle />} />
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                isDanger={confirmation.isDanger}
            />
        </div>
    )
}

const DataRow = ({ label, value, icon, badge }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] flex items-center justify-center text-[var(--icon-color)] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {React.cloneElement(icon, { size: 14 })}
            </div>
            <span className="text-xs font-bold text-[var(--text-second)] uppercase tracking-tight">{label}</span>
        </div>
        {badge ? (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                badge === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {value}
            </span>
        ) : (
            <span className="text-sm font-bold text-[var(--text-main)]">{value}</span>
        )}
    </div>
);

const QuickActionBtn = ({ title, color, onClick, icon }) => {
    const colors = {
        blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200",
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
        purple: "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200",
        green: "bg-green-600 text-white hover:bg-green-700 shadow-green-200",
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${colors[color]}`}
        >
            {icon && React.cloneElement(icon, { size: 16 })}
            {title}
        </button>
    );
};

const InteractiveStatusBadge = ({ currentStatus, onStatusChange }) => {
    const colorMap = {
        PENDING: "bg-yellow-100 text-[var(--bs-warn)] border-yellow-200 ring-yellow-500",
        PLACED: "bg-indigo-100 text-(--icon-text-second) border-indigo-200 ring-indigo-500",
        PROCESSING: "bg-orange-100 text-(--bs-line) border-orange-200 ring-orange-500",
        CONFIRMED: "bg-[var(--icon-btn)] text-[var(--icon-btn-text)] border-blue-200 ring-blue-500",
        SHIPPED: "bg-purple-100 text-(--icon-text-second) border-purple-200 ring-purple-500",
        DELIVERED: "bg-green-100 text-(--bg-green) border-green-200 ring-green-500",
        CANCELLED: "bg-(--bs-del) text-(--bs-red) border-[var(--bs-del)] ring-red-500",
        RETURNED: "bg-gray-100 text-[var(--bs-gray)] border-gray-200 ring-gray-500",
    };

    return (
        <div className="relative group min-w-[140px]">
            <select
                className={`w-full appearance-none px-4 py-2 rounded-full text-xs font-bold border shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorMap[currentStatus] || 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--bs-border)]'}`}
                value={currentStatus}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                {ORDER_STATUS_OPTIONS.map(status => (
                    <option key={status} value={status} className="bg-[var(--bg-box)] text-[var(--text-main)]">{status}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default ViewOrdersDetails
