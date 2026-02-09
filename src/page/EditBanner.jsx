import React, { useState } from "react";
import Banner from "../Component/Banner";
import { MainHeading } from "../Component/Heading";
import Button from "../Component/Btn";


const EditBanner = () => {


  const categories = ["Category 1", "Category 2"];
  const brands = ["Brand 1", "Brand 2"];
  const products = ["Product 1", "Product 2"];
  const discounts = ["10%", "20%", "30%"];

  
  const [banners] = useState([
    {
      id: 1,
      title: "Banner One Image & Direction",
      previewImage: "src/assets/Bannerone.png",
      form: {
        category: "",
        brand: "",
        product: "",
        discount: "",
        image: null,
      },
    },
    {
      id: 2,
      title: "Banner Two Image & Direction",
      previewImage: "src/assets/BannerTwo.png",
      form: {
        category: "",
        brand: "",
        product: "",
        discount: "",
        image: null,
      },
    },
    {
      id: 3,
      title: "Banner Three Image & Direction",
      previewImage: "src/assets/Bannerthree.jpg",
      form: {
        category: "",
        brand: "",
        product: "",
        discount: "",
        image: null,
      },
    },
    {
      id: 4,
      title: "Banner Four Image & Direction",
      previewImage: "src/assets/BannerFour.png",
      form: {
        category: "",
        brand: "",
        product: "",
        discount: "",
        image: null,
      },
    },
  ]);

  
  return (
    <div>
      <MainHeading
        title="Banner Management"
        subtitle="Real-time overview of orders, payments, customers & operations"
      />

      <div className="bg-(--bg-box) mt-6 rounded-xl space-y-6 ">
        {banners.map((item) => (
          <Banner
            key={item.id}
            id={item.id}
            title={item.title}
            previewImage={item.previewImage}
            values={item.form}
            categories={categories}
            brands={brands}
            products={products}
            discounts={discounts}
          
          />
        ))}
<div className="flex  justify-center gap-5 ">
        <Button
        title={"Add More Slide"}
        className="text-xs rounded-sm p-2 px-3 shadow-2xl"
        />

<Button

title={"Save Banner"}
bg="bg-(--bs-btn-third) text-xs rounded-sm  p-2 px-5 shadow-2xl"
className=""
/>

      </div> 
      </div>

     
    </div>
  );
};

export default EditBanner;
