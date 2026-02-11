import React, { useState } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import SelectOption from '../Component/Selectoption';
import Button from '../Component/Btn';
import CommonDataTable from '../Component/CommonDataTable';
import { useNavigate } from "react-router-dom";

import { Eye, Pencil, Plus } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";


const ProductManagement = () => {

     const navigate = useNavigate();


    const [values, setValues] = useState({
  category: "",
  type: "",
  brand: "",
  name: "",
});

 const category = ["Electronics", "Fashion", "Furniture"];
 const type=["Mobile","TV","Laptop"];
 const brand=["Samsung","apple","Realme"];
 const name=["Galaxy s24 Ultra", "iPhone 17","Xiaomi hypercharge"]


 const productList=[
    {
        id:1, 
        sl:"01",
        image:"src/assets/pills.jpg",
        category:"Asthma",
        type:"Pill",
        brand:"Apack Solution",
        product_name:"Dumo",
        product_id:"A15PM",
        unit:"Quantity(q)",
        varient:"1",
        color:"Red",
        Price:"1,00,000",
    },
    {
             id:2,
             sl:"02",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },

     {
             id:3,
             sl:"03",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },

     {
             id:4,
             sl:"04",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
     {
             id:5,
             sl:"05",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
     {
             id:6,
             sl:"06",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
     {
             id:7,
             sl:"07",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
     {
             id:8,
             sl:"08",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
     {
             id:9,
             sl:"09",
             image:"src/assets/pills.jpg",
             category:"Asthma",
             type:"Pill",
             brand:"Apack Solution",
             product_name:"Dumo",
             product_id:"A15PM",
             unit:"Quantity(q)",
             varient:"1",
             color:"Grreen",
             Price:"2,00,000"
    },
 ]

  const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 10;
 
   const totalPages = Math.ceil(productList.length / rowsPerPage);
 
   const paginatedData = productList.slice(
     (currentPage - 1) * rowsPerPage,
     currentPage * rowsPerPage,
   );



   const columns = [
    {
      name: "SL",
      selector: (row) => row.sl,
      sortable: true,
      
    },
    {
  name: "Image",
  cell: (row) => (
    <img
      src={row.image}
      alt="product"
      className="w-9 h-9 object-cover rounded-md "
    />
  ),
},

    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
    },
    {
      name: "Product Name",
      selector: (row) => row.product_name,
    },
    {
      name: "Product ID",
      cell: (row) => row.product_id ,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
    },
    {
        name:"Varient",
        selector:(row)=>row.varient,
    },
    {
        name:"Color",
        selector:(row)=>row.color,
    },
    {
        name:"Price(Rs)",
        selector:(row)=>row.Price,
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-(--icon-btn) text-(--icon-btn-text)"   onClick={() => navigate(`/product/view`)}>
            <Eye size={10} />

          </button>
          <button className="p-2 rounded-lg bg-(--icon-btn-second) text-(--icon-text-second)" onClick={()=>navigate(`/product/edit`)}>
            <Pencil size={10} />
          </button>
          <button className="p-2 rounded-lg bg-(--bs-btn-second) text-(--text-white) ">
            <RiDeleteBin6Line size={10} />
          </button>
        </div>
      ),
    },
  ];


 
  return (

    <div>

        <div className='flex  items-center justify-between '>
            <div>
             <MainHeading
        title={"Product Management"}
        subtitle={"Real-time overview of orders, payments, customers & operations"}
        />
        </div>

{/* 
        <div className= ' flex gap-5'>
            <Button
            title={"Edit Products"} 
            bg='bg-(--bg-btn)'
            text='text-(--text-main)'
            className='p-1 px-5 rounded-sm text-xs'
            />

            <Button
            title={"Add Type"}
             bg='bg-(--bg-btn)'
            text='text-(--text-main)'
            className='p-1 px-5 rounded-sm text-xs'
            />

            <Button
            title={"Add Product"}
             bg='bg-(--bg-btn)'
            text='text-(--text-main)'
            className='p-1 px-5 rounded-sm text-xs'
            />

            <Button
            title={"Add Category"}
             bg='bg-(--bg-btn)'
            text='text-(--text-main)'
            className='p-1 px-5 rounded-sm text-xs'
            />

            <Button
            title={"Add Brand"}
             bg='bg-(--bg-btn)'
            text='text-(--text-main)'
            className='p-1 px-5 rounded-sm text-xs'
            />
        </div> */}
        </div>
       

        <div className='bg-(--bg-box) rounded-xl shadow-xl p-4 mt-5'>
       <Heading
       title={"Create Products - Category / Type / Brand / Name"}
    
       />

      


      <div className='grid grid-cols-4 gap-3 mt-5'> 
        <SelectOption
  label="Product Category"
  options={category}
  value={values.category}
  onChange={(val) =>
    setValues({ ...values, category: val })
  }
/>

 <SelectOption
  label="Product Type"
  options={type}
  value={values.type}
  onChange={(val) =>
    setValues({ ...values, type: val })
  }
/>

 <SelectOption
  label="Brand"
  options={brand}
  value={values.brand}
  onChange={(val) =>
    setValues({ ...values, brand: val })
  }
/>

 <SelectOption
  label="Product Name"
  options={name}
  value={values.name}
  onChange={(val) =>
    setValues({ ...values, name: val })
  }
/>


      </div>
     
        <div className='flex justify-end-safe mt-5'>
 <Button
 title={" + Add Product"}


 className='p-2 text-xs rounded-sm'
 />
 </div>
 

        <div className='flex items-center justify-center gap-3 mt-5'>


            <div>
<Button
title={"Reset"}
className='text-xs p-2 px-7 rounded-sm'
/>
</div>


<div>
<Button
title={"Save Product"}
className='text-xs bg-(--bs-btn-third) p-2 px-5 rounded-sm'
/>
</div>
</div>
        </div>
      
<div className="bg-(--bg-box) shadow-2xl rounded-xl p-5 mt-5">
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

export default ProductManagement