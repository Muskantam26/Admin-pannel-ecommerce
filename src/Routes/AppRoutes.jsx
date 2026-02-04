import { Route, Routes } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Layout from "../Component/Layout";
import SiteManager from "../page/SiteManager";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/site-manager" element={<SiteManager/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
