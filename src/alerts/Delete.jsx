import React from 'react'
import { IoWarningSharp } from "react-icons/io5";

const Delete = ({ product, onClose, onConfirm }) => {

  if (!product) return null;

  return (
    <div className='bg-(--bg-box) rounded-xl flex-col  justify-center items-center space-y-6 p-3 '>

      <h1 className='text-(--bs-red) flex items-center justify-center'>
        <IoWarningSharp size={20}/> Warning
      </h1>

      <h3 className='font-light text-xs flex justify-center'>
        Are you sure to Delete 
        <p className='font-semibold'>
          Product ID - {product.product_id}
        </p> 
        ?
      </h3>

      <h2 className='text-(--bs-warn) text-xs border-l-4 border-l-(--bs-line) bg-(--bs-del) flex justify-center p-2 h-10 items-center w-100 text-center'>
        By rejecting this product , you won’t be able to see data in dashboard.
      </h2>

      <div className='flex justify-center gap-2'>
        <button 
          onClick={onClose}
          className='text-(--bs-warn) border border-(--bs-warn) font-light p-1.5 px-4 text-xs'
        >
          Cancel
        </button>

        <button 
          onClick={() => onConfirm(product)}
          className='text-(--text-white) font-light bg-(--bs-warn) p-1.5 px-3 text-xs'
        >
          YES,DELETE
        </button>
      </div>

    </div>
  )
}

export default Delete
