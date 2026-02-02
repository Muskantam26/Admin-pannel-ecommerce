import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";


const Layout = ({ children }) => {
  return (
    <div className="flex bg-(--bg-main) min-h-screen">
     
      <div className="fixed left-0 top-0 h-screen w-55 p-6">
        <Sidebar />
      </div>

      <div className="ml-60  flex-1 flex flex-col min-h-screen p-6">
        
        
        <Header />

     
        <div className="flex-1 overflow-y-auto mt-6 p-5 ">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;
