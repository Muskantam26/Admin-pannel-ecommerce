import React from "react";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className=" rounded-xl p-2 w-full max-w-6xl relative">
        {children}
      </div>
    </div>
  );
};

export default Modal;
