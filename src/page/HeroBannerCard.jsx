import React from "react";
import Slider from "react-slick";
import { RxCrossCircled } from "react-icons/rx";
import Button from "../Component/Btn";


const HeroBannerCard = ({ bannerDetails = {}, onClose }) => {
  const {
    name,
    type,
    imageCount,
    lastUpdate,
    status,
    platform,
    images = [],  
  } = bannerDetails;

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        
    autoplaySpeed: 1000,
    pauseOnHover: false,
    arrows: false,
  };

 return (
  <div className="bg-(--bg-box) rounded-2xl p-2 flex flex-col lg:flex-row gap-4 relative mt-10">

    {/* Close button */}
   

    {/* Slider */}
    <div className="w-full lg:w-[72%] rounded-2xl mt-2 h-56 sm:h-64 lg:h-80">
      <Slider {...sliderSettings}>
        {images?.length &&
          images.map((img, index) => (
            <div key={index} className="h-56 sm:h-64 lg:h-80">
              <img
                src={img}
                alt={`Banner ${index}`}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
          ))}
      </Slider>
    </div>

    {/* Right content */}
    <div className="flex flex-col justify-between p-3 sm:p-5 w-full">
       <button
      className="absolute md:top-3 right-3 text-(--bs-btn-second)"
      onClick={onClose}
    >
      <RxCrossCircled
        className="bg-(--bs-btn-second) text-(--text-white) rounded-2xl"
        size={20}
      />
    </button>
      <div>
        <h2 className="text-(--bs-purple) font-semibold text-base sm:text-lg">
          Hero Banner (User Panel)
        </h2>

        <h3 className="font-semibold mt-2 text-sm sm:text-base">
          Current Active Banners Details
        </h3>

        <div className="text-xs text-(--text-second) mt-3 space-y-3">
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Banner Name:</span>
            {name}
          </p>
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Banner Type:</span>
            {type}
          </p>
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Image Count:</span>
            {imageCount}
          </p>
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Last Update:</span>
            {lastUpdate}
          </p>
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Status:</span>
            {status}
          </p>
          <p className="text-(--text-main) font-semibold flex justify-between">
            <span className="font-medium text-(--text-second)">Platform:</span>
            {platform}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 space-y-2 ">
        <Button
          title="Add More Slider"
          bg="bg-(--bs-black)"
          text="text-(--text-white)"
          className="rounded-sm p-1.5 text-xs w-full sm:w-64 shadow-4xl"
        />

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            title="Edit"
            bg="bg-(--bs-btn-third)"
            className="rounded-sm p-1.5 shadow-5xl text-xs px-7"
          />
          <Button
            title="Pause"
            bg="bg-(--bs-btn-forth)"
            className="rounded-sm p-1.5 shadow-5xl text-xs px-6"
          />
          <Button
            title="Delete Slide"
            bg="bg-(--bs-btn-second)"
            className="rounded-sm p-1.5 shadow-5xl text-xs"
          />
        </div>
      </div>
    </div>
  </div>
);
}

export default HeroBannerCard;
