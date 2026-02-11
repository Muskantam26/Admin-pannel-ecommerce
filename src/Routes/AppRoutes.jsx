import { Route, Routes } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Layout from "../Component/Layout";
import SiteManager from "../page/SiteManager";
import EditBanner from "../page/EditBanner";

import OrderManagement from "../page/OrderManagement";
import ProductAddManagement from "../page/ProductAddManagement";
import ProductManagement from "../page/ProductManagement";
import ViewProduct from "../productManagement/ViewProduct";
import EditProduct from "../productManagement/EditProduct";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/site-manager" element={<SiteManager/>}/>
        <Route path="/edit-banner" element={<EditBanner/>}/>
        {/* <Route path="/product-add-management" element={<ProductAddManagement/>}/> */}
        <Route path="/product-management" element={<ProductManagement/>}/>
        <Route path="/product/view" element={<ViewProduct/>}/>
        <Route path="/product/edit" element={<EditProduct/>}/>
        <Route path="/order-management" element={<OrderManagement/>}/>

      
      </Route>
    </Routes>
  );
};

export default AppRoutes;
