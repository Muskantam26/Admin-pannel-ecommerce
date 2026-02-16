import React from 'react'

const UserCards = ({ 
  icon, 
  totalorders, 
  amount, 
  content,
  iconBg = "bg-yellow-100"
}) => {
  return (
    <div className='bg-(--bg-box) w-full p-4 rounded-xl'>

      <div className='flex justify-between gap-5'>

        {/* Icon + Title Section */}
        <div className='space-y-1'>
          
          {/* Sirf icon ka bg */}
          <div className={`p-2 rounded-2xl text-(--text-white) w-fit ${iconBg}`}>
            {icon}
          </div>

          {/* Total Orders Text (No bg color effect) */}
          <h1 className='text-(--text-second) text-[10px] font-light'>
            {totalorders}
          </h1>
        </div>

        {/* Amount Section */}
        <div className='text-black font-medium text-2xl space-y-3 '>
          {amount}
          <h2 className='text-(--text-second) font-light text-[10px] mt-3.5'>
            {content}
          </h2>
        </div>

      </div>

    </div>
  )
}

export default UserCards
