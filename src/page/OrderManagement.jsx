import  { useState } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import { ShoppingBag, DollarSign,  Wallet,  Eye, AlertCircle } from "lucide-react";
import UserCards from '../Component/UserCards';

import { CgProfile } from 'react-icons/cg';
import CommonDataTable from '../Component/CommonDataTable';
import OrderChart from '../Component/chart/Orderchart';
import AlertCard from '../Component/AlertCard';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../constant/Path';

const OrderManagement = () => {
 const navigate=useNavigate();

const chartData = [
  { month: "Jan", previous: 8000, current: -10000 },
  { month: "Feb", previous: -2000, current: -8000 },
  { month: "Mar", previous: 3000, current: 6000 },
  { month: "Apr", previous: 5000, current: 2000 },
  { month: "May", previous: -3000, current: -6000 },
  { month: "Jun", previous: 2000, current: -4000 },
];

  


     const statusList =[
      {
        id:1,
        order_id:"#1021",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"At Risk",
        price:"15,000rs",
      },
      {
        id:2,
        order_id:"#1022",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"At Risk",
        status:"Delayed",
        price:"15,000rs",
      },
      {
        id:3,
        order_id:"#1027",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"On Track",
        status:"On Track",
        price:"15,000rs",
      },
      {
        id:4,
        order_id:"#1024",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"Delayed",
        price:"15,000rs",
      },
      {
        id:5,
        order_id:"#1055",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"Delayed",
        price:"15,000rs",
      },
      {
        id:6,
        order_id:"#1029",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"Delayed",
        price:"15,000rs",
      },
      {
        id:6,
        order_id:"#1028",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"Delayed",
        price:"15,000rs",
      },
      {
        id:7,
        order_id:"#1027",
        client_name:"ABC Pharma",
        product:"Face Serum",
        stage:"Production",
        dispatch:"18 jan",
        priority:"High",
        status:"Delayed",
        price:"15,000rs",
      },
     ]


     

   const columns = [
    {
      name: "Order Id",
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
      cell: (row) => row.priority,
    },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
        name:"Price ",
        selector:(row)=>row.price,
    },
    
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text)"  onClick={()=>navigate(PathRoutes.ORDERS_DETAILS)} >
            <Eye size={10} />

          </button>
        
           
        </div>
      ),
    },
  ];


  const StatusBadge = ({ status }) => {
    const colorMap = {
      Delayed: "bg-red-500",
      "At Risk": "bg-yellow-400",
      "On Track": "bg-green-500",
     
    };

    
    return (
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colorMap[status]}`} />
        <span className="text-sm">{status}</span>
      </div>
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
     const rowsPerPage = 6;
   
     const totalPages = Math.ceil(statusList.length / rowsPerPage);
   
     const paginatedData =statusList.slice(
       (currentPage - 1) * rowsPerPage,
       currentPage * rowsPerPage,
     )



     
  return (
    <div>
        <MainHeading
        title={"Order Management"}
        />


<div className=' justify-between  bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>
  <div className='flex-col'>  <Heading
  title={"Order Overview"}/></div>
 <div className='flex mt-5 gap-10 items-center p-5'>
<UserCards
  icon={<ShoppingBag size={25} />}
  totalorders={"Total Order"}
  iconBg='bg-(--bs-icon)'
  amount={500}
  content={"0.45% since last month"}
/>

<UserCards
  icon={<Wallet size={25} />}
  totalorders={"Orders Delayed"}
  iconBg='bg-(--bs-icon-sec)'
  amount={100}
  content={"0.30% since last month"}
/>

<UserCards
  icon={<DollarSign size={25} />}
  totalorders={"PENDING PAYMENT"}
  iconBg='bg-(--bs-icon-third)'
  amount={400}
  content={"0.25% since last month"}
/>

<UserCards
  icon={<CgProfile size={25} />}
  totalorders={"OPEN COMPLAINTS"}
  iconBg='bg-(--bs-icon-four)'
  amount={354535}
  content={"0.18% since last month"}
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
  title={"Order Status"}/>

  <CommonDataTable
 columns={columns}
data={paginatedData}
currentPage={currentPage}
totalPages={totalPages}
onPageChange={setCurrentPage}
  
  />
</div>

<div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2x'>
  <Heading
  title={"Notification & Alert"}/>

  <div className='grid grid-cols-3 gap-7 mt-5'>
    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>

    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>

    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
 borderColor='border-(--bs-btn-forth)'
badgeColor='bg-(--bs-icon-third)'
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>

    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>

    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>

    <AlertCard
    icon={<AlertCircle/>}
    category="Operations"
  time="Now"
  title="Order #1023 Delayed"
  description="Production stopped due to raw material delay"
  severity="High Severity"/>
  </div>
</div>

    </div>
  )
}

export default OrderManagement