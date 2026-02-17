import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Layout from "../Component/Layout";
import SiteManager from "../page/SiteManager";
import EditBanner from "../page/EditBanner";

import OrderManagement from "../page/OrderManagement";
// import ProductAddManagement from "../page/ProductAddManagement";
import ProductManagement from "../page/ProductManagement";
import ViewProduct from "../page/productManagement/ViewProduct";
import EditProduct from "../page/productManagement/EditProduct";
import UserManagement from "../page/UserManagement";
import ViewOrdersDetails from "../page/ordermanagement/ViewOrdersDetails";
import AddMember from "../page/AddMember";
// import AddCategoryModal from "../Details/AddCategoryModal";
import AddProduct from "../page/productManagement/AddProduct";
import CategoryPage from "../page/productManagement/CategoryPage";
import CategoryForm from "../page/productManagement/CategoryForm";
import CompanyPage from "../page/company/CompanyPage";
import CompanyForm from "../page/company/CompanyForm";
import Login from "../Component/Login";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const isLogin = useSelector((state) => state.auth);
  return (
    <Routes>
      {isLogin.isLoggedIn ? (
        <>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/site-manager" element={<SiteManager />} />
            <Route path="/edit-banner" element={<EditBanner />} />
            {/* <Route path="/product-add-management" element={<ProductAddManagement/>}/> */}
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product/view" element={<ViewProduct />} />
            <Route path="/product/edit" element={<EditProduct />} />
            <Route path="/order-management" element={<OrderManagement />} />
            <Route path="/viewordersdetails" element={<ViewOrdersDetails />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/add-memeber" element={<AddMember />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-category" element={<CategoryPage />} />
            <Route path="/category/create" element={<CategoryForm />} />
            <Route path="/category/edit/:id" element={<CategoryForm />} />
            <Route path="/company-settings" element={<CompanyPage />} />
            <Route path="/company-form" element={<CompanyForm />} />
          </Route>{" "}
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
