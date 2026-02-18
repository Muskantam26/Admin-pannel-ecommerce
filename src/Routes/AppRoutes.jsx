import { Navigate, Route, Routes } from "react-router-dom";
import { PathRoutes } from "../constant/Path";
import Dashboard from "../page/Dashboard";
import Layout from "../Component/Layout";
import SiteManager from "../page/SiteManager";


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
import DepositPage from "../page/DepositPage";
import Login from "../Component/Login";
import Rewards from "../page/Rewards";
import Packages from "../page/Packages";
import Notification from "../page/Notification";
import Message from "../page/Message";
import AddBanner from "../page/AddBanner";
import EditBanner from "../page/EditBanner";
import UserProfileDetails from "../page/UserProfileDetails";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const isLogin = useSelector((state) => state.auth);
  console.log(isLogin)
  return (
    <Routes>
      {isLogin?.isLoggedIn ? (
        <>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/site-manager" element={<SiteManager />} />
            {/* <Route path="/product-add-management" element={<ProductAddManagement/>}/> */}
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product/view" element={<ViewProduct />} />
            <Route path="/product/edit" element={<EditProduct />} />
            <Route path="/order-management" element={<OrderManagement />} />
            <Route path="/viewordersdetails" element={<ViewOrdersDetails />} />
            <Route path="/add-memeber" element={<AddMember />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-category" element={<CategoryPage />} />
            <Route path="/category/create" element={<CategoryForm />} />
            <Route path="/category/edit/:id" element={<CategoryForm />} />
            <Route path="/company-settings" element={<CompanyPage />} />
            <Route path="/company-form" element={<CompanyForm />} />
            <Route path={PathRoutes.REWARDS} element={<Rewards />} />
            <Route path={PathRoutes.PACKAGES} element={<Packages />} />
            <Route path={PathRoutes.NOTIFICATION} element={<Notification />} />
            <Route path={PathRoutes.MESSAGE} element={<Message />} />
            <Route path="/add-banner" element={<AddBanner />} />
            <Route path={PathRoutes.EDIT_BANNER} element={<EditBanner />} />
            <Route path={PathRoutes.DEPOSITS} element={<DepositPage />} />
            <Route path={PathRoutes.USER_MANAGEMENT} element={<UserManagement />} />
            <Route path="/user-profile/:id" element={<UserProfileDetails />} />
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
