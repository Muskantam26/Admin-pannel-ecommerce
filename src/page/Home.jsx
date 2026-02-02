import React, { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import Card from "../Component/Cards";
import Payoutcards from "../Component/Payoutcards";

import { FaAngleDown, FaRegCheckCircle } from "react-icons/fa";

import { Activity, DollarSign, Space, Wallet } from "lucide-react";

import DataTable from "react-data-table-component";
import { Eye, Pencil } from "lucide-react";
import OrderActivityCard from "../Component/OrderActivityCard";
import Chart from "react-apexcharts";


const Home = () => {
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
        "rgba(251, 201, 76, 1)",  // Payments
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
    width:0
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
    { id: 1, value: "0", label: "FUND REQUESTS", icon: DollarSign ,rightIcon:IoAlertCircleOutline },
    { id: 2, value: "0", label: "SUPPORT TICKETS", icon: Wallet,rightIcon:Activity},
  ];

  const orderList = [
    {
      id: 1,
      order_id: "#1021",
      client_name: "ABC pharma",
      product: "Face Serum",
      stage: "Production",
      dispatch: "18 jan",
      priority: "High",
      status: "Delayed",
      price: "15000",
    },
    {
      id: 2,
      order_id: "#2023",
      client_name: "NeoCare",
      product: "Shampoo",
      stage: "Packaging",
      dispatch: "20 Feb",
      priority: "Low",
      status: "At Risk",
      price: "15000",
    },
    {
      id: 3,
      order_id: "#5620",
      client_name: "ZenLabs",
      product: "Body Lotion",
      stage: "QC",
      dispatch: "30 Jan",
      priority: "High",
      status: "On Track",
      price: "15000",
    },
    {
      id: 4,
      order_id: "#6201",
      client_name: "DermaPlus",
      product: "Cream",
      stage: "Raw Material",
      dispatch: "12 Feb",
      priority: "Low",
      status: "Medium",
      price: "20000",
    },
    {
      id: 5,
      order_id: "#8502",
      client_name: "GlowCo",
      product: "Face Wash",
      stage: "Dispatch",
      dispatch: "25 Jan",
      priority: "High",
      status: "Low",
      price: "15000",
    },
    {
      id: 6,
      order_id: "#6503",
      client_name: "NeoCare",
      product: "Cream",
      stage: "Packaging",
      dispatch: "10 Feb",
      priority: "Low",
      status: "Medium",
      price: "25000",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const totalPages = Math.ceil(orderList.length / rowsPerPage);

  const paginatedData = orderList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const StatusBadge = ({ status }) => {
    const colorMap = {
      Delayed: "bg-red-500",
      "At Risk": "bg-yellow-400",
      "On Track": "bg-green-500",
      Medium: "bg-orange-400",
      Low: "bg-green-500",
      High: "bg-red-400",
    };

    return (
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colorMap[status]}`} />
        <span className="text-sm">{status}</span>
      </div>
    );
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.order_id,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.client_name,
    },
    {
      name: "Product",
      selector: (row) => row.product,
    },
    {
      name: "Stage",
      selector: (row) => row.stage,
    },
    {
      name: "Dispatch",
      selector: (row) => row.dispatch,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
    },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      name: "Price",
      selector: (row) => `₹${row.price}`,
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text)">
            <Eye size={10} />
          </button>
          <button className="p-2 rounded-lg bg-(--icon-btn-second) text-(--icon-text-second) ">
            <Pencil size={10} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <div>
        <h1 className="text-6xl font-bold text-(--text-main)">
          All Store Activity
        </h1>
        <p className="text-(--text-third) text-xs font-medium mt-2">
          Real-time overview of orders, payments, customers & operations
        </p>

        {/* first section */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10  ">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
{/* second section */}
        <div className="flex gap-3 mt-3 w-full items-center p-1 ">
          <div className="bg-(--bg-box) flex p-3    rounded-xl w-[calc(100%-30%)]">
            <div className="w-[60%]">
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

          <div className="bg-(--bg-box) rounded-xl p-6 w-[30%] ">
            <h1 className="text-xl  text-(--text-main) m-3font-medium ">
              Critical Actions
            
            <p className="text-xs text-(--text-third)">
              Immediate attention required
            </p>
            </h1>

            <div className="grid grid-cols-1 space-y-2  p-1">
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

        <div className="bg-(--bg-box) w-full mt-3 rounded-2xl p-5" >
          <h1 className="text-(--text-main) font-medium text-xl p-3">
            Payout Distribution
         
          <p className="text-(--text-third) text-xs font-medium ">
            Detailed breakdown of income streams
          </p>
           </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 justify-between gap-7 mt-5">
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

        <div className="bg-(--bg-box) w-full mt-5 rounded-2xl p-3 flex-col items-center justify-between">
          <h1 className="text-(--text-main) font-medium text-xl p-3">
            Today's Payout
        
          <p className="text-(--text-third) text-[11px]  font-medium ">
            Today's income breakdown
          </p>
  </h1>
          <div className="flex gap-7 justify-between mt-5">

          <div className="grid grid-cols-3 gap-7 justify-between  ">
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
            
             {/* <Payoutcards
             key={4}
             icon={DollarSign}
             value={0}
             label={"REWARDS"}
             showTarget={true}

             />
              */}

            {/* {todayspayout.slice(4,todayspayout.length).map((item, index) => (
              <Payoutcards
                key={index}
                icon={item.icon}
                value={item.value}
                label={item.label}
              />
            ))} */}
          </div>
          <div className="w-65 ">
          <Payoutcards
          key={8}
          icon={Wallet}
          value={0}
          label={"REWARDS"}
         bgColor="rgba(242, 247, 250, 1)"
          showTarget={true}
          />
          </div>

          <div className=" flex-col space-y-4">
            <Payoutcards
            key={9}
            icon={DollarSign}
            value={0}
            label={"TODAY TOTAL DISTRIBUTED"}
            bgColor="rgba(204, 195, 248, 1)"
            color="White"
            font="medium"
            
            />

            <Payoutcards
            key={10}
            icon={DollarSign}
            value={0}
            label={"OVERALL TOTAL DISTRIBUTED"}
            bgColor="rgba(251, 201, 76, 1)"
            color="white"
            font="medium"
            />

          </div>
          </div>
        </div>

        {/* Order list */}

        <div className="bg-(--bg-box) rounded-2xl p-3 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-(--text-main) font-medium text-xl">
              Order Lists
            </h1>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search Here"
                className="border border-(--input-border) text-(--text-third) rounded-sm w-35 p-1 text-xs outline-none"
              />
              <button className="bg-(--bg-green) text-(--text-white) px-2 items-center font-extralight  rounded-sm text-xs flex">
                Sort By <FaAngleDown className="text-xs font-extralight" />
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={paginatedData}
            pagination={false}
            selectableRows
            responsive
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-(--text-third)">Showing 6 Entries</p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 text-xs rounded
          ${
            currentPage === index + 1
              ? "bg-(--bg-green) text-(--text-white)"
              : "bg-(--bg-main)"
          }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
