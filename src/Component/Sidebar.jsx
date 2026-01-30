import React, { useState } from 'react'
import AppLogo from "../assets/VEDANZOApplogo.png"
// import AppLogo from "../assets/AppLogo.png"
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
        id:"other-management",
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
    <div className="sidebar w-70 rounded-2xl p-5 ">
      
      <img src={AppLogo} alt="logo" className="h-15 w-40  " />

 
    

      {manuItems.map((item, index) => {
        
        const Icon = item.icon;

        return (
          <div key={index} className=''>
            
            {!item.icon ? (
              <p className="text-(--text-second) font-semibold mt-10 ">
                
                {item.label}
              </p>
            ) : (
              <div className="flex items-center font-semibold gap-3 p-3 cursor-pointer  text-(--icon-color) rounded-lg hover:text-(--text-hover) hover:bg-(--btn-hover)">
                <Icon className="text-lg " />
                <span>{item.label}</span>
              </div>
            )}
          </div>
        );
      })}

 <div className="flex items-center gap-3 mt-35">
          <img
            src={img}
            alt="user"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="text-sm leading-tight">
            <p className="font-semibold text-(--text-main)">{user.name}</p>
            <p className="text-(--text-second)">{user.email}</p>
          </div>
        </div>
        
      
    </div>
  );
};
export default Sidebar;