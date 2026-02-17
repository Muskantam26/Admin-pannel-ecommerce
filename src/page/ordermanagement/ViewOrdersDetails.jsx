import React, { useState } from 'react'
import { Heading, MainHeading } from '../../Component/Heading'
import { InputField } from '../../Component/InputBox'
import CommonDataTable from '../../Component/CommonDataTable'
import OrderProgressBar from '../../Component/OrderProgressBar'
import Button from '../../Component/Btn'

const ViewOrdersDetails = () => {

    

 const orderIssues=[
    {
        id:1,
        issue_type:"Production Delay",
        description:"Production stage started late due to delayed handover from packaging, impacting QC timeline",
        status:"open    "
    },
    {
        id:2,
        issue_type:"QC Schedule Impact",
        description:"QC activity pushed due to production delay, dispatch date at risk",
        status:"In Progress"
    }
 ]


 const columns=[
    {
        name:"Issue Type",
        selector:(row)=>row.issue_type,
        
    },
    {
        name:"Description",
        selector:(row)=>row.description,
        
    },
    {
        name:"Status",
        selector:(row)=>row.status,
    },
 ]


  const [currentPage, setCurrentPage] = useState(1);
      const rowsPerPage = 6;
    
      const totalPages = Math.ceil(orderIssues.length / rowsPerPage);
    
      const paginatedData =orderIssues.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      )
 
  return (
    <div>
        <MainHeading
        title={"Order Management"}/>


        <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>

            <Heading
            title={"Order Details (#1021)"}/>

            <p className='text-xs font-medium mt-10'>Basic Info</p>
            {/* <hr className='w-full border border-(--input-border)'/> */}

            <div className='grid grid-cols-4 gap-5 mt-5 p-3 space-y-4'>
                <InputField
                label={"Order Id"}
                value={"1021"}
             
                />

                <InputField
                label={"Client Name"}
                value={"ABC Pharma "}
                />

                <InputField
                label={"Product"}
                value={"Face Serum"}/>

                <InputField
                label={"Order Quantity"}
                value={"1000 unit"}/>

                <InputField
                label={"Expected Dispatch Date"}
                value={"05/06/2026"}/>
            </div>
        </div>



        <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl  '>
            <Heading
            title={"Order Issues"}/>

           <CommonDataTable
 columns={columns}
data={paginatedData}
currentPage={currentPage}
totalPages={totalPages}
onPageChange={setCurrentPage}
 selectable={false} 

  
  />
        </div>


        <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl '>
            <Heading
            title={"Order Progress"}/>

            <OrderProgressBar    />

<div className='flex justify-center gap-3 mt-7'>
    <Button
    title={"Cancle Product"} 
    className='p-2 text-xs px-2 rounded-sm shadow-2xl'
    />

    <Button
    title={"Refund Product"}
    className='p-2 text-xs px-2 rounded-sm shadow-2xl bg-(--bs-icon)'
    />
</div>


        </div>
    </div>
  )
}

export default ViewOrdersDetails