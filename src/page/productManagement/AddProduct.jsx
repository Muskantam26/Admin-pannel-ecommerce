import { RxCrossCircled } from "react-icons/rx";
import { useState } from "react";
import Button from "../../Component/Btn";
import { Heading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import { FiUploadCloud, FiPlus, FiTrash2 } from "react-icons/fi";

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
  
  const removeColor = (index) => {
    setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
    }));
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

    const removeSize = (index) => {
    setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
    }));
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

    const removeFeature = (index) => {
    setFormData(prev => ({
        ...prev,
        keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
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
  
  const removeSpec = (index) => {
      setFormData(prev => ({
        ...prev,
        specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  }

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
    <div className="rounded-xl shadow-lg mt-5 bg-white p-6 space-y-8 animate-fade-in-up">

      <div className="flex justify-between items-center border-b pb-4 border-gray-100">
        <Heading title={"Add New Product"} className="text-2xl font-bold text-gray-800" />
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <RxCrossCircled size={24} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - BASIC INFO */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Basic Information */}
            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label={"Product Category"} placeholder="Select Category" />
                    <InputField label={"Product Type"} placeholder="Select Type" />
                    <InputField label={"Brand"} placeholder="Select Brand" />
                    <InputField label={"Product Name"} placeholder="Enter Product Name" />
                    <InputField label={"Product ID"} placeholder="Generate or Enter ID" />
                    <InputField label={"Manufacturer"} placeholder="Manufacturer Name" />
                </div>
            </section>

             {/* Section 2: Pricing & Finance */}
             <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Pricing & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label={"Price (₹)"} type="number" placeholder="0.00" />
                    <InputField label={"Discount (%)"} type="number" placeholder="0" />
                    <InputField label={"GST (%)"} type="number" placeholder="18" />
                    <InputField label={"GST Amount (₹)"} type="number" placeholder="Auto-calculated" disabled />
                    <InputField label={"Material"} placeholder="e.g. Cotton, Steel" />
                </div>
            </section>

            {/* Section 3: Description */}
             <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Description</h3>
                <textarea 
                    rows={4} 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Provide a detailed description of the product..."
                />
            </section>

             {/* Section 4: Specifications */}
             <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Technical Specifications</h3>
                <div className="flex gap-3 mb-4">
                    <input
                        placeholder="Label (e.g. Battery)"
                        value={specInput.label}
                        onChange={e=>setSpecInput({...specInput,label:e.target.value})}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        placeholder="Value (e.g. 5000mAh)"
                        value={specInput.value}
                        onChange={e=>setSpecInput({...specInput,value:e.target.value})}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={addSpec}
                        className="bg-(--bs-btn) text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add
                    </button>
                </div>
                <ul className="space-y-2">
                    {formData.specifications.map((s,i)=>(
                        <li key={i} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                            <span className="font-medium text-gray-700">{s.label}: <span className="font-normal text-gray-600">{s.value}</span></span>
                            <button onClick={()=>removeSpec(i)} className="text-red-500 hover:text-red-700"><FiTrash2 size={14}/></button>
                        </li>
                    ))}
                    {formData.specifications.length === 0 && <p className="text-xs text-gray-400 italic">No specifications added yet.</p>}
                </ul>
            </section>

        </div>

        {/* RIGHT COLUMN - VARIANTS & MEDIA */}
        <div className="space-y-6">

             {/* Section 5: Variants (Color & Size) */}
             <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-6">
                
                {/* Colors */}
                <div>
                     <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Colors</h3>
                     <div className="flex gap-2 mb-3">
                        <input
                            placeholder="Color Name"
                            value={colorInput.name}
                            onChange={e=>setColorInput({...colorInput,name:e.target.value})}
                            className="flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-gray-300 cursor-pointer">
                             <input
                                type="color"
                                value={colorInput.hex}
                                onChange={e=>setColorInput({...colorInput,hex:e.target.value})}
                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                            />
                        </div>
                       
                        <button onClick={addColor} className="bg-(--bs-btn) text-white p-2 px-4 rounded-lg hover:bg-blue-700">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.colors.map((c,i)=>(
                        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs shadow-sm">
                            <span style={{background:c.hex}} className="w-3 h-3 rounded-full border border-gray-100"/>
                            <span className="font-medium">{c.name}</span>
                            <button onClick={()=>removeColor(i)} className="ml-1 text-gray-400 hover:text-red-500"><RxCrossCircled/></button>
                        </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-200" />

                 {/* Sizes */}
                 <div>
                     <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Sizes</h3>
                     <div className="flex gap-2 mb-3">
                        <input
                            value={sizeInput}
                            onChange={e=>setSizeInput(e.target.value)}
                            className="flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="S, M, L, XL"
                        />
                        <button onClick={addSize} className="bg-(--bs-btn) text-white p-2 px-4 rounded-lg hover:bg-blue-700">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((s,i)=>(
                            <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold shadow-sm">
                                {s}
                                <button onClick={()=>removeSize(i)} className="ml-1 text-gray-400 hover:text-red-500"><RxCrossCircled/></button>
                            </div>
                        ))}
                    </div>
                 </div>

             </section>

             {/* Section 6: Key Features */}
            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Key Features</h3>
                 <div className="flex gap-2 mb-3">
                    <input
                        value={featureInput}
                        onChange={e=>setFeatureInput(e.target.value)}
                        className="flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a consolidated feature"
                    />
                    <button onClick={addFeature} className="bg-(--bs-btn) text-white p-2 px-4 rounded-lg hover:bg-blue-700">Add</button>
                </div>
                <ul className="space-y-2">
                     {formData.keyFeatures.map((f,i)=>(
                        <li key={i} className="flex justify-between items-start bg-white p-2 rounded border text-xs">
                           <span className="flex-1">{f}</span>
                           <button onClick={()=>removeFeature(i)} className="text-gray-400 hover:text-red-500 ml-2 mt-0.5"><RxCrossCircled/></button>
                        </li>
                     ))}
                </ul>
            </section>

            {/* Section 7: Media */}
            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Product Images</h3>
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                </label>

                <div className="grid grid-cols-3 gap-3 mt-4">
                    {images.map((item) => (
                    <div key={item.id} className="relative group">
                        <img src={item.src} alt="product" className="rounded-lg w-full h-20 object-cover border border-gray-200 shadow-sm"/>
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removeImage(item.id)} className="text-white bg-red-500 p-1.5 rounded-full hover:bg-red-600">
                                <FiTrash2 size={14} />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </section>

        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex gap-4 items-center justify-end pt-6 border-t border-gray-100">
        <Button 
            title={"Cancel"} 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-lg border border-gray-300  bg-(--bs-btn-second) transition-all transform hover:-translate-y-0.5 font-medium transition-colors"
        />
        <Button 
            title={"Save Product"} 
            className="px-8 py-2.5 rounded-lg   shadow-lg shadow-blue-500/30 font-medium transition-all transform hover:-translate-y-0.5" 
            onClick={handleSave}
        />
      </div>

    </div>
  );
};

export default AddProduct;
