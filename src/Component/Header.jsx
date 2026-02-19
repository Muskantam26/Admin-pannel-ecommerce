import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import img from "../assets/user.jpg";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";

const Header = ({onMenuClick}) => {
  /* REMOVED STATIC USER STATE */
  const { name, role } = useSelector((state) => state.auth);

  // Dynamic Avatar based on name
  const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&color=fff`;

  const [showUser, setShowUser] = useState(false);

  return (
    <div className="flex gap-12 justify-end-safe ">

       <div className="md:hidden ">
              <IoMdMenu
                className="text-2xl cursor-pointer "
                 onClick={onMenuClick}
                
              />
            </div>
      {/* Search */}
      <div className="flex items-center gap-2">
        <FaSearch size={15} className="text-(--text-third) cursor-pointer" />
        <input
          type="text"
          placeholder="Search by client or ID"
          className="w-full rounded-lg text-[12px] focus:outline-none text-(--text-second)"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <button>
          <FaBell className="text-sm bg-(--bg-btn) rounded-2xl" />
        </button>

        <button>
          <IoSettings className="text-sm bg-(--bg-btn) rounded-2xl" />
        </button>

        {/* User */}
        <div className="relative flex items-center gap-3 h-7 w-7 md:w-7 md:h-7">
            <img
              src={userImage} 
              alt="user"
              onClick={() => setShowUser(!showUser)}
              className="w-full h-full rounded-full object-cover cursor-pointer border border-gray-200"
              onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
            />

          {showUser && (
            <div className="absolute top-10 right-0 bg-(--bg-box) shadow-lg rounded-lg px-3 py-2 text-xs leading-tight z-50 min-w-[120px]">
               <p className="font-semibold text-(--text-main) mb-1">
                {name || "User"}
              </p> 
               <p className="text-(--text-second) text-[10px] uppercase tracking-wider">
                {role || "Admin"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
