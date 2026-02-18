import React, { useState } from 'react';
import ProductList from './productManagement/ProductList';
import CategoryPage from './productManagement/CategoryPage';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="p-5">
      {/* Tabs Navigation */}
      <div className="flex gap-8 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === "products"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setActiveTab("category")}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === "category"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Category
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "products" ? <ProductList /> : <CategoryPage />}
      </div>
    </div>
  );
};

export default ProductManagement;