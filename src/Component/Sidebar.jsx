import React, { useState } from 'react'
// import AppLogo from "../assets/VEDANZOApplogo.png"

import { FiHome } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { TbBrandOffice } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaMailBulk } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { RiMailSendLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import img from "../assets/user.jpg"
import Untitleddesign from "../assets/Untitleddesign.png"


const manuItems =[
    {
        label:"MAIN"
    },
   
    {
        id:"dashboard",
        icon:FiHome,
        label:"Dashboard",
    },
    {
        id:"product-management",
        icon:FaBoxOpen,
        label:"Product Management",
    },
    {
        id:"order-management",
        icon:FaUserGroup,
        label:"Other Management",
    },
    {
        id:"user-management",
        icon:TbBrandOffice,
        label:"User Management",
    },
    {
        id:"rewards",
        icon:MdEmail,
        label:"Rewards",

    },
    {
        id:"site-manager",
        icon:FaMailBulk,
        label:"Site Manager",
    },
        {
            label:"OTHRES"
        },
   
    {
        id:"notification",
        icon:GoBell,
        label:"Notification",
    },
    {
        id:"message",
        icon:RiMailSendLine,
        label:"Message",
    },
    {
        id:"logout",
        icon:BiLogOut,
        label:"Logout",
    },
]
const Sidebar = () => {

    
      const [user] = useState({
        name: "Mr. Rajat Pradhan",
       email:"rajatpradhan@gmail.com"
        
      });
  return (
 <div className="sidebar w-60 rounded-2xl flex flex-col h-full p-3 ">

      
      <img src={Untitleddesign} alt="logo" className="h-10 w-25  " />

  <div className='mt-7'>
    

      {manuItems.map((item, index) => {
        
        const Icon = item.icon;

        return (
          <div key={index} className=''>
            
            {!item.icon ? (
              <p className="text-(--text-third) text-xs  mt-3 ml-4 font-semibold ">
                
                {item.label}
              </p>
            ) : (
              <div className="flex items-center text-xs font-medium gap-3 p-2 m-2 cursor-pointer  text-(--icon-color) rounded-lg hover:text-(--text-hover) hover:bg-(--btn-hover)">
                <Icon className="text-sm " />
                <span>{item.label}</span>
              </div>
            )}
          </div>
        );
      })}

      </div>

<div className="flex items-center gap-3 mt-auto pt-5">

          <img
            src={img}
            alt="user"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <div className="text-xs leading-tight">
            <p className="font-semibold text-(--text-main)">{user.name}</p>
            <p className="text-(--text-second)">{user.email}</p>
          </div>
        </div>
        
      
    </div>
  );
};
export default Sidebar;