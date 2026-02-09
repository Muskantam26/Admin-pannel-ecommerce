
import Button from "./Btn";
import SectionTitle from "./SectionTitle";
import SelectBox from "./SelectBox";
import UploadFile from "./UploadFile";

const Banner = ({
  title = "Banner One Image & Direction",
  previewImage,
  values,
  categories = [],
  brands = [],
  products = [],
  discounts = [],
}) => {
  return (
    <div className="
      grid 
      grid-cols-1 
      lg:grid-cols-2 
      gap-5 
      bg-(--bg-box) 
      p-5 
      rounded-2xl
    ">

      {/* LEFT IMAGE PREVIEW */}
      <div className="h-55 sm:h-70 ">
        <img
          src={previewImage}
          alt="Banner Preview"
          className="w-full h-full rounded-xl object-cover bg-contain"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="p-3 sm:p-6 rounded-2xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <SectionTitle title={title} />
          <Button title="Delete Slide"
          bg="bg-(--bs-btn-second)"
          className="text-[9px] p-1 px-4 rounded-sm shadow-6xl shadow-gray-400 "
          />
        </div>

        {/* FORM GRID */}
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-5
        ">

          {/* Upload Image */}
          <div className="md:col-span-1">
            <UploadFile label="Select Image" />
          </div>

          <SelectBox
            label="Select Category"
            options={categories}
            value={values.category}
          />

          <SelectBox
            label="Select Brand (Optional)"
            options={brands}
            value={values.brand}
          />

          <SelectBox
            label="Select Product (Optional)"
            options={products}
            value={values.product}
          />

          <SelectBox
            label="Select Discount (Optional)"
            options={discounts}
            value={values.discount}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
