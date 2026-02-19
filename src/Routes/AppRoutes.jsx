import { Navigate, Route, Routes } from "react-router-dom";
import { PathRoutes } from "../constant/Path";
import Dashboard from "../page/Dashboard";
import Layout from "../Component/Layout";
import SiteManager from "../page/SiteManager";


import OrderManagement from "../page/OrderManagement";
import ProductManagement from "../page/ProductManagement";
import ViewProduct from "../page/productManagement/ViewProduct";
import UserManagement from "../page/UserManagement";
import KycRequestPage from "../page/UserManagement/KycRequestPage";
import BankRequestPage from "../page/UserManagement/BankRequestPage";
import BankDetailsPage from "../page/UserManagement/BankDetailsPage";
import AddBankPage from "../page/UserManagement/AddBankPage";
import AddressRequestPage from "../page/UserManagement/AddressRequestPage";
import AddAddressPage from "../page/UserManagement/AddAddressPage";
import AddressDetailsPage from "../page/UserManagement/AddressDetailsPage";
import AddKycPage from "../page/UserManagement/AddKycPage";
import KycDetailsPage from "../page/UserManagement/KycDetailsPage";

import ViewOrdersDetails from "../page/ordermanagement/ViewOrdersDetails";
import AddMember from "../page/AddMember";
import AddProduct from "../page/productManagement/AddProduct";
import CategoryPage from "../page/productManagement/CategoryPage";
import SubCategoryPage from "../page/productManagement/SubCategoryPage";
import CategoryForm from "../page/productManagement/CategoryForm";
import CompanyPage from "../page/company/CompanyPage";
import CompanyForm from "../page/company/CompanyForm";
import DepositRequestPage from "../page/DepositRequestPage";
import DepositPage from "../page/DepositPage";
import Login from "../Component/Login";
import Rewards from "../page/Rewards";
import Packages from "../page/Packages";
import Notification from "../page/Notification";
import Message from "../page/Message";
import AddBanner from "../page/AddBanner";
import EditBanner from "../page/EditBanner";
import UserProfileDetails from "../page/UserProfileDetails";
import UserProfileEditPage from "../page/UserProfileEditPage";
import CartPage from "../page/orderManagement/CartPage";
import CartDetailsPage from "../page/orderManagement/CartDetailsPage";
import AdminPage from "../page/AdminManagement/AdminPage";
import AdminAddPage from "../page/AdminManagement/AdminAddPage";
import AdminDetailsPage from "../page/AdminManagement/AdminDetailsPage";
import { useSelector } from "react-redux";


const AppRoutes = () => {
  const isLogin = useSelector((state) => state.auth);
  return (
    <Routes>
      {isLogin?.isLoggedIn ? (
        <>
          <Route element={<Layout />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route index element={<Dashboard />} />
            <Route path={PathRoutes.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={PathRoutes.SITE_MANAGER} element={<SiteManager />} />

            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product/view/:id" element={<ViewProduct />} />
            {/* <Route path="/product/edit" element={<EditProduct />} /> */}
            <Route path={PathRoutes.ORDER_MANAGEMENT} element={<OrderManagement />} />
            <Route path={PathRoutes.ORDERS_DETAILS} element={<ViewOrdersDetails />} />
            <Route path={PathRoutes.ALL_CARTS} element={<CartPage />} />
            <Route path={PathRoutes.CART_DETAILS} element={<CartDetailsPage />} />
            <Route path={PathRoutes.ADD_MEMBER} element={<AddMember />} />

            {/* Product Routes */}
            <Route path={PathRoutes.ADD_PRODUCT} element={<AddProduct />} />
            <Route path={PathRoutes.PRODUCT_EDIT_ID} element={<AddProduct />} />

            <Route path={PathRoutes.ADD_CATEGORY} element={<CategoryPage />} />
            <Route path={PathRoutes.SUB_CATEGORY} element={<SubCategoryPage />} />
            <Route path={PathRoutes.CATEGORY_CREATE} element={<CategoryForm />} />
            <Route path={PathRoutes.CATEGORY_EDIT_ID} element={<CategoryForm />} />
            <Route path={PathRoutes.COMPANY_SETTINGS} element={<CompanyPage />} />
            <Route path={PathRoutes.COMPANY_FORM} element={<CompanyForm />} />
            <Route path={PathRoutes.REWARDS} element={<Rewards />} />
            <Route path={PathRoutes.PACKAGES} element={<Packages />} />
            <Route path={PathRoutes.NOTIFICATION} element={<Notification />} />
            <Route path={PathRoutes.MESSAGE} element={<Message />} />
            <Route path={PathRoutes.ADD_BANNER} element={<AddBanner />} />
            <Route path={PathRoutes.EDIT_BANNER} element={<EditBanner />} />

            {/* Deposit Routes */}
            <Route path={PathRoutes.DEPOSITS} element={<DepositRequestPage />} />
            <Route path={PathRoutes.DEPOSIT_REQUESTS} element={<DepositRequestPage />} />
            <Route path={PathRoutes.ADD_DEPOSIT} element={<DepositPage />} />

            <Route path={PathRoutes.USER_MANAGEMENT} element={<UserManagement />} />
            <Route path={PathRoutes.USER_PROFILE_EDIT} element={<UserProfileEditPage />} />
            <Route path={PathRoutes.USER_PROFILE_DETAILS} element={<UserProfileDetails />} />
            <Route path={PathRoutes.KYC_REQUESTS} element={<KycRequestPage />} />
            <Route path={PathRoutes.ADD_KYC} element={<AddKycPage />} />
            <Route path={`${PathRoutes.KYC_DETAILS}/:id`} element={<KycDetailsPage />} />
            <Route path={PathRoutes.BANK_REQUESTS} element={<BankRequestPage />} />
            <Route path={PathRoutes.BANK_DETAILS} element={<BankDetailsPage />} />
            <Route path={PathRoutes.ADD_BANK} element={<AddBankPage />} />
            <Route path={PathRoutes.ADDRESS_REQUESTS} element={<AddressRequestPage />} />
            <Route path={PathRoutes.ADD_ADDRESS} element={<AddAddressPage />} />
            <Route path={PathRoutes.ADD_ADDRESS} element={<AddAddressPage />} />
            <Route path={PathRoutes.ADDRESS_DETAILS} element={<AddressDetailsPage />} />

            {/* Admin Management */}
            <Route path={PathRoutes.ADMIN_MANAGEMENT} element={<AdminPage />} />
            <Route path={PathRoutes.ADD_ADMIN} element={<AdminAddPage />} />
            <Route path={`${PathRoutes.ADMIN_DETAILS}/:id`} element={<AdminDetailsPage />} />
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
