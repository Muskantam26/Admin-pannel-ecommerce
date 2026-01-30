import React from 'react'
import Cards from '../Component/Cards'
import Card from '../Component/Cards';
import Payoutcards from '../Component/Payoutcards';

import { FaRegCheckCircle } from "react-icons/fa";


import { Activity, DollarSign, Wallet } from "lucide-react";



const Home = () => {

      const cardData = [
    {
      title: "Total SELLING ",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total INVESTIMENT",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total DISTRIBUTED",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
    {
      title: "Total EARNING",
      subtitle: "Average daily financial activity past 7 days",
      value: "4,10,345",
      period: "Today",
    },
  ];


  
const payoutData = [
  { value: "0", label: "SPOT INCOME", icon: Activity },
  { value: "0", label: "LEVEL INCOME", icon: DollarSign },
  { value: "0", label: "MATCHING", icon: FaRegCheckCircle },
  { value: "0", label: "ROYALTY", icon: DollarSign },
  { value: "0", label: "REWARDS", icon: Wallet },
];

const todayspayout=[
  {id:1, value: "0", label: "SPOT INCOME", icon: Activity },
  {id:2, value: "0", label: "LEVEL INCOME", icon: DollarSign },
  {id:3, value: "0", label: "MATCHING", icon: FaRegCheckCircle },
  {id:4, value: "0", label: "REWARDS", icon: DollarSign },
  {id:5, value: "0", label: "Today total ", icon: Wallet },
  {id:6, value: "0", label: "SPOT INCOME", icon: Activity },
  {id:8, value: "0", label: "LEVEL INCOME", icon: DollarSign },
 
  {id:9, value: "0", label: "LEVEL INCOME", icon: DollarSign },
  {id:10, value: "0", label: "MATCH", icon: FaRegCheckCircle },
 

]




const orderList=[
  {
    id:1,
    order_id:"#1021",
    client_name:"ABC pharma",
    product:"Face Serum",
    stage:"Production",
    dispatch:"18 jan",
    priority:"High",
    status:"Delayed",
    price:"15000",
},
{
  id:2,
  order_id:"#2023",
  client_name:"NeoCare",
  product:"Shampoo",
  stage:"Packaging",
  dispatch:"20 Feb",
  priority:"Low",
  status:"At Risk",
  price:"15000"
},
{
  id:3,
  order_id:"#5620",
  client_name:"ZenLabs",
  product:"Body Lotion",
  stage:"QC",
  dispatch:"30 Jan",
  priority:"High",
  status:"On Track",
  price:"15000"
},
{
  id:4,
  order_id:"#6201",
  client_name:"DermaPlus",
  product:"Cream",
  stage:"Raw Material",
  dispatch:"12 Feb",
  priority:"Low",
  status:"Medium",
  price:"20000"

},
{
  id:5,
  order_id:"#8502",
  client_name:"GlowCo",
  product:"Face Wash",
  stage:"Dispatch",
  dispatch:"25 Jan",
  priority:"High",
  status:"Low",
  price:"15000"
},
{
  id:6,
  order_id:"#6503",
  client_name:"NeoCare",
  product:"Cream",
  stage:"Packaging",
  dispatch:"10 Feb",
  priority:"Low",
  status:"Medium",
  price:"25000"
}
]
  return (
    <div>
        <div>
            <h1 className='text-5xl font-bold text-(--text-main)'>All Store Activity</h1>
            <p className='text-(--text-third) text-xs font-medium mt-2'>Real-time overview of orders, payments, customers & operations</p>

    
                  {/* first section */}

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
      {cardData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>


                    {/* second section  */}



                    {/* Third section */}


                    <div className='bg-(--bg-box) w-full mt-10 rounded-2xl p-3'>
                              <h1 className='text-(--text-main) font-medium text-2xl'>Payout Distribution</h1>
                              <p className='text-(--text-third) text-xs font-medium '>Detailed breakdown of income streams</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
                             {payoutData.map((item, index) => (
                           <Payoutcards
                             key={index}
                             icon={item.icon}
                             value={item.value}
                             label={item.label}
                              />
                           ))}
                     </div>
                      </div>


                 {/* Fourth Section */}

                    <div className='bg-(--bg-box) w-full mt-10 rounded-2xl p-3'>
                        <h1 className='text-(--text-main) font-medium text-2xl'>Today's Payout</h1>
                        <p className='text-(--text-third) text-xs font-medium'>Today's income breakdown</p>


                                <div  className='grid grid-cols-5 gap-3 mt-5' >
                         {todayspayout.map((item, index) => (
                           <Payoutcards
                             key={index}
                             icon={item.icon}
                             value={item.value}
                             label={item.label}
                              />
                           ))}
                                </div>
                               </div>


                    {/* Order list */}

                    <div className='bg-(--bg-box) rounded-2xl p-3 mt-10'>
                      <h1 className='text-(--text-main) font-medium text-2xl'>Order Lists</h1>

                      

                    </div>

       
       
        </div>
    </div>
  )
}

export default Home