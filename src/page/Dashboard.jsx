import React, { useState, useEffect } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { getAllOrdersApi } from "../api/order-api";
import { useNavigate } from "react-router-dom";
import { PathRoutes } from "../constant/Path";
import { toast } from "react-toastify";
import DateTime from "../Component/DateTime";
import Card from "../Component/Cards";
import Payoutcards from "../Component/Payoutcards";

import { FaAngleDown, FaRegCheckCircle } from "react-icons/fa";

import { Activity, DollarSign, Space, Wallet } from "lucide-react";


import { Eye, Pencil } from "lucide-react";
import OrderActivityCard from "../Component/OrderActivityCard";
import Chart from "react-apexcharts";
import  {Heading, MainHeading } from "../Component/Heading";
import CommonDataTable from "../Component/CommonDataTable";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const apiChartData = {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    series: [
      {
        name: "Orders Placed",
        data: [45, 52, 38, 60, 42, 55],
      },
      {
        name: "Payments Completed",
        data: [38, 40, 30, 48, 35, 45],
      },
      {
        name: "Pending Payments",
        data: [12, 10, 8, 14, 9, 11],
      },
    ],
  };

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },

    colors: [
      function ({ seriesIndex }) {
        const colors = [
          "rgba(128, 203, 222, 1)", // Orders
          "rgba(251, 201, 76, 1)", // Payments
          "rgba(204, 195, 248, 1)", // Pending
        ];
        return colors[seriesIndex];
      },
    ],

    plotOptions: {
      bar: {
        columnWidth: "80%",

        borderRadius: 2,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 0,
    },

    grid: {
      show: false,
    },

    xaxis: {
      categories: apiChartData.categories,
      labels: {
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      show: false,
    },

    legend: {
      show: false,
    },

    tooltip: {
      custom: function ({ series, dataPointIndex }) {
        return `
        <div class="h-20 w-40 rounded-xl shadow-md text-xs grediant-img2 ">
        
          <div>Orders: ${series[0][dataPointIndex]}</div>
          <div>Payments: ${series[1][dataPointIndex]}</div>
          <div>Pending: ${series[2][dataPointIndex]}</div>
        </div>
      `;
      },
    },
  };

  const orderActivityData = {
    title: "Order Activity",
    subtitle: "Average daily financial activity past 7 days",
    growth: "+31%",
    items: [
      {
        label: "Orders Placed",
        value: 45,
        color: "bg-blue-300",
      },
      {
        label: "Payments Completed",
        value: 38,
        color: "bg-yellow-400",
      },
      {
        label: "Pending Payments",
        value: 12,
        color: "bg-sky-300",
      },
    ],
  };

  const cardData = [
    {
      title: "Total SELLING ",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total INVESTIMENT",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total DISTRIBUTED",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total EARNING",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
  ];

  const payoutData = [
    { value: "0", label: "SPOT INCOME", icon: Activity },
    { value: "0", label: "LEVEL INCOME", icon: DollarSign },
    { value: "0", label: "MATCHING", icon: FaRegCheckCircle },
    { value: "0", label: "ROYALTY", icon: DollarSign },
    { value: "0", label: "REWARDS", icon: Wallet },
  ];

  const todayspayout = [
    { id: 1, value: "0", label: "SPOT INCOME", icon: Activity },
    { id: 2, value: "0", label: "LEVEL INCOME", icon: DollarSign },
    { id: 3, value: "0", label: "MATCHING", icon: FaRegCheckCircle },
    { id: 4, value: "0", label: "REWARDS", icon: DollarSign },
    { id: 5, value: "0", label: "Today total ", icon: Wallet },
    { id: 6, value: "0", label: "SPOT INCOME", icon: Activity },
  ];

  const critical = [
    {
      id: 1,
      value: "0",
      label: "FUND REQUESTS",
      icon: DollarSign,
      rightIcon: IoAlertCircleOutline,
    },
    {
      id: 2,
      value: "0",
      label: "SUPPORT TICKETS",
      icon: Wallet,
      rightIcon: Activity,
    },
  ];

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersApi({ page: currentPage, limit });
      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const StatusBadge = ({ status }) => {
    const colorMap = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      PLACED: "bg-indigo-100 text-indigo-700 border-indigo-200",
      PROCESSING: "bg-orange-100 text-orange-700 border-orange-200",
      CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      RETURNED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
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
      selector: (row) => row?.fullName || row?.userId,
    },
    {
      name: "Date",
      selector: (row) => <DateTime date={row.createdAt} />,
      sortable: true,
    },
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
            className="p-2 rounded-lg cursor-pointer bg-blue-100 text-blue-600"
            onClick={() => navigate(`${PathRoutes.ORDERS_DETAILS}/${row._id}`)}
            title="View Details"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];


  return (
    <div className="md:mt-5 overflow-x-hidden">
      <div>
       

        <MainHeading
        title={"All Store Activity"}
        subtitle={"Real-time overview of orders, payments, customers & operations"}
        />

        {/* first section */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10  ">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
        {/* second section */}
        <div className="flex flex-col lg:flex-row gap-3 mt-3 w-full items-start p-1">
          {/* Left Container */}
          <div className="bg-(--bg-box) flex flex-col lg:flex-row p-3 rounded-4xl w-full lg:w-[calc(100%-30%)]">
            <div className="w-full lg:w-[60%] mb-3 lg:mb-0">
              <OrderActivityCard data={orderActivityData} />
            </div>
            <div className="w-full">
              <Chart
                options={chartOptions}
                series={apiChartData.series}
                type="bar"
                height={220}
              />
            </div>
          </div>

          {/* Right Container */}
          <div className="bg-(--bg-box) rounded-4xl p-5 w-full lg:w-[30%]">
            <Heading
              title="Critical Actions"
              subtitle="Immediate attention required"
            />

            <div className="grid grid-cols-1 gap-7 ">
              {critical.map((item, index) => (
                <Payoutcards
                  key={index}
                  icon={item.icon}
                  rightIcon={item.rightIcon}
                  value={item.value}
                  label={item.label}
                  bgColor="rgba(242, 247, 250, 1)"
                  font="semibold"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Third section */}

        <div className="bg-(--bg-box) w-full mt-3 rounded-4xl p-5">
          <Heading
            title="Payout Distribution"
            subtitle=" Detailed breakdown of income streams"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 justify-between gap-7 mt-5 ">
            {payoutData.map((item, index) => (
              <Payoutcards
                key={index}
                icon={item.icon}
                value={item.value}
                bgColor="rgba(242, 247, 250, 1)"
                font="semibold"
                label={item.label}
              />
            ))}
          </div>
        </div>

        {/* Fourth Section */}

        <div className="bg-(--bg-box) w-full mt-3 rounded-4xl p-5 ">
          
          <Heading title="Today's Payout" subtitle="Today's income breakdown" />

          <div className="grid grid-cols-12 gap-7 mt-5  items-center justify-center">
            <div className="col-span-12 lg:col-span-6 items-center  ">
              <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 ">
                {todayspayout.map((item, index) => (
                  <Payoutcards
                    key={index}
                    icon={item.icon}
                    value={item.value}
                    label={item.label}
                    font="semibold"
                    bgColor="rgba(242, 247, 250, 1)"
                  />
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 items-center ">
              <Payoutcards
                icon={Wallet}
                value={0}
                label="REWARDS"
                bgColor="rgba(242, 247, 250, 1)"
                showTarget={true}
              />
            </div>

            <div className="col-span-12 lg:col-span-3 flex flex-col gap-7 ">
              <Payoutcards
                icon={DollarSign}
                value={0}
                label="TODAY TOTAL DISTRIBUTED"
                bgColor="rgba(204, 195, 248, 1)"
                color="White"
                font="medium"
              />
                     
              <Payoutcards
                icon={DollarSign}
                value={0}
                label="OVERALL TOTAL DISTRIBUTED"
                bgColor="rgba(251, 201, 76, 1)"
                color="white"
                font="medium"
              />
            </div>
          </div>
        </div>

        {/* Order list */}

        <div className="bg-(--bg-box) rounded-4xl p-5 mt-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Heading title="Order List" />

            <div className="flex gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Here"
                className="border border-(--input-border) text-(--text-third) rounded-sm w-full sm:w-35 p-1 text-xs outline-none"
              />
              <button className="bg-(--bg-green) text-(--text-white) px-2 items-center font-extralight py-1 rounded-sm text-xs flex whitespace-nowrap">
                Sort By <FaAngleDown className="text-xs font-extralight ml-1" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full mt-4">
            <CommonDataTable
              columns={columns}
              data={orders}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
