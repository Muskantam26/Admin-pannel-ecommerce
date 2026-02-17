import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slice/authSlice';
import { hideLoader, showLoader } from '../redux/slice/loadingSlice';
// import AppLogo from "../assets/VEDANZOApplogo.png"

import { FiHome, FiX } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { TbBrandOffice } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaMailBulk, FaLayerGroup } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { RiMailSendLine } from "react-icons/ri";
import { BiCategory, BiLogOut } from "react-icons/bi";
import img from "../assets/user.jpg"
import { useNavigate } from "react-router-dom";
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

  },
  {
    label: "Company Details",
    icon: TbBrandOffice,
    id: PathRoutes.COMPANY_SETTINGS,
  },
  {
    label: "Categories",
    icon: BiCategory,
    id: PathRoutes.ADD_CATEGORY,
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

  const [user] = useState({
    name: "Mr. Rajat Pradhan",
    email: "rajatpradhan@gmail.com"

  });
  return (

    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden "
          onClick={() => setOpen(false)}
        />
      )}


      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-full
          transform transition-transform duration-300
         
            ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    
        `}
      >

        <div className="absolute right-3 md:hidden flex justify-end p-3">
          <FiX
            className="text-xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>


        <div className="sidebar w-60 rounded-xs md:rounded-2xl flex flex-col h-full p-3  ">


          <img src={MainContent.appLogo} alt="logo" className="h-10 w-25  " />

          <div className='mt-7 overflow-y-auto custom-scroll'>


            {manuItems.map((item, index) => {

              const Icon = item.icon;

              return (
                <div key={index} className=''>

                  {!item.icon ? (
                    <p className="text-(--text-third) text-xs  mt-3 ml-4 font-semibold ">

                      {item.label}
                    </p>
                  ) : (
                    <div className="flex items-center text-xs font-medium gap-3 p-2 m-2 cursor-pointer  text-(--icon-color) rounded-lg hover:text-(--text-hover) hover:bg-(--btn-hover)"
                      onClick={() => {
                        if (item.id === "logout") {
                          dispatch(showLoader());
                          setTimeout(() => {
                            dispatch(logoutUser());
                            dispatch(hideLoader());
                          }, 2000);
                        } else {
                          dispatch(showLoader());
                          setTimeout(() => {
                            // Helper to handle both absolute paths (starting with /) and route constants
                            const path = item.id.startsWith("/") ? item.id : `/${item.id}`;
                            // Remove double slashes if any (e.g. //dashboard)
                            navigate(path.replace('//', '/'));
                            dispatch(hideLoader());
                          }, 500);
                        }
                        setOpen(false);
                      }}
                    >
                      <Icon className="text-sm " />
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-auto pt-5 ">

            <img
              src={img}
              alt="user"
              className="w-8 h-8 rounded-xl object-cover"
            />
            <div className="text-xs leading-tight ">
              <p className="font-semibold text-(--text-main)">{user.name}</p>
              <p className="text-(--text-second)">{user.email}</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default Sidebar;