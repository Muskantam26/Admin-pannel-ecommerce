import React, { useState } from "react";
import { Heading } from "../Component/Heading";
import { RxCrossCircled } from "react-icons/rx";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";

const AddMember = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    joiningDate: "",
    role: "",
  });

  const [permissions, setPermissions] = useState([
    { id: 1, label: "Email me when someone follows me", enabled: true },
    { id: 2, label: "Email me when someone answers on my post", enabled: false },
    { id: 3, label: "Email me when someone mentions me", enabled: true },
    { id: 4, label: "Email me when someone follows me", enabled: true },
    { id: 5, label: "Email me when someone answers on my post", enabled: false },
    { id: 6, label: "Email me when someone mentions me", enabled: true },
     { id: 7, label: "Email me when someone answers on my post", enabled: false },
    { id: 8, label: "Email me when someone mentions me", enabled: true },
    { id: 9, label: "Email me when someone follows me", enabled: true },
    { id: 10, label: "Email me when someone answers on my post", enabled: false },
    { id: 11, label: "Email me when someone mentions me", enabled: true },
  ]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 
  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };


  return (
    <div className="bg-(--bg-box) rounded-4xl shadow-2xl p-8 w-200 mx-auto ">
      
           

      {/* Header */}
      <div className="flex justify-between items-center mb-2 ">
        <div className="w-full text-center flex justify-center items-center">
          <Heading title={"Add Member"}
          
          />
        </div>

       

        <button onClick={onClose}>
          <RxCrossCircled
            className="bg-(--bs-btn-second) text-(--text-white) rounded-full cursor-pointer"
            size={28}
          />
        </button>
      </div>

         
      <div className="flex gap-10">
        
        {/* left side add member form*/}
        <div className="w-1/2 space-y-5 ">
          <InputField
            label="Name"
            value={formData.name}


            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter name"
          />

          <InputField
            label="Mobile"
            value={formData.mobile}
            

            onChange={(e) => handleChange("mobile", e.target.value)}
            placeholder="Enter mobile number"
          />

          <InputField
            label="Email"
            value={formData.email}
           

            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
          />

          <InputField
            label="Generate Password"
            value={formData.password}
          

            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Generate password"
          />

          <InputField
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            
            onChange={(e) => handleChange("joiningDate", e.target.value)}
          />

          <InputField
            label="Assign Role"
            value={formData.role}
         

            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Enter role"
          />
        </div>
                

        {/* right side  role Permission card  */}
        <div className="w-1/2 bg-(--card-box) rounded-4xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-6">Role Permission</h2>

          <div className="space-y-5">
            {permissions.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => togglePermission(item.id)}
              >
                {/* Toggle */}
                <div
                  className={`w-8 h-5 flex items-center rounded-full p-1 transition ${
                    item.enabled
                      ? "bg-(--btn-hover)"
                      : "bg-(--input-bg)"
                  }`}
                >
                  <div
                    className={`bg-white w-3 h-3 rounded-full shadow-md transform transition ${
                      item.enabled ? "translate-x-4" : ""
                    }`}
                  />
                </div>

                <p className="text-[10px] text-(--text-third)">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="flex justify-center gap-4 mt-10">
        <Button
        title={"Cancle"}
        className="p-1.5 px-5 text-sm rounded-sm shadow-2xl "
        />


        <Button
        title={"Create User"}
        className="bg-(--bs-btn-third) p-1.5 px-5 text-sm rounded-sm shadow-2xl"
        />
      </div>
    </div>
  );
};

export default AddMember;
