import React from 'react'
import { LuBadgeAlert } from "react-icons/lu";

const Modify = ({ product, onClose, onConfirm }) => {


  return (
    <div className='bg-(--bg-box) rounded-xl flex-col  justify-center items-center space-y-6 p-3 '>

      <h1 className='text-(--bs-btn-forth) flex items-center justify-center'>
        <LuBadgeAlert size={20}/> Warning
      </h1>

      <h3 className='font-light text-xs flex justify-center'>
        Are you sure want to modify 
        <p className='font-semibold'>
       Product ID - {product?.product_id}

        </p> 
        ?
      </h3>

      <h2 className='text-(--bs-btn-forth) text-xs border-l-4 border-l-(--bs-btn-forth) bg-(--bs-btn-mod) flex justify-center p-2 h-10 items-center w-100 text-center'>
      By modifying this product, you are able to see update data
 in Product Management.
      </h2>

      <div className='flex justify-center gap-2'>
        <button 
          onClick={onClose}
          className='text-(--bs-btn-forth) border border-(--bs-btn-forth) font-light p-1.5 px-4 text-xs'
        >
          Cancel
        </button>

        <button 
          onClick={() => onConfirm(product)}
          className='text-(--text-white) font-light bg-(--bs-btn-forth) p-1.5 px-3 text-xs'
        >
          YES,MODIFY
        </button>
      </div>

    </div>
  )
}

export default Modify
