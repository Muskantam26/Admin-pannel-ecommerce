import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import img from "../assets/user.jpg";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";

const Header = ({ onMenuClick }) => {
  const [user] = useState({
    name: "Mr. Rajat Pradhan",
    role: "Admin Manager",
  });

  const [showUser, setShowUser] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-(--bg-main)/80 backdrop-blur-md flex gap-4 md:gap-12 justify-between md:justify-end-safe py-3 px-4 border-b border-(--bs-border) transition-all duration-300">

      <div className="md:hidden flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-2xl cursor-pointer hover:bg-(--bs-btn-hover) active:scale-95 transition-all duration-200 text-(--text-main)"
        >
          <IoMdMenu />
        </button>
      </div>
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 md:flex-none max-w-md bg-(--bg-box) px-3 py-2 rounded-lg border border-(--bs-border) focus-within:border-(--bs-primary) transition-colors">
        <FaSearch size={14} className="text-(--text-third)" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-[13px] focus:outline-none text-(--text-main) placeholder-(--text-third)"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 hover:bg-(--bs-btn-hover) rounded-full transition-colors group">
          <FaBell className="text-sm text-(--text-second) group-hover:text-(--bs-primary) transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-(--bg-main)"></span>
        </button>

        <button className="p-2 hover:bg-(--bs-btn-hover) rounded-full transition-colors group">
          <IoSettings className="text-sm text-(--text-second) group-hover:text-(--bs-primary) transition-colors" />
        </button>

        {/* User */}
        <div className="relative">
          <div
            onClick={() => setShowUser(!showUser)}
            className="flex items-center gap-2 cursor-pointer hover:bg-(--bs-btn-hover) p-1 rounded-xl transition-all"
          >
            <img
              src={img}
              alt="user"
              className="w-8 h-8 rounded-lg object-cover shadow-sm"
            />
            <div className="hidden md:block text-left">
              <p className="text-[10px] text-(--text-second) font-medium uppercase tracking-wider">Admin</p>
            </div>
          </div>

          {showUser && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-(--bg-box) shadow-xl rounded-xl border border-(--bs-border) p-2 z-50 animate-fade-in-up">
              <div className="px-3 py-2 border-b border-(--bs-border) mb-1">
                <p className="font-semibold text-sm text-(--text-main)">{user.name}</p>
                <p className="text-xs text-(--text-second)">{user.role}</p>
              </div>
              <button className="w-full text-left px-3 py-2 text-xs font-medium text-(--text-second) hover:bg-(--bs-btn-hover) hover:text-(--bs-primary) rounded-lg transition-colors">
                Profile Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
