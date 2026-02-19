import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slice/authSlice';
import { hideLoader, showLoader } from '../redux/slice/loadingSlice';

import { FiHome, FiX, FiChevronDown, FiChevronRight, FiCreditCard } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { TbBrandOffice } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaMailBulk, FaLayerGroup } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { RiMailSendLine } from "react-icons/ri";
import { BiCategory, BiLogOut } from "react-icons/bi";

import { useNavigate, useLocation } from "react-router-dom";
import { MainContent } from '../constant/MainContent';
import { PathRoutes } from '../constant/Path';


const manuItems = [
  {
    label: "MAIN"
  },
  {
    id: PathRoutes.ADMIN_DASHBOARD,
    icon: FiHome,
    label: "Dashboard",

  },
  {
    id: PathRoutes.PACKAGES,
    icon: FaLayerGroup,
    label: "Packages",
  },
  {
    id: PathRoutes.PRODUCT_MANAGEMENT,
    icon: FaBoxOpen,
    label: "Product Management",
    subItems: [
      {
        id: PathRoutes.PRODUCT_MANAGEMENT,
        label: "All Products",
        icon: FaBoxOpen
      },
      {
        id: PathRoutes.ADD_CATEGORY,
        label: "Categories",
        icon: BiCategory
      },
      {
        id: PathRoutes.SUB_CATEGORY,
        label: "Sub Category",
        icon: BiCategory
      }
    ]

  },
  {
    label: "Company Details",
    icon: TbBrandOffice,
    id: PathRoutes.COMPANY_SETTINGS,
  },

  {
    id: PathRoutes.ORDER_MANAGEMENT,
    icon: FaUserGroup,
    label: "Order Management",
  },
  {
    id: PathRoutes.DEPOSITS,
    icon: FaBoxOpen,
    label: "Deposit Requests",
  },

  {
    id: PathRoutes.USER_MANAGEMENT,
    icon: TbBrandOffice,
    label: "User Management",
    subItems: [
      {
        id: PathRoutes.USER_MANAGEMENT,
        label: "All Users",
        icon: FaUserGroup
      },
      {
        id: PathRoutes.KYC_REQUESTS,
        label: "KYC Requests",
        icon: TbBrandOffice
      },
      {
        id: PathRoutes.BANK_REQUESTS,
        label: "Bank Requests",
        icon: TbBrandOffice
      }
    ]

  },
  {
    id: PathRoutes.REWARDS,
    icon: MdEmail,
    label: "Rewards",
  },
  {
    id: PathRoutes.SITE_MANAGER,
    icon: FaMailBulk,
    label: "Site Manager",

  },
  {
    label: "OTHRES"
  },

  {
    id: PathRoutes.NOTIFICATION,
    icon: GoBell,
    label: "Notification",
  },
  {
    id: PathRoutes.MESSAGE,
    icon: RiMailSendLine,
    label: "Message",
  },
  {
    id: "logout",
    icon: BiLogOut,
    label: "Logout",
  },
]
const Sidebar = ({ open, setOpen }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [expandedMenu, setExpandedMenu] = useState({});

  const toggleSubMenu = (label) => {
    setExpandedMenu(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const { name, email, profileImage } = useSelector((state) => state.auth);
  
  // Dynamic Avatar based on name
  const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&color=fff`;

  const handleNavigation = (id) => {
    if (id === "logout") {
      dispatch(showLoader());
      setTimeout(() => {
        dispatch(logoutUser());
        dispatch(hideLoader());
      }, 2000);
    } else {
      dispatch(showLoader());
      setTimeout(() => {
        const path = id.startsWith("/") ? id : `/${id}`;
        navigate(path.replace('//', '/'));
        dispatch(hideLoader());
      }, 500);
    }
    setOpen(false); // Close mobile menu if open
  };

  return (

    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-[49] md:hidden transition-opacity duration-300 backdrop-blur-sm
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      />


      <div
        className={`
          fixed top-0 left-0 z-50
          h-full w-64
          bg-(--bg-box) border-r border-(--bs-border) shadow-2xl md:shadow-none
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        <div className="absolute right-3 top-3 md:hidden flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-xl text-(--text-main)" />
          </button>
        </div>


        <div className="flex flex-col h-full">

          {/* Logo Area */}
          <div className="p-5 flex items-center justify-center border-b border-dashed border-(--bs-border)">
            <img src={MainContent.appLogo} alt="logo" className="h-12 w-auto object-contain transition-transform hover:scale-105 duration-300" />
          </div>

          {/* Scrollable Menu Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">


            {manuItems.map((item, index) => {

              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenu[item.label];
              const isActive = location.pathname === item.id || (item.subItems && item.subItems.some(sub => sub.id === location.pathname));

              return (
                <div key={index}
                  className={`transition-all duration-500 ease-out
                    ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}
                    md:opacity-100 md:translate-x-0
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >

                  {!item.icon ? (
                    <p className="text-(--text-third) text-[10px] uppercase font-bold tracking-wider mt-4 mb-2 ml-3 opacity-80">
                      {item.label}
                    </p>
                  ) : (
                    <div>
                      <div
                        className={`
                          group flex items-center justify-between text-[13px] font-medium p-2.5 mx-1 cursor-pointer rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-(--btn-hover) text-(--text-hover)'
                            : 'text-(--text-second) hover:bg-(--bs-btn-hover) hover:text-(--text-main)'
                          }
                        `}
                        onClick={() => {
                          if (hasSubItems) {
                            toggleSubMenu(item.label);
                          } else {
                            if (item.id) handleNavigation(item.id);
                          }
                        }}


                        
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`text-lg ${isActive ? 'text-(--text-hover)' : 'text-(--text-third) group-hover:text-(--bs-primary)'} transition-colors`} />
                          <span>{item.label}</span>
                        </div>
                        {/* Only show chevron if there are subitems */}
                        {hasSubItems && (
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <FiChevronDown />
                          </div>
                        )}
                      </div>
                              
                      {/* Render Submenu with Smooth Transition */}
                      <div
                        className={`ml-4 pl-4 border-l border-(--bs-border) overflow-hidden transition-all duration-300 ease-in-out
                                ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                            `}
                      >
                        {hasSubItems && item.subItems.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-[12px] transition-colors mb-1
                                        ${location.pathname === subItem.id
                                ? 'bg-(--btn-hover) text-(--text-hover) font-semibold'
                                : 'text-(--text-second) hover:text-(--text-main) hover:bg-(--bs-btn-hover)'}
                                    `}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigation(subItem.id);
                            }}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${location.pathname === subItem.id ? 'bg-(--text-hover)' : 'bg-gray-300'}`}></span>
                            <span>{subItem.label}</span>
                          </div>
                        ))}
                      </div>

                   
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Profile Footer */}
          <div className="p-3 mt-auto border-t border-(--bs-border)">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-(--bg-main) border border-(--bs-border)">
              <img
                src={profileImage || userImage}
                alt="user"
                className="w-9 h-9 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-(--text-main) truncate">{name || "User"}</p>
                <p className="text-[10px] text-(--text-second) truncate">{email || "admin@example.com"}</p>
              </div>
              <button
                onClick={() => handleNavigation('logout')}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <BiLogOut size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default Sidebar;