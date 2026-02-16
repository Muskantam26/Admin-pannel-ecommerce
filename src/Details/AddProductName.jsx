import React, { useState } from "react";

import { RxCrossCircled } from "react-icons/rx";
import Modal from "../Model/Modal";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";

const AddProductName = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [project, setProject] = useState(null);

  const handleSubmit = () => {
    const payload = {
      name,
      project,
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
          Add Product 
        </h2>

        {/* Input */}
        <div className="mb-4">
         <InputField
          label={"Product Name"}
          value={name}
          placeholder="Enter Product Name"
           onChange={(e) => setName(e.target.value)}
           defaultValue="Galaxy S22 Ulrta"
           />

        </div>

        {/* Create Project Box */}
        <div
          onClick={() => setProject("New Project")}
          className="border-2 border-(--bs-purple) rounded-xl py-10 text-center cursor-pointer hover:bg-purple-50"
        >
          <p className="text-3xl text-(--bs-purple)">+</p>
          <p className="text-(--bs-purple) font-medium mt-2">
            Create a New Project
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
         
            <Button
        title={"Cancle"}
        onClick={onClose}
        className="p-2 px-5 text-sm rounded-sm shadow-2xl "
        />


        <Button
        title={"Save Category"}
        onClick={handleSubmit}
        className="bg-(--bs-btn-third) p-2 px-5 text-sm rounded-sm shadow-2xl"
        />
        </div>

      </div>
    </Modal>
  );
};

export default AddProductName;
