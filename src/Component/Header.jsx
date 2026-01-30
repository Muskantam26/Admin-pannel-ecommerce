import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import img from "../assets/user.jpg"
import { FaSearch } from "react-icons/fa";

const Header = () => {

 
  const [user] = useState({
    name: "Mr. Rajat Pradhan",
    role:"Admin Manager"
    
  });


  

  return (
    <div className="flex gap-10  justify-end-safe  ">
    
      {/* Search */}
      <div className="flex">
   
        
       
           <input
         
          type="text"
          placeholder="Search by client or ID"
          className="w-full  font-semibold rounded-lg text-sm focus:outline-none text-(--text-third)"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
    
        <button>
          <FaBell className="text-xl bg-(--bg-btn) rounded-2xl" />
        </button>

        <button >
          <IoSettings className="text-xl bg-(--bg-btn) rounded-2xl" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <img
            src={img}
            alt="user"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="text-sm leading-tight">
            <p className="font-semibold text-(--text-main)">{user.name}</p>
            <p className="text-(--text-second)">{user.role}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
