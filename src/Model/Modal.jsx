import React from "react";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
          className={`bg-(--bg-box) rounded-xl w-auto max-w-6xl 
        max-h-[85vh] custom-scroll overflow-x-hidden overflow-y-auto shadow-2xl
        ${isOpen ? "modal-open" : "modal-close"}`}
                   
      >
         {children}
       
      </div>
  

  

    </div>
  );
};

export default Modal;
