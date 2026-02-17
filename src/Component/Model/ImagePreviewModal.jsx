import React from 'react';
import Modal from './Modal';
import { RxCross2 } from "react-icons/rx";

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, title }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl w-full p-2">
                <div className="flex justify-between items-center p-2 border-b border-gray-100 mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">{title || "Image Preview"}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <RxCross2 className="text-xl text-gray-500" />
                    </button>
                </div>

                <div className="flex justify-center items-center bg-gray-50 min-h-[200px] max-h-[80vh] overflow-auto rounded-md">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title || "Preview"}
                            className="max-w-full max-h-[75vh] object-contain"
                        />
                    ) : (
                        <p className="text-gray-400">No image available</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ImagePreviewModal;
