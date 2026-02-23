import { useState, useEffect } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import { ShoppingBag, DollarSign, Wallet, Eye, AlertCircle } from "lucide-react";
import UserCards from '../Component/UserCards';

import { CgProfile } from 'react-icons/cg';
import CommonDataTable from '../Component/CommonDataTable';
import OrderChart from '../Component/chart/Orderchart';
import AlertCard from '../Component/AlertCard';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../constant/Path';
import { getAllOrdersApi } from '../api/order-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/slice/loadingSlice';
import DateTime from '../Component/DateTime';

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

    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);


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
        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.paymentStatus}
        </span>
      ),
    },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text) cursor-pointer"
            onClick={() => navigate(`${PathRoutes.ORDERS_DETAILS}/${row._id}`)} // Assuming detail route takes ID
            title="View Details"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];


  const StatusBadge = ({ status }) => {
    const colorMap = {
      PENDING: "bg-yellow-400",
      PLACED: "bg-indigo-400",
      PROCESSING: "bg-orange-400",
      CONFIRMED: "bg-blue-400",
      SHIPPED: "bg-purple-400",
      DELIVERED: "bg-green-500",
      CANCELLED: "bg-red-500",
      RETURNED: "bg-gray-500",
    };

    return (
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colorMap[status] || 'bg-gray-400'}`} />
        <span className="text-sm font-medium">{status}</span>
      </div>
    );
  };

  return (
    <div>
      <MainHeading
        title={"Order Management"}
      />


      <div className=' justify-between  bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>
        <div className='flex-col'>  <Heading
          title={"Order Overview"} /></div>
        <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 mt-5 gap-10 items-center p-5'>
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
            icon={<DollarSign size={25} />}
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
        <div className="flex justify-between items-center">
          <Heading title={"Order Chat"} />
          <select className=" text-xs">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-4">Content</p>

        <OrderChart data={chartData} />
      </div>


      <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>
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

      <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2x'>
        <Heading
          title={"Notification & Alert"} />

        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-5'>
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