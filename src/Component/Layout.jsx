import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "./PageLoader";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const { isLoading } = useSelector((state) => state.loading);

  return (
    <div className="bg-(--bg-main) min-h-screen relative">
      {isLoading && <PageLoader />}

      {/* Sidebar handles its own fixed positioning and responsiveness */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setOpen(true)} />

        <div className="flex-1 overflow-y-auto p-3 md:p-6 mt-4 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
