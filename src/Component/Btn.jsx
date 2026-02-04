import React from 'react'

export const Btn = ({title}) => {
  return (
    <div>
        <button className='bg-(--bs-btn) text-(--text-white) rounded-sm cursor-pointer p-1.5 px-4 text-[11px]'>{title}</button>
    </div>
  )
;}
