/* eslint-disable react/prop-types */
import { RxCrossCircled } from "react-icons/rx";
import { useState, useEffect } from "react";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";
import CustomSelect from "../Component/Inputs/CustomSelect";
import { FiPlus, FiArrowLeft, FiCheck } from "react-icons/fi";

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
    <div className="pb-10 relative bg-(--bg-main) animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-box)] rounded-lg transition-colors text-(--text-second) border border-transparent hover:border-[var(--bs-border)] cursor-pointer">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-(--text-main)">{initialData ? "Edit Package" : "Add New Package"}</h1>
            <p className="text-(--text-second) text-sm mt-0.5">Manage package details, pricing, and benefits.</p>
          </div>
        </div>
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text-main)]">Basic Information</h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-[var(--bs-primary)]/10 text-[var(--bs-primary)] rounded-full border border-[var(--bs-primary)]/20">Required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Package Name"
                  placeholder="e.g. Diamond, Gold"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Limits */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Pricing & Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Price (₹)"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <InputField
                label="MRP (₹)"
                type="number"
                placeholder="0.00"
                value={formData.mrp}
                onChange={e => setFormData({ ...formData, mrp: e.target.value })}
              />
              <div className="md:col-span-2 pt-4 border-t border-[var(--bs-border)]">
                <label className="text-sm text-(--text-second) font-medium mb-3 block">Package Limits & Values</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="Point Value (PV)"
                    type="number"
                    placeholder="e.g. 15"
                    value={formData.pv}
                    onChange={e => setFormData({ ...formData, pv: e.target.value })}
                  />
                  <InputField
                    label="C.T.O Limit"
                    placeholder="e.g. 1 Lakh"
                    value={formData.cto}
                    onChange={e => setFormData({ ...formData, cto: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="space-y-8">

          {/* Theme / Appearance */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Appearance</h2>
            <div className="space-y-4">
              <CustomSelect
                label="Card Theme"
                name="theme"
                value={formData.theme}
                onChange={e => setFormData({ ...formData, theme: e.target.value })}
                options={[
                  { label: "Light Theme (Standard)", value: "light" },
                  { label: "Dark Theme (Premium)", value: "dark" }
                ]}
                searchable={false}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Package Benefits</h2>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4 items-start">
                <div className="flex-1">
                  <InputField
                    value={benefitInput}
                    onChange={e => setBenefitInput(e.target.value)}
                    placeholder="e.g. Priority Support"
                  />
                </div>
                <button onClick={addBenefit} className="px-3 py-2.5 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--btn-hover)] transition cursor-pointer text-sm font-medium"><FiPlus /></button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.benefits.map((b, i) => (
                  <div key={i} className="flex justify-between items-center bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--bs-border)] shadow-sm">
                    <span className="text-sm text-[var(--text-main)] flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[var(--bs-primary)]"></div>
                       {b}
                    </span>
                    <button onClick={() => removeBenefit(i)} className="text-[var(--icon-color)] hover:text-red-500 p-1 rounded-full transition-colors cursor-pointer">
                      <RxCrossCircled size={18} />
                    </button>
                  </div>
                ))}
                {formData.benefits.length === 0 && (
                  <div className="text-center py-6 text-[var(--text-second)] text-sm italic border-2 border-dashed border-[var(--bs-border)] rounded-lg">
                    No benefits added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
          

        </div>
        
      </div>
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <Button
            onClick={onClose}
            bg="bg-transparent"
            text="text-[var(--text-main)]"
            className="flex-1 md:flex-none px-4 py-2 border border-[var(--bs-border)] rounded-lg hover:bg-(--bs-btn) hover:text-(--text-white) font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 md:flex-none px-6 py-2 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
          >
            <FiCheck /> Save Package
          </Button>
        </div>
    </div>
  );
};

export default AddNewPackage;
