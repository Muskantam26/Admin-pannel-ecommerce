import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import img from "../assets/user.jpg";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";

const Header = ({onMenuClick}) => {
  const [user] = useState({
    name: "Mr. Rajat Pradhan",
    role: "Admin Manager",
  });

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
          className="w-full rounded-lg text-[13px] focus:outline-none text-(--text-second)"
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
            src={img}
            alt="user"
            onClick={() => setShowUser(!showUser)}
            className="  rounded-xl object-cover cursor-pointer "
          />

          {showUser && (
            <div className="absolute top-10 right-0 bg-(--bg-box) shadow-lg rounded-lg px-3 py-2 text-xs leading-tight z-50">
              {/* <p className="font-semibold text-(--text-main)">
                {user.name}
              </p> */}
              <p className="text-(--text-second)">
                {user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
