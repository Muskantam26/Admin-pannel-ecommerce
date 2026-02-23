import React, { useState, useEffect } from "react";
import { RxCrossCircled, RxCheck } from "react-icons/rx";
import Button from "../../Component/Btn";
import { Heading, MainHeading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import { FiUploadCloud, FiTrash2, FiSave, FiPlus, FiArrowLeft, FiCheck } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createProductApi, getProductByIdApi, updateProductApi, deleteProductApi } from "../../api/product-api";
import { getAllPackagesApi } from "../../api/package-api";
import { getAllCategoryApi } from "../../api/category-api";
import MultiImageUpload from "../../Component/Inputs/MultiImageUpload";
import CustomSelect from "../../Component/Inputs/CustomSelect";
import Textarea from "../../Component/Inputs/Textarea";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  // Dynamic Data State
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    discount: "",
    taxIncluded: true,
    stock: "",
    stockStatus: "in_stock",
    category: "",
    subCategory: "",
    tag: "",
    description: "",

    // Arrays
    colors: [],
    sizes: [],
    customVariants: [],
    keyFeatures: [],
    specifications: [],
    metaKeywords: [],

    // Business Logic
    pv: "",
    dp: "",
    bp: "",
    sku: "",

    // SEO
    metaDescription: "",

    // Status
    status: "ACTIVE",
    featured: false,
    package: ""
  });

  // Inputs for Array Fields
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const [sizeInput, setSizeInput] = useState("");
  const [newVariantType, setNewVariantType] = useState("");
  const [variantOptionInputs, setVariantOptionInputs] = useState({}); // Map of variantIndex -> input value
  const [featureInput, setFeatureInput] = useState("");
  const [specInput, setSpecInput] = useState({ label: "", value: "" });
  const [keywordInput, setKeywordInput] = useState("");


  // Initial Fetch
  useEffect(() => {
    fetchInitialData();
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [catRes, pkgRes] = await Promise.all([
        getAllCategoryApi(),
        getAllPackagesApi()
      ]);

      // Handle Categories - Fixed: Check for res.data.categories
      if (catRes.data && catRes.data.categories) {
        setCategories(catRes.data.categories);
      } else if (catRes.categories) {
        setCategories(catRes.categories);
      } else if (Array.isArray(catRes)) {
        setCategories(catRes);
      } else {
        setCategories([]);
      }

      // Handle Packages - Fixed: Check for res.data (packages array)
      if (pkgRes.data && Array.isArray(pkgRes.data)) { // Check if data itself is array
        setPackages(pkgRes.data);
      } else if (pkgRes.data && pkgRes.data.packages) { // Check nested packages
        setPackages(pkgRes.data.packages);
      } else if (pkgRes.packages) {
        setPackages(pkgRes.packages);
      } else if (Array.isArray(pkgRes)) {
        setPackages(pkgRes);
      } else {
        setPackages([]);
      }

    } catch (error) {
      console.error("Error fetching initial data", error);
      setCategories([]);
      setPackages([]);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    const res = await getProductByIdApi(id);
    if (res.success) {
      const data = res?.data?.data;
      setFormData({
        name: data?.name || "",
        slug: data?.slug || "",
        price: data?.price || "",
        discount: typeof data?.discount === 'object' ? (data?.discount?.value || "") : (data?.discount || ""),
        taxIncluded: data?.taxIncluded ?? true,
        stock: data?.stock || "",
        stockStatus: data.stock > 0 ? "in_stock" : "out_stock",
        category: data.category?._id || data.category || "", // Handle populated object or ID
        subCategory: data.subCategory || "",
        tag: data.tag || "",
        description: data.description || "",

        colors: data.colors || [],
        sizes: data.sizes || [],
        customVariants: data.customVariants || [],
        keyFeatures: data.keyFeatures || [],
        specifications: data.specifications || [],
        metaKeywords: data.metaKeywords || [],

        pv: data.pv || "",
        dp: data.dp || "",
        bp: data.bp || "",
        sku: data.sku || "",
        metaDescription: data.metaDescription || "",
        status: data.status || "ACTIVE",
        featured: data.featured || false,
        package: data.package || ""
      });

      // Handle Images
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        setImages(data.images.map((img, idx) => ({
          id: idx,
          src: typeof img === 'string' ? img : img.src,
          isUploading: false
        })));
      } else if (data.image) {
        setImages([{ id: 'main', src: data.image, isUploading: false }]);
      }

    } else {
      toast.error(res.message);
      navigate('/product-management');
    }
    setLoading(false);
  };

  // Generic Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // --- Array Field Handlers ---

  // Colors
  const addColor = () => {
    if (!colorInput.name) return;
    setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput] }));
    setColorInput({ name: "", hex: "#000000" });
  };
  const removeColor = (idx) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }));
  };

  // Sizes
  const addSize = () => {
    if (!sizeInput) return;
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput] }));
    setSizeInput("");
  };
  const removeSize = (idx) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  };

  // Custom Variants
  const addVariantType = () => {
    if (!newVariantType) return;
    setFormData(prev => ({
      ...prev,
      customVariants: [...prev.customVariants, { variantType: newVariantType, options: [] }]
    }));
    setNewVariantType("");
  };

  const removeVariantType = (idx) => {
    setFormData(prev => ({
      ...prev,
      customVariants: prev.customVariants.filter((_, i) => i !== idx)
    }));
    // Clean up input state
    const newInputs = { ...variantOptionInputs };
    delete newInputs[idx];
    setVariantOptionInputs(newInputs);
  };

  const addVariantOption = (variantIdx) => {
    const inputVal = variantOptionInputs[variantIdx];
    if (!inputVal) return;

    setFormData(prev => {
      const newVariants = [...prev.customVariants];
      newVariants[variantIdx].options.push(inputVal);
      return { ...prev, customVariants: newVariants };
    });

    setVariantOptionInputs(prev => ({ ...prev, [variantIdx]: "" }));
  };

  const removeVariantOption = (variantIdx, optionIdx) => {
    setFormData(prev => {
      const newVariants = [...prev.customVariants];
      newVariants[variantIdx].options = newVariants[variantIdx].options.filter((_, i) => i !== optionIdx);
      return { ...prev, customVariants: newVariants };
    });
  };

  // Features
  const addFeature = () => {
    if (!featureInput) return;
    setFormData(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, featureInput] }));
    setFeatureInput("");
  };
  const removeFeature = (idx) => {
    setFormData(prev => ({ ...prev, keyFeatures: prev.keyFeatures.filter((_, i) => i !== idx) }));
  };

  // Specifications
  const addSpec = () => {
    if (!specInput.label || !specInput.value) return;
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, specInput] }));
    setSpecInput({ label: "", value: "" });
  };
  const removeSpec = (idx) => {
    setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }));
  };

  // Meta Keywords
  const addKeyword = () => {
    if (!keywordInput) return;
    setFormData(prev => ({ ...prev, metaKeywords: [...prev.metaKeywords, keywordInput] }));
    setKeywordInput("");
  };
  const removeKeyword = (idx) => {
    setFormData(prev => ({ ...prev, metaKeywords: prev.metaKeywords.filter((_, i) => i !== idx) }));
  };


  // --- Submit Handler ---
  const handleSubmit = async (statusOverride = null) => {
    if (!formData.name || !formData.price) {
      return toast.error("Name and Price are required");
    }

    const finalStatus = statusOverride || formData.status;

    const payload = {
      ...formData,
      status: finalStatus,
      price: Number(formData.price),
      stock: Number(formData.stock),
      pv: Number(formData.pv),
      dp: Number(formData.dp),
      bp: Number(formData.bp),
      discount: {
        type: 'PERCENTAGE', // Hardcoded as per current UI limitation, or add a selector if needed
        value: Number(formData.discount)
      },
      images: images.map(img => img.src),
      image: images.length > 0 ? images[0].src : ""
    };

    setLoading(true);
    let res;
    if (isEditMode) {
      res = await updateProductApi(id, payload);
    } else {
      res = await createProductApi(payload);
    }
    setLoading(false);

    if (res.message && (res.message.includes("success") || res.product)) {
      toast.success(res.message);
      navigate('/product-management');
    } else {
      toast.error(res.message || "Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    const res = await deleteProductApi(id);
    setLoading(false);
    if (res.success || res.message?.includes('success')) {
      toast.success("Product deleted successfully");
      navigate('/product-management');
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };


  return (
    <div className="pb-20 relative min-h-screen bg-(--bg-main)">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/product-management')} className="p-2 hover:bg-[var(--bg-box)] rounded-lg transition-colors text-(--text-second)">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-(--text-main)">{isEditMode ? "Edit Product" : "Add Product"}</h1>
            <p className="text-(--text-second) text-sm mt-0.5">Manage your product information, pricing, and media.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="flex-1 md:flex-none px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
            >
              <FiTrash2 /> Delete
            </button>
          )}
          <button
            onClick={() => handleSubmit('DRAFT')}
            className="flex-1 md:flex-none px-4 py-2.5 border border-(--bs-border) text-(--text-second) rounded-lg hover:bg-[var(--bg-main)] transition font-medium cursor-pointer"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('ACTIVE')}
            disabled={loading}
            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : <><FiCheck /> Publish Product</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">

          {/* Basic Info */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text-main)]">Basic Information</h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Running Shoes"
                />
              </div>
              <div className="md:col-span-1">
                <InputField
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="PROD-001"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-second)] mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-[var(--bs-border)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y bg-[var(--bg-main)] text-[var(--text-main)]"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Base Price (MRP)" name="price" type="number" value={formData.price} onChange={handleChange} prefix="₹" />
              <InputField label="Discount" name="discount" type="number" value={formData.discount} onChange={handleChange} suffix="%" />

              <div className="md:col-span-2 pt-4 border-t border-[var(--bs-border)]">
                <label className="text-sm text-(--text-second) font-medium mb-3 block">Business Points</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="PV" name="pv" type="number" value={formData.pv} onChange={handleChange} placeholder="0" />
                  <InputField label="DP" name="dp" type="number" value={formData.dp} onChange={handleChange} placeholder="0" />
                  <InputField label="BP" name="bp" type="number" value={formData.bp} onChange={handleChange} placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          {/* Specification */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Specifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input placeholder="Label (e.g., Material)" value={specInput.label} onChange={e => setSpecInput({ ...specInput, label: e.target.value })} className="flex-1 border-[var(--bs-border)] border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--bg-main)] text-[var(--text-main)]" />
                <input placeholder="Value (e.g., Cotton)" value={specInput.value} onChange={e => setSpecInput({ ...specInput, value: e.target.value })} className="flex-[2] border-[var(--bs-border)] border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--bg-main)] text-[var(--text-main)]" />
                <button onClick={addSpec} className="px-4 py-2 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--bg-btn-hover)] transition text-sm font-medium">Add</button>
              </div>

              {formData.specifications.length > 0 && (
                <div className="bg-[var(--bg-main)] rounded-xl border border-[var(--bs-border)] divide-y divide-[var(--bs-border)] overflow-hidden">
                  {formData.specifications.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 text-sm hover:bg-[var(--bg-box)] transition-colors">
                      <div className="flex gap-2">
                        <span className="font-semibold text-[var(--text-main)] min-w-[100px]">{item.label}</span>
                        <span className="text-(--text-second)">{item.value}</span>
                      </div>
                      <button onClick={() => removeSpec(idx)} className="text-[var(--icon-color)] hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"><RxCrossCircled size={18} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Key Features</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input placeholder="Feature description..." value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 border-[var(--bs-border)] border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--bg-main)] text-[var(--text-main)]" />
                <button onClick={addFeature} className="px-4 py-2 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--btn-hover)] transition text-sm font-medium">Add</button>
              </div>

              {formData.keyFeatures.length > 0 && (
                <ul className="space-y-2">
                  {formData.keyFeatures.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-[var(--bg-main)] px-4 py-3 rounded-lg border border-[var(--bs-border)]">
                      <span className="text-sm text-[var(--text-main)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{item}</span>
                      <button onClick={() => removeFeature(idx)} className="text-[var(--icon-color)] hover:text-red-500"><RxCrossCircled size={18} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="space-y-8">

          {/* Media */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Product Images</h2>
            <MultiImageUpload
              images={images}
              setImages={setImages}
              folder="products"
            />
          </div>

          {/* Organization */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Organization</h2>
            <div className="space-y-5">
              <CustomSelect
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                placeholder="Search Category..."
              />

              <CustomSelect
                label="Package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                options={packages.map(pkg => ({ label: pkg.name, value: pkg._id }))}
                placeholder="Search Package..."
              />

              <InputField label="Tags" name="tag" value={formData.tag} onChange={handleChange} placeholder="e.g. New, Seasonal" />
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Inventory</h2>
            <div className="space-y-4">
              <InputField label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleChange} />
              <CustomSelect
                label="Stock Status"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                options={[
                  { label: "In Stock", value: "in_stock" },
                  { label: "Out of Stock", value: "out_stock" }
                ]}
                searchable={false}
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Variants</h2>

            {/* Colors */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--text-second)] mb-2 block">Colors</label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-[var(--bs-border)] shadow-sm" style={{ backgroundColor: colorInput.hex }}></div>
                  <input placeholder="Color Name" value={colorInput.name} onChange={e => setColorInput({ ...colorInput, name: e.target.value })} className="w-full pl-8 pr-3 py-2 border border-[var(--bs-border)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <input type="color" value={colorInput.hex} onChange={e => setColorInput({ ...colorInput, hex: e.target.value })} className="h-[38px] w-[40px] cursor-pointer rounded-lg border-0 p-0 overflow-hidden" />
                <button onClick={addColor} className="px-3 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--btn-hover)] transition cursor-pointer"><FiPlus /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((c, i) => (
                  <span key={i} className="flex items-center gap-2 bg-[var(--bg-box)] text-[var(--text-main)] px-3 py-1.5 rounded-full text-xs border border-[var(--bs-border)] shadow-sm">
                    <span className="w-3 h-3 rounded-full border border-[var(--bs-border)]" style={{ backgroundColor: c.hex }}></span>
                    {c.name}
                    <button onClick={() => removeColor(i)} className="text-[var(--icon-color)] hover:text-red-500"><RxCrossCircled /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--text-second)] mb-2 block">Sizes</label>
              <div className="flex gap-2 mb-3">
                <input placeholder="Add Size (e.g. XL)" value={sizeInput} onChange={e => setSizeInput(e.target.value)} className="flex-1 border border-[var(--bs-border)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <button onClick={addSize} className="px-3 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--btn-hover)] transition cursor-pointer"><FiPlus /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((s, i) => (
                  <span key={i} className="flex items-center gap-2 bg-[var(--bg-main)] px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-main)] border border-[var(--bs-border)]">
                    {s} <button onClick={() => removeSize(i)} className="text-[var(--icon-color)] hover:text-red-500 cursor-pointer"><RxCrossCircled /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Variants */}
            <div>
              <label className="text-sm font-medium text-[var(--text-second)] mb-2 block">Custom Variants (Optional)</label>

              {/* Add New Variant Type Input */}
              <div className="flex gap-2 mb-4">
                <input
                  placeholder="Add New Variant Type (e.g. Volume, Material)"
                  value={newVariantType}
                  onChange={e => setNewVariantType(e.target.value)}
                  className="flex-1 border border-[var(--bs-border)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button onClick={addVariantType} className="px-3 bg-(--bs-btn-forth) text-white rounded-lg hover:opacity-90 transition flex items-center gap-1 text-sm cursor-pointer"><FiPlus /> Add Type</button>
              </div>

              {/* List of Variant Types */}
              <div className="space-y-4">
                {formData.customVariants.map((variant, vIdx) => (
                  <div key={vIdx} className="border border-[var(--bs-border)] rounded-lg p-3 bg-[var(--bg-main)]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-[var(--text-main)]">{variant.variantType}</h4>
                      <button onClick={() => removeVariantType(vIdx)} className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer">Remove Group</button>
                    </div>

                    {/* Add Option to this Type */}
                    <div className="flex gap-2 mb-2">
                      <input
                        placeholder={`Add ${variant.variantType} Option (e.g. 100ml)`}
                        value={variantOptionInputs[vIdx] || ""}
                        onChange={e => setVariantOptionInputs(prev => ({ ...prev, [vIdx]: e.target.value }))}
                        className="flex-1 border border-[var(--bs-border)] bg-[var(--bg-box)] text-[var(--text-main)] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500"
                      />
                      <button onClick={() => addVariantOption(vIdx)} className="px-2 bg-[var(--bs-btn)] text-white rounded-lg hover:bg-[var(--btn-hover)] transition text-xs cursor-pointer"><FiPlus /></button>
                    </div>

                    {/* Options List */}
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt, oIdx) => (
                        <span key={oIdx} className="flex items-center gap-1 bg-[var(--bg-box)] px-2 py-1 rounded border border-[var(--bs-border)] text-xs text-[var(--text-main)] shadow-sm">
                          {opt} <button onClick={() => removeVariantOption(vIdx, oIdx)} className="text-[var(--icon-color)] hover:text-red-500"><RxCrossCircled /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-second)] mb-2 block">Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input value={keywordInput} onChange={e => setKeywordInput(e.target.value)} className="flex-1 border border-[var(--bs-border)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Add keyword" />
                  <button onClick={addKeyword} className="px-3 bg-[var(--bs-btn-mod)] text-(--bs-btn-forth) rounded-lg hover:opacity-80 transition font-medium text-sm cursor-pointer">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.metaKeywords.map((k, i) => (
                    <span key={i} className="bg-[var(--bs-btn-mod)] text-(--bs-btn-forth) px-2.5 py-1 rounded-md text-xs border border-transparent flex items-center gap-1.5">
                      {k} <button onClick={() => removeKeyword(i)} className="hover:text-[var(--text-main)] cursor-pointer"><RxCrossCircled /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-second)] mb-2 block">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full border border-[var(--bs-border)] bg-[var(--bg-main)] text-[var(--text-main)] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[var(--bg-main)] rounded-xl">
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-[var(--bs-border)] cursor-pointer" />
            <label htmlFor="featured" className="text-sm font-medium text-[var(--text-main)] cursor-pointer select-none">Mark this product as Featured</label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
