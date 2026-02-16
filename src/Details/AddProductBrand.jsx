import React, { useState } from "react";

import { RxCrossCircled } from "react-icons/rx";
import Modal from "../Model/Modal";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";

const AddProductBrand = ({ isOpen, onClose, onSave }) => {
  const [brand, setBrand] = useState("");
 

  const handleSubmit = () => {
    const payload = {
      brand,
    
    };

    console.log(payload);

    if (onSave) {
      onSave(payload);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white bg-red-500 rounded-full text-xl cursor-pointer"
        >
          <RxCrossCircled />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">
          Add Product Brand
        </h2>

        {/* Input */}
        <div className="mb-4">
         <InputField
          label={"Product Brand"}
          value={brand}
          placeholder="Enter Product Type"
           onChange={(e) => setBrand(e.target.value)}
           defaultValue="Galaxy S22 Ulrta"
           />

        </div>

       
        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
        
            <Button
        title={"Cancle"}
        onClick={onClose}
        className="p-2 px-5 text-sm rounded-sm shadow-2xl "
        />


        <Button
        title={"Save Brand"}
        onClick={handleSubmit}
        className="bg-(--bs-btn-third) p-2 px-5 text-sm rounded-sm shadow-2xl"
        />
        </div>

      </div>
    </Modal>
  );
};

export default AddProductBrand;
