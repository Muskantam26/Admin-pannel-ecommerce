import React, { useState } from "react";
import { Heading } from "../Component/Heading";
import { RxCrossCircled } from "react-icons/rx";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";
import { FiLock } from "react-icons/fi";

const AddMember = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    joiningDate: "",
    role: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    handleChange("password", randomPassword);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden animate-fade-in-up">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <Heading title={"Add New Member"} className="text-xl font-bold text-gray-800" />
        <button 
          onClick={onClose}
          className="p-2 hover:bg-(--bs-btn-second) rounded-full transition-colors text-(--text-white) bg-(--bs-btn-second) cursor-pointer"
        >
          <RxCrossCircled size={24} />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <InputField
            label="Mobile Number"
            placeholder="e.g. +91 9876543210"
            value={formData.mobile}
             type="tel"
            onChange={(e) => handleChange("mobile", e.target.value)}
          />

          <InputField
            label="Email Address"
            placeholder="john@example.com"
            value={formData.email}
            type="email"
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <div className="relative">
             <InputField
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              type="text"
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button 
              onClick={generatePassword}
              className="absolute top-[34px] right-3 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
              type="button"
            >
              Generate
            </button>
          </div>

          <InputField
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => handleChange("joiningDate", e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Assign Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full border border-(--bs-border) rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-(--bg-box)"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 p-6 border-t border-(--bs-border) bg-(--bg-main)">
        <Button
          title={"Cancel"}
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg border border-gray-300 bg-(--bs-btn-second) text-(--text-white) font-medium transition-colors shadow-sm transition-all transform hover:-translate-y-0.5"
        />
        <Button
          title={"Create Member"}
          className="px-6 py-2.5 rounded-lg bg-(--bs-btn) text-(--text-white) font-medium shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
        />
      </div>
    </div>
  );
};
 
export default AddMember;
