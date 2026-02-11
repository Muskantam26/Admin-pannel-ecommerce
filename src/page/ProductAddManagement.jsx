import React, { useState } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import InputBox from '../Component/InputBox'
import Button from '../Component/Btn'
import { FaRegSave } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import Input from '../Inputs/Input';
import Textarea from '../Inputs/Textarea';
import Select from '../Inputs/Select';
import ImageUpload from '../Inputs/ImageUpload';
import { IoToggle } from "react-icons/io5";


const ProductAddManagement = () => {

 const [colors] = useState([
  "#22c55e",
  "#ef4444",
  "#3b82f6", 
  "#facc15", 
]);

const [selectedColor, setSelectedColor] = useState("");


     const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    taxIncluded: true,
    stockQty: "",
    stockStatus: "in_stock",
    featured: false,
    category: "",
    tag: "",
    images: [],
  });



   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  return (


    <div className='overflow-x-hidden'>
        <MainHeading
        title={"Product Management"}
        />

        <div className='md:flex  justify-between mt-5 '>
            <div><Heading
            title={"Add Product"}/>
            </div>

            <div className='md:flex sm:gap-2 md:gap-5 space-y-3'>
                <InputBox
                placeholder={"Search product for add"}
                classname='p-2'
                />

                <Button
                title={"Publish product"}
                className='p-2 text-xs rounded-sm hover:bg-(--bg-main) hover:text-(--text-second) hover:border hover:border-(--input-border)'
                /> 

                <button className='flex text-xs border border-(--input-border) rounded-sm items-center p-2 gap-1 hover:bg-(--bs-btn) hover:text-(--text-white) cursor-pointer'><FaRegSave size={22}/>Save To draft </button>

                <button className='cursor-pointer hover:text-(--text-second) text-(--text-main)'><GoPlusCircle size={30}/></button>
            </div>
        </div>



         <div className="md:flex gap-5 mt-5 items-start">



                {/* left side  */}

              <div className="col-span-2 bg-(--bg-box) p-6 rounded-xl w-[60%] space-y-5 border-2 border-(--input-border) shadow">
        <h2 className="text-lg font-semibold mb-4">Basic Details</h2>

        <Input
          label="Product Name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />

        <Textarea
          label="Product Description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <Heading
        title={"Pricing"}
        />

        <Input
          label="Product Price"
          name="price"
          value={product.price}
          onChange={handleChange}
        />


<div className='flex gap-4 items-center '>
        <Input
          label="Discounted Price (Optional)"
          name="discount"
          value={product.discount}
          onChange={handleChange}
          
        />

        <div className=" gap-6">
            <label className='text-xs font-medium text-gray-700'>Tax Included</label>
          <label className="flex gap-2 text-sm text-(--text-second)">
            <input
              type="radio"
              checked={product.taxIncluded}
              onChange={() =>
                setProduct((p) => ({ ...p, taxIncluded: true }))
              }
            />
            Yes
          </label>

          <label className="flex gap-2 text-(--text-second) text-sm">
            <input
              type="radio"
              className=''
              checked={!product.taxIncluded}
              onChange={() =>
                setProduct((p) => ({ ...p, taxIncluded: false }))
              }
            />
            No
          </label>
        </div>
        </div>


            
       <Heading
       title={"Inventory"}
       />
         
         <div className='flex gap-3' >
        <Input
          label="Stock Quantity"
          name="stockQty"
          value={product.stockQty}
          onChange={handleChange}
        />

        <Select
          label="Stock Status"
          name="stockStatus"
          value={product.stockStatus}
          onChange={handleChange}
          options={[
            { label: "In Stock", value: "in_stock" },
            { label: "Out of Stock", value: "out_stock" },
          ]}
        />

        </div>


      <label className='flex items-center gap-2' >
        <IoToggle color='green' size={35}/>
        Unlimited
        </label>

        <label className="flex gap-2 mt-4">
          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
          />
          Highlight this product in a featured section
        </label>

        <div className="flex gap-3 mt-6 justify-end-safe">
           <button className='flex text-xs border border-(--input-border) rounded-sm items-center p-2 gap-1 hover:bg-(--bs-btn) hover:text-(--text-white) cursor-pointer'><FaRegSave size={22}/>Save To draft </button>
          <Button
          title={"Publish Product"} 
          className='rounded-sm p-2 text-xs hover:bg-(--bg-main) hover:text-(--text-second) hover:border hover:border-(--input-border) '
          />


        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-(--bg-box)  shadow-2xl h-auto  p-6 rounded-xl w-[40%] space-y-5 border-2 border-(--input-border)">
       <Heading
       title={"  Upload Product Image"}
       />

       <ImageUpload
  images={product.images}
  setImages={(imgs) =>
    setProduct((p) => ({ ...p, images: imgs }))
  }
  selectedColor={selectedColor}
/>



        <Heading
        title={"Categories"}
        />

        <Select
          label="Product Categories"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={[
            { label: "Mobile", value: "mobile" },
            { label: "Laptop", value: "laptop" },
          ]}
        />

        <Select
          label="Product Tag"
          name="tag"
          value={product.tag}
          onChange={handleChange}
          options={[
            { label: "New", value: "new" },
            { label: "Featured", value: "featured" },
          ]}
        />


<label className="font-semibold text-sm text-(--text-second)">
  Select your colour
</label>

<div className="flex gap-4">
  {colors.map((color, index) => (
    <div
      key={index}
      onClick={() => setSelectedColor(color)}
      className={`h-10 w-10 rounded-full cursor-pointer border-2 
        ${selectedColor === color 
          ? "border-(--input-border) scale-110" 
          : "border-transparent"
        }`}
      style={{ backgroundColor: color }}
    />
  ))}
</div>


      </div>
      
      </div>

    </div>
  )
}

export default ProductAddManagement