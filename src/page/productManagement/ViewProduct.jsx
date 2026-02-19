import React, { useEffect, useState } from 'react';
import Button from '../../Component/Btn';
import { MainHeading, Heading } from '../../Component/Heading';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdApi, deleteProductApi } from '../../api/product-api';
import { toast } from 'react-toastify';
import Modal from '../../Component/Model/Modal';
import Delete from '../../alerts/Delete';
import {
  FiPackage, FiCheck, FiGlobe, FiTag, FiLayers,
  FiDollarSign, FiBox, FiActivity, FiTrash2, FiEdit3, FiArrowLeft
} from 'react-icons/fi';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductByIdApi(id);
      if (res && (res.success || res.data)) {
        const productData = res.data || res;
        setProduct(productData);
        const mainImg = productData.image;
        const galleryIds = productData.images || [];
        setSelectedImage(mainImg || (galleryIds.length > 0 ? galleryIds[0] : null));
      } else {
        toast.error("Product not found");
        navigate('/product-management');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const res = await deleteProductApi(product._id);
    if (res.success || (res.message && res.message.includes('successfully'))) {
      toast.success("Product deleted successfully");
      navigate('/product-management');
    } else {
      toast.error(res.message || "Failed to delete product");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading product details...</div>;
  if (!product) return <div className="p-10 text-center text-red-500">Product not found.</div>;

  const getImageUrl = (img) => (!img ? "https://via.placeholder.com/150" : (typeof img === 'string' ? img : img.url));
  const allImages = product?.images?.filter(Boolean);

  return (
    <div className="pb-20 relative min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/product-management')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[var(--icon-color)]">
            <FiArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Product Details</h1>
            <p className="text-[var(--text-second)] text-sm mt-0.5 flex items-center gap-2">
              ID: <span className="font-mono text-gray-500">{product._id}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {product.status || 'DRAFT'}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
          >
            <FiTrash2 /> Delete
          </button>
          <button
            onClick={() => navigate(`/product/edit/${product._id}`)}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--bs-btn-forth)] text-white hover:opacity-90 rounded-lg transition-all shadow-lg shadow-blue-500/20 text-sm font-medium"
          >
            <FiEdit3 /> Edit Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* --- Left Column: Images & Key Info (4 Cols) --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Image Gallery */}
          <div className="bg-[var(--bg-box)] rounded-2xl p-4 shadow-sm border border-[var(--bs-border)]">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100 relative items-center flex justify-center">
              <img src={getImageUrl(selectedImage)} alt={product.name} className="max-w-full max-h-full object-contain p-2" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all p-1 ${getImageUrl(selectedImage) === getImageUrl(img) ? 'border-[var(--bs-btn-forth)]' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover rounded-md" />
                </button>
              ))}
            </div>
          </div>

          {/* Linked Package Card */}
          {product.package && (
            <div className="card-box2 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 text-gray-700">
                  <div className="p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                    <FiPackage size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Linked Package</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {typeof product.package === 'object' ? product.package.name : "Package Linked"}
                </h3>
                {(typeof product.package === 'object' && product.package.price) && (
                  <p className="text-sm font-medium text-gray-600">Package Price: ₹{product.package.price}</p>
                )}
              </div>
              <FiPackage className="absolute -bottom-4 -right-4 text-white opacity-40 rotate-12" size={120} />
            </div>
          )}

          {/* Organization Info */}
          <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
            <Heading title="Organization" titleSize="text-base font-bold text-[var(--text-main)] mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-[var(--text-second)]">Category</span>
                <span className="text-sm font-medium text-[var(--text-main)]">{product.category?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-[var(--text-second)]">Sub-Category</span>
                <span className="text-sm font-medium text-[var(--text-main)]">{product.subCategory?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-[var(--text-second)]">SKU</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{product.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-[var(--text-second)]">Stock Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm font-medium">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  <span className="text-xs text-gray-400">({product.stock})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Middle Column: Core Details & Specs (5 Cols) --- */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-box)] p-5 rounded-2xl border border-[var(--bs-border)] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[var(--text-second)] mb-2">
                <FiDollarSign /> <span className="text-xs font-bold uppercase">Selling Price</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-main)]">₹{product.price}</p>
            </div>
            <div className="bg-[var(--bg-box)] p-5 rounded-2xl border border-[var(--bs-border)] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <FiTag /> <span className="text-xs font-bold uppercase">Distributor Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">₹{product.dp || 0}</p>
            </div>
            <div className="bg-[var(--bg-box)] p-5 rounded-2xl border border-[var(--bs-border)] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <FiActivity /> <span className="text-xs font-bold uppercase">Business Points</span>
              </div>
              <div className="flex gap-3 items-end">
                <div><span className="text-xs text-gray-400 block">PV</span><span className="font-bold text-orange-700">{product.pv || 0}</span></div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div><span className="text-xs text-gray-400 block">BV</span><span className="font-bold text-orange-700">{product.bv || product.bp || 0}</span></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
            <Heading title="Product Description" titleSize="text-base font-bold text-[var(--text-main)] mb-4" />
            <div className="prose prose-sm max-w-none text-[var(--text-second)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description || "<p className='italic text-gray-400'>No description provided.</p>" }}
            />
          </div>

          {/* Specs & Features (Redesigned) */}
          {(product.keyFeatures?.length > 0 || product.specifications?.length > 0) && (
            <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">

              {/* Features Grid */}
              {product.keyFeatures?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiCheck className="text-green-500" /> Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="mt-0.5 min-w-[20px] h-[20px] rounded-full bg-white border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
                          <FiCheck size={12} />
                        </div>
                        <p className="text-sm text-gray-700 leading-snug">{feat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Table */}
              {product.specifications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiLayers className="text-blue-500" /> Technical Specifications
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex flex-col sm:flex-row border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <div className="sm:w-1/3 px-4 py-3 bg-gray-50/30 text-sm font-medium text-gray-600 border-r border-gray-50">
                          {spec.label}
                        </div>
                        <div className="sm:w-2/3 px-4 py-3 text-sm text-[var(--text-main)]">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Right Column: Variants & Extras (Optional, can merge with left if needed) --- */}
        {/*  (Using full width for Core Details if Variants are small, otherwise splitting) */}
        {/*  Let's actually put Variants inside the Main Column if they exist to give them space, or use a separate section below. */}
        {/*  For now, let's put SEO and Variants in their own section below Main Info if they are large, OR in the Left Col. */}
        {/*  Better: Put Variants in Left Col if simple, or Full Width if complex. Let's stick to Left Col for now as per plan, but make them premium. */}

      </div>

      {/* Bottom Row: Variants & SEO (Full Width Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Variants Redesign */}
        {(product.colors?.length > 0 || product.sizes?.length > 0) && (
          <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
            <Heading title="Product Variants" titleSize="text-base font-bold text-[var(--text-main)] mb-6" />

            <div className="flex flex-col gap-6">
              {product.colors?.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-second)] uppercase tracking-wider mb-3 block">Color Options</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((col, i) => (
                      <div key={i} className="flex items-center gap-3 pr-4 pl-1 py-1 rounded-full border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors cursor-default">
                        <div
                          className="w-8 h-8 rounded-full border border-gray-100 shadow-inner"
                          style={{ backgroundColor: col.hex || '#ccc' }}
                        />
                        <span className="text-sm font-medium text-gray-700">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-second)] uppercase tracking-wider mb-3 block">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, i) => (
                      <div key={i} className="min-w-[40px] h-[40px] px-3 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                        {typeof size === 'object' ? size.name : size}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO Preview Card */}
        <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
          <Heading title="Search Engine Preview" titleSize="text-base font-bold text-[var(--text-main)] mb-4" />
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer max-w-xl">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-100 p-1">
                <FiGlobe className="w-full h-full text-gray-500" />
              </div>
              <span className="text-xs text-gray-700">yoursite.com</span>
              <span className="text-xs text-gray-400">› product</span>
            </div>
            <h4 className="text-[#1a0dab] text-lg font-medium hover:underline truncate">
              {product.metaTitle || product.name}
            </h4>
            <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
              {product.metaDescription || product.description?.substring(0, 160) || "No description available."}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.metaKeywords?.length > 0 ? product.metaKeywords.map((k, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">#{k}</span>
            )) : <span className="text-xs text-gray-400 italic">No keywords configured</span>}
          </div>
        </div>

      </div>

      <Modal isOpen={isDeleteOpen}>
        <Delete
          product={product}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </Modal>
    </div>
  );
};

export default ViewProduct;