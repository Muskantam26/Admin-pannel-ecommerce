/* eslint-disable react/prop-types */
import { RxCrossCircled } from "react-icons/rx";
import { useState, useEffect } from "react";
import Button from "../Component/Btn";
import { Heading } from "../Component/Heading";
import { InputField } from "../Component/InputBox";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const AddNewPackage = ({ onClose, onSaveClick, initialData }) => {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    cto: "",
    pv: "",
    theme: "light",
    benefits: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        mrp: initialData.mrp || "",
        cto: initialData.cto || "",
        pv: initialData.pv || "",
        theme: initialData.theme || "light",
        benefits: initialData.benefits || []
      });
    }
  }, [initialData]);

  const [benefitInput, setBenefitInput] = useState("");

  /* ---------------- BENEFITS ---------------- */

  const addBenefit = () => {
    if (!benefitInput) return;
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, benefitInput]
    }));
    setBenefitInput("");
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    console.log("NEW PACKAGE:", formData);
    onSaveClick(formData);
  };

  return (
    <div className="rounded-xl shadow-lg mt-5 bg-white p-6 space-y-8 animate-fade-in-up">

      <div className="flex justify-between items-center border-b pb-4 border-gray-100">
        <Heading title={"Add New Package"} className="text-2xl font-bold text-gray-800" />
        <button onClick={onClose} className="p-2 hover:bg-(--bs-btn-second) hover:text-(--text-white) rounded-full transition-colors cursor-pointer">
          <RxCrossCircled size={24} className="text-(--text-white) bg-(--bs-btn-second) rounded-full cursor-pointer" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT COLUMN - BASIC INFO & PRICING */}
        <div className="space-y-6">

          {/* Section 1: Basic Information */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Package Information</h3>
            <div className="space-y-4">
              <InputField
                label={"Package Name"}
                placeholder="e.g. Diamond, Gold"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Theme</label>
                <select
                  value={formData.theme}
                  onChange={e => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme (Special)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Values */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Pricing & Values</h3>
            <div className="grid grid-cols-2 gap-5">
              <InputField
                label={"Price (₹)"}
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <InputField
                label={"MRP (₹)"}
                type="number"
                placeholder="0.00"
                value={formData.mrp}
                onChange={e => setFormData({ ...formData, mrp: e.target.value })}
              />
              <InputField
                label={"C.T.O Limit"}
                placeholder="e.g. 1 Lakh"
                value={formData.cto}
                onChange={e => setFormData({ ...formData, cto: e.target.value })}
              />
              <InputField
                label={"Point Value (PV)"}
                type="number"
                placeholder="e.g. 15"
                value={formData.pv}
                onChange={e => setFormData({ ...formData, pv: e.target.value })}
              />
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN - BENEFITS */}
        <div className="space-y-6">

          {/* Section 3: Benefits */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Package Benefits</h3>
            <div className="flex gap-2 mb-4">
              <input
                value={benefitInput}
                onChange={e => setBenefitInput(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a benefit (e.g. Priority Support)"
              />
              <button onClick={addBenefit} className="bg-(--bs-btn) text-white p-2 px-4 rounded-lg hover:bg-blue-700 font-medium cursor-pointer">Add</button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {formData.benefits.map((b, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-sm text-gray-700 font-medium">{b}</span>
                  <button onClick={() => removeBenefit(i)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.benefits.length === 0 && (
                <div className="text-center py-8 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-lg">
                  No benefits added yet.
                </div>
              )}
            </div>
          </section>

        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex gap-4 items-center justify-end pt-6 border-t border-gray-100">
        <Button
          title={"Cancel"}
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg border border-gray-300 bg-(--bs-btn-second) text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        />
        <Button
          title={"Save Package"}
          className="px-8 py-2.5 rounded-lg bg-(--bs-btn) text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 font-medium transition-all transform hover:-translate-y-0.5 cursor-pointer"
          onClick={handleSave}
        />
      </div>

    </div>
  );
};

export default AddNewPackage;
