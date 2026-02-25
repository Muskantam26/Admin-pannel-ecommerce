import { useState, useEffect } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import { ShoppingBag, DollarSign, Wallet, Eye, AlertCircle } from "lucide-react";
import UserCards from '../Component/UserCards';
import { MdOutlinePendingActions } from "react-icons/md";

import { CgProfile } from 'react-icons/cg';
import CommonDataTable from '../Component/CommonDataTable';
import OrderChart from '../Component/chart/Orderchart';
import AlertCard from '../Component/AlertCard';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../constant/Path';
import { getAllOrdersApi, updateOrderStatusApi } from '../api/order-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/slice/loadingSlice';
import DateTime from '../Component/DateTime';
import PageLoader from '../Component/PageLoader';

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

const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10;

  // Chart Data (Static for now, can be dynamic later)
  const chartData = [
    { month: "Jan", previous: 8000, current: -10000 },
    { month: "Feb", previous: -2000, current: -8000 },
    { month: "Mar", previous: 3000, current: 6000 },
    { month: "Apr", previous: 5000, current: 2000 },
    { month: "May", previous: -3000, current: -6000 },
    { month: "Jun", previous: 2000, current: -4000 },
  ];

  const fetchOrders = async () => {
    try {

      const response = await getAllOrdersApi({ page: currentPage, limit });
      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setTotalOrders(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    dispatch(showLoader());
    try {
      const response = await updateOrderStatusApi(orderId, { status: newStatus });
      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      dispatch(hideLoader());
    }
  };


  const columns = [
    {
      name: "Order Id",
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: "Client ID",
      selector: (row) => row?.userId,
    },
    {
      name: "Client Name",
      selector: (row) => row?.fullName,
    },
    {
      name: "Date",
      selector: (row) => <DateTime date={row.createdAt} />,
      sortable: true,
    },
    // {
    //   name: "Items",
    //   selector: (row) => row.items?.length || 0,
    // },
    {
      name: "Payment",
      selector: (row) => row.paymentMethod,
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.totalPrice}`,
      sortable: true,
    },
    {
      name: "Payment Status",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.paymentStatus === 'PAID' ? 'bg-green-100 text-(--bg-green)' : 'bg-(--bs-del) text-(--bs-red)'}`}>
          {row.paymentStatus}
        </span>
      ),
    },
    {
      name: "Status",
      grow: 2,
      cell: (row) => <InteractiveStatusBadge orderId={row._id} currentStatus={row.orderStatus} onStatusChange={handleStatusChange} />,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg cursor-pointer bg-(--icon-btn) text-(--icon-btn-text)"
            onClick={() => navigate(`${PathRoutes.ORDERS_DETAILS}/${row._id}`)} // Assuming detail route takes ID
            title="View Details"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];


  const InteractiveStatusBadge = ({ orderId, currentStatus, onStatusChange }) => {
    const colorMap = {
      PENDING: "bg-yellow-100 text-[var(--bs-warn)] border-yellow-200",
      PLACED: "bg-indigo-100 text-(--icon-text-second) border-indigo-200",
      PROCESSING: "bg-orange-100 text-[var(--bs-line)] border-orange-200",
      CONFIRMED: "bg-[var(--icon-btn)] text-[var(--icon-btn-text)] border-blue-200",
      SHIPPED: "bg-purple-100 text-(--icon-text-second) border-purple-200",
      DELIVERED: "bg-green-100 text-(--bg-green) border-green-200",
      CANCELLED: "bg-(--bs-del) text-(--bs-red) border-[var(--bs-del)]",
      RETURNED: "bg-gray-100 text-[var(--bs-gray)] border-gray-200",
    };

    return (
      <div className="relative group min-w-[120px]">
        <select
          className={`w-full appearance-none px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${colorMap[currentStatus] || 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--bs-border)]'}`}
          value={currentStatus}
          onChange={(e) => onStatusChange(orderId, e.target.value)}
        >
          {ORDER_STATUS_OPTIONS.map(status => (
            <option key={status} value={status} className="bg-[var(--bg-box)] text-[var(--text-main)]">{status}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div>
      <MainHeading
        title={"Order Management"}
      />


      <div className='justify-between bg-(--bg-box) rounded-2xl p-4 md:p-5 mt-5 shadow-2xl'>
        <div className='flex-col'>
          <Heading title={"Order Overview"} />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-5 gap-4 md:gap-10 items-center'>
          <UserCards
            icon={<ShoppingBag size={25} />}
            totalorders={"Total Order"}
            iconBg='bg-(--bs-icon)'
            amount={totalOrders}
            content={"Total orders placed"}
          />

          <UserCards
            icon={<Wallet size={25} />}
            totalorders={"Total Revenue"}
            iconBg='bg-(--bs-icon-sec)'
            amount={"₹" + orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)} // Simple sum of current page
            content={"Revenue from current page"}
          />

          {/* Placeholders for specific stats - can be fetched from separate stats API later */}
          <UserCards
            icon={<MdOutlinePendingActions size={25} />}
            totalorders={"Pending Orders"}
            iconBg='bg-(--bs-icon-third)'
            amount={orders.filter(o => o.orderStatus === 'PENDING').length}
            content={"Orders on current page"}
          />

          <UserCards
            icon={<CgProfile size={25} />}
            totalorders={"Delivered"}
            iconBg='bg-(--bs-icon-four)'
            amount={orders.filter(o => o.orderStatus === 'DELIVERED').length}
            content={"Orders on current page"}
          />
        </div>
      </div>


      <div className='bg-(--bg-box) rounded-2xl p-5 mt-5 shadow-2xl'>
        <div className="flex justify-between items-center mb-5">
          <Heading title={"Order Chat"} />
          <select className=" text-xs">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

      

        <OrderChart data={chartData} />
      </div>


      <div className='bg-(--bg-box) rounded-2xl p-4 md:p-5 mt-5 shadow-2xl overflow-hidden'>
        {loading && <PageLoader/>}
        <Heading
          title={"Order Status"} />

        <CommonDataTable
          columns={columns}
          data={orders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}

        />
      </div>

      <div className='bg-(--bg-box) rounded-2xl p-4 md:p-5 mt-5 shadow-2x'>
        <Heading
          title={"Notification & Alert"} />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 mt-5'>
          <AlertCard
            icon={<AlertCircle />}
            category="Operations"
            time="Now"
            title="Order #1023 Delayed"
            description="Production stopped due to raw material delay"
            severity="High Severity" />

          {/* Placeholders - Can be dynamic later */}
        </div>
      </div>

    </div>
  )
}

export default OrderManagement