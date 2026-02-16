import React, { useState } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import UserCards from '../Component/UserCards'
import { CgProfile } from 'react-icons/cg'
import CommonDataTable from '../Component/CommonDataTable'
import { Eye, Pencil, User } from 'lucide-react'
import { RiDeleteBin6Line, RiProfileFill } from 'react-icons/ri'
import Button, { ActionButton } from '../Component/Btn'
import Modal from '../Model/Modal'
import AddMember from './AddMember'





const UserManagement = () => {

// const [activeModal, setActiveModal] = useState(null);
// const handleSave = (data) => { console.log("Backend payload:", data); };

const [isAddUserOpen, setIsAddUserOpen] = useState(false);


    const bannerList =[
        {
            id:1,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"active",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:2,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"pending",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:3,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"inactive",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:4,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"active",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:5,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"active",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:6,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"active",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        {
            id:7,
            name:"John Smith",
            email:"john.smith@example.com",
            type:"user",
            role:"Editor",
            status:"active",
            join_date:"12/15/2024",
            last_active:"3 Images",
        },
        
    ]


    
   const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      
    },
   

    {
      name: "Email",
      selector: (row) => row.email,
      
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Join Date",
      cell: (row) => row.join_date,
    },
    {
      name: "Last Active",
      selector: (row) => row.last_active,
    },
    
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text)" >
            <Eye size={10} />

          </button>
          <button className="p-2 rounded-lg bg-(--icon-btn-second) text-(--icon-text-second)" >
            <Pencil size={10} />
          </button>
          <button className="p-2 rounded-lg bg-(--bs-btn-second) text-(--text-white) ">
            <RiDeleteBin6Line size={10} />
          </button>
        </div>
      ),
    },
  ];




    
      const [currentPage, setCurrentPage] = useState(1);
         const rowsPerPage = 6;
       
         const totalPages = Math.ceil(bannerList.length / rowsPerPage);
       
         const paginatedData =bannerList.slice(
           (currentPage - 1) * rowsPerPage,
           currentPage * rowsPerPage,
         )
  return (
    <div>

      <div className='flex justify-between'>
        <MainHeading
        title={"User Management"}
        subtitle={"Real-time overview of orders, payments, customers & operations"}/>
  

 <ActionButton
title='Add User'
icon={<User size={15}/>}
className='flex h-8 text-(--text-second) px-4'
onClick={() => setIsAddUserOpen(true)}
/>


<Modal isOpen={isAddUserOpen}>
  <AddMember onClose={() => setIsAddUserOpen(false)} />
</Modal>


      
      
</div>
        <div className="justify-between  bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl">
           <div className='flex-col'> <Heading
            title={"User & Role Management"}/></div>
            <div className='flex mt-5 gap-10 items-center p-5'>
                <UserCards
                icon={<CgProfile/>}
                totalorders={"Total Orders"}
                iconBg='bg-(--bs-icon)'
                amount={500}
                />

                 <UserCards
                icon={<CgProfile/>}
                totalorders={"Total Orders"}
                iconBg='bg-(--bs-icon)'
                amount={1504}
                />

                 <UserCards
                icon={<CgProfile/>}
                totalorders={"Total Orders"}
                iconBg='bg-(--bs-icon)'
                amount={300}
                />

                 <UserCards
                icon={<CgProfile/>}
                totalorders={"Total Orders"}
                iconBg='bg-(--bs-icon)'
                amount={35485}
                />
            </div>
        </div>

        <div className=' justify-between  bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>
            <Heading
            title={"User Panel Banner List"}/>
 <CommonDataTable
 columns={columns}
data={paginatedData}
currentPage={currentPage}
totalPages={totalPages}
onPageChange={setCurrentPage}
  />

        </div>
    </div>
  )
}

export default UserManagement