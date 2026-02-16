import React, { useState } from "react";

import { RxCrossCircled } from "react-icons/rx";
import Modal from "../Model/Modal";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";

const AddProductType = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState("");
 

  const handleSubmit = () => {
    const payload = {
      type,
    
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
          Add Product Type
        </h2>

        {/* Input */}
        <div className="mb-4">
         <InputField
          label={"Product Type"}
          value={type}
          placeholder="Enter Product Type"
           onChange={(e) => setType(e.target.value)}
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
        title={"Save Type"}
        onClick={handleSubmit}
        className="bg-(--bs-btn-third) p-2 px-5 text-sm rounded-sm shadow-2xl"
        />
        </div>

      </div>
    </Modal>
  );
};

export default AddProductType;
