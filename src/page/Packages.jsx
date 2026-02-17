import React from 'react'
import { MainHeading } from '../Component/Heading'
import { IoDiamond } from "react-icons/io5";
import { FaCrown, FaGem, FaBoxOpen, FaCheck } from "react-icons/fa";
import { useState } from "react";
import AddNewPackage from "./AddNewPackage";

const Packages = () => {
  const packages = [
    { 
      id: 1, 
      name: 'Diamond', 
      price: 25000, 
      mrp: 40000, 
      cto: '1 Lakh', 
      pv: 15, 
      theme: 'dark', // Special Dark Theme
      icon: <IoDiamond className="text-4xl text-[#9DB29B]" />,
      benefits: ['Max C.T.O Limit', 'Highest PV Allocation', 'VIP Support Access']
    },
    { 
      id: 2, 
      name: 'Gold', 
      price: 10000, 
      mrp: 14000, 
      cto: '25,000', 
      pv: 6, 
      theme: 'light',
      icon: <FaCrown className="text-4xl text-yellow-500" />,
      benefits: ['High Product Value', 'Priority Service', 'Gold Rank Access']
    },
    { 
      id: 3, 
      name: 'Silver', 
      price: 5000, 
      mrp: 7000, 
      cto: '5,000', 
      pv: 2.5, 
      theme: 'light',
      icon: <FaGem className="text-4xl text-gray-400" />,
      benefits: ['Standard C.T.O', 'Balanced PV', 'Starter Kit']
    },
    { 
      id: 4, 
      name: 'Bronze', 
      price: 999, 
      mrp: 1399, 
      cto: '999', 
      pv: 1, 
      theme: 'light',
      icon: <FaBoxOpen className="text-4xl text-orange-400" />,
      benefits: ['Entry Level', 'Basic Access', 'Digital ID']
    },
  ];

  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);

  return (
    <div className='space-y-6'>
       {!isAddPackageOpen ? (
       <>
       <div className='flex justify-between items-center'>
            <MainHeading
                title={"Membership Packages"}
                subtitle={"Choose the best plan for your needs"}
            />
            <button 
                onClick={() => setIsAddPackageOpen(true)}
                className='bg-(--bs-btn) text-(--text-white) px-4 py-2 rounded-lg text-sm font-medium cursor-pointer'>
                Add New Package
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
                <div 
                    key={pkg.id} 
                    className={`relative rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center
                        ${pkg.theme === 'dark' 
                            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border border-gray-700 shadow-xl' 
                            : 'bg-white text-gray-800 border border-gray-100 shadow-lg'
                        }
                    `}
                >
                    {/* Badge for Diamond */}
                    {pkg.name === 'Diamond' && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                            Best Value
                        </div>
                    )}

                    {/* Icon Circle */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg
                        ${pkg.theme === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-100'}
                    `}>
                        {pkg.icon}
                    </div>

                    <h2 className={`text-2xl font-bold mb-2 ${pkg.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {pkg.name}
                    </h2>

                    <div className="flex items-baseline gap-2 mb-6">
                        <span className={`text-3xl font-extrabold ${pkg.theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            ₹{pkg.price.toLocaleString()}
                        </span>
                        <span className={`text-sm decoration-line-through ${pkg.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            ₹{pkg.mrp.toLocaleString()}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className={`w-full grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl
                        ${pkg.theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}
                    `}>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider opacity-70">C.T.O Limit</p>
                            <p className="font-bold text-sm">{pkg.cto}</p>
                        </div>
                        <div className="text-center border-l border-gray-200/20">
                            <p className="text-[10px] uppercase tracking-wider opacity-70">Point Value</p>
                            <p className="font-bold text-sm">{pkg.pv}</p>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <ul className="w-full space-y-3 mb-8 text-left">
                        {pkg.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm gap-3">
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                    ${pkg.theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}
                                `}>
                                    <FaCheck size={10} />
                                </span>
                                <span className="opacity-90">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Action Button */}
                    <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 mt-auto
                        ${pkg.theme === 'dark' 
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
                            : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200'
                        }
                    `}>
                        View Details
                    </button>
                </div>
            ))}
        </div>
        </>
       ) : (
           <AddNewPackage onClose={() => setIsAddPackageOpen(false)} onSaveClick={(data) => {
               console.log("Saved:", data);
               setIsAddPackageOpen(false);
           }} />
       )}
    </div>
  )
}

export default Packages
