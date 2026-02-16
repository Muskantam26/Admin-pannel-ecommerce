import { RxCrossCircled } from "react-icons/rx";
import Button from "../Component/Btn";
import { Heading } from "../Component/Heading";
import { InputField } from "../Component/InputBox";
import { useState } from "react";

const AddProduct = ({ onClose, onSaveClick }) => {

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    colors: [],
    sizes: [],
    keyFeatures: [],
    specifications: []
  });

  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const [sizeInput, setSizeInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [specInput, setSpecInput] = useState({ label: "", value: "" });

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImgs = files.map((file, index) => ({
      id: Date.now() + index,
      src: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImgs]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  /* ---------------- COLOR ---------------- */

  const addColor = () => {
    if (!colorInput.name) return;
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, colorInput]
    }));
    setColorInput({ name: "", hex: "#000000" });
  };

  /* ---------------- SIZE ---------------- */

  const addSize = () => {
    if (!sizeInput) return;
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, sizeInput]
    }));
    setSizeInput("");
  };

  /* ---------------- FEATURE ---------------- */

  const addFeature = () => {
    if (!featureInput) return;
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, featureInput]
    }));
    setFeatureInput("");
  };

  /* ---------------- SPEC ---------------- */

  const addSpec = () => {
    if (!specInput.label || !specInput.value) return;
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, specInput]
    }));
    setSpecInput({ label: "", value: "" });
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    const newProduct = {
      ...formData,
      images
    };
    console.log("NEW PRODUCT:", newProduct);
    onSaveClick(newProduct);
  };

  return (
    <div className="rounded-xl shadow-2xl mt-5 bg-(--bg-box) p-5 space-y-5">

      <div className="flex justify-between">
        <Heading title={"Add Product"} />
      </div>

      {/* Existing Inputs */}
      <div className="grid grid-cols-4 gap-4 mt-5">
        <InputField label={"Select Product Category"} />
        <InputField label={"Select Product Type"} />
        <InputField label={"Select Brand"} />
        <InputField label={"Product Name or Model"} />
        <InputField label={"Product ID"} />
        <InputField label={"Product Price"} />
        <InputField label={"Product Material"} />
        <InputField label={"Discount"} />
        <InputField label={"GST in Percentage"} />
        <InputField label={"GST in Amount"} />
        <InputField label={"Manufacturer by"} />
      </div>

      {/* DESCRIPTION */}

      
      <Heading title={"Detailed Description"} titleSize="text-xs" />
      <textarea rows={3} className="w-full border rounded-md p-2 text-xs"/>

      {/* COLORS */}
      <Heading title={"Product Colors"} titleSize="text-xs" />
      <div className="flex gap-2">
        <input
          placeholder="Color Name"
          value={colorInput.name}
          onChange={e=>setColorInput({...colorInput,name:e.target.value})}
          className="border p-2 text-xs"
        />
        <input
          type="color"
          value={colorInput.hex}
          onChange={e=>setColorInput({...colorInput,hex:e.target.value})}
         
           className="rounded-2xl"

        />
        <Button title="Add" onClick={addColor}
        className="p-1 px-6 rounded-sm"
        />
      </div>

      <div className="flex gap-2">
        {formData.colors.map((c,i)=>(
          <div key={i} className="flex items-center gap-1 text-xs">
            <span style={{background:c.hex}} className="w-4 h-4 rounded-full"/>
            {c.name}
          </div>
        ))}
      </div>

      {/* SIZES */}
      <Heading title={"Sizes"} titleSize="text-xs" />
      <div className="flex gap-2">
        <input
          value={sizeInput}
          onChange={e=>setSizeInput(e.target.value)}
          className="border p-2 text-xs"
          placeholder="S, M, L"
        />
        <Button title="Add" onClick={addSize}
         className="p-1 px-6 rounded-sm"/>
      </div>

      <div className="flex gap-2">
        {formData.sizes.map((s,i)=>(
          <span key={i} className="px-2 py-1 bg-gray-200 rounded text-xs">{s}</span>
        ))}
      </div>

      {/* FEATURES */}
      <Heading title={"Key Features"} titleSize="text-xs" />
      <div className="flex gap-2">
        <input
          value={featureInput}
          onChange={e=>setFeatureInput(e.target.value)}
          className="border p-2 text-xs w-full"
          placeholder="Feature"
        />
        <Button title="Add" onClick={addFeature}
         className="p-1 px-6 rounded-sm"/>
      </div>

      <ul className="text-xs list-disc ml-4">
        {formData.keyFeatures.map((f,i)=>(<li key={i}>{f}</li>))}
      </ul>

      {/* SPECIFICATIONS */}
      <Heading title={"Specifications"} titleSize="text-xs" />
      <div className="flex gap-2">
        <input
          placeholder="Label"
          value={specInput.label}
          onChange={e=>setSpecInput({...specInput,label:e.target.value})}
          className="border p-2 text-xs"
        />
        <input
          placeholder="Value"
          value={specInput.value}
          onChange={e=>setSpecInput({...specInput,value:e.target.value})}
          className="border p-2 text-xs"
        />
        <Button title="Add" onClick={addSpec}
         className="p-1 px-6 rounded-sm"/>
      </div>

      <ul className="text-xs">
        {formData.specifications.map((s,i)=>(
          <li key={i}>{s.label}: {s.value}</li>
        ))}
      </ul>

      {/* IMAGE UPLOAD */}
      <Heading title={"Product Images"} titleSize="text-xs" />
      <input type="file" multiple onChange={handleImageUpload} />

      <div className="grid grid-cols-4 gap-5 mt-3">
        {images.map((item) => (
          <div key={item.id} className="relative">
            <img src={item.src} alt="product" className="rounded-2xl w-full h-full object-cover"/>
            <RxCrossCircled
              size={20}
              onClick={() => removeImage(item.id)}
              className="absolute top-2 right-2 cursor-pointer bg-(--bs-btn-second) text-white rounded-full"
            />
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 items-center justify-center mt-10">
        <Button title={"Cancel"} onClick={onClose}/>
        <Button title={"Add Product"} className="bg-(--bs-btn-third)" onClick={handleSave}/>
      </div>

    </div>
  );
};

export default AddProduct;
