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

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-60 p-4 z-30">
        <Sidebar open={true} setOpen={setOpen} />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed md:hidden top-0 left-0 h-screen w-60 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen md:ml-60 p-3 md:p-4">
        <Header onMenuClick={() => setOpen(true)} />

        <div className="flex-1 overflow-y-auto mt-6 md:p-4">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
