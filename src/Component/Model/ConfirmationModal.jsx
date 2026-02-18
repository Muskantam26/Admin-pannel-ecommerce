import React from 'react';
import Modal from './Modal';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false
}) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="p-6 w-full max-w-md bg-(--bg-box) rounded-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isDanger ? <FaExclamationTriangle size={30} /> : <FaCheckCircle size={30} />}
                    </div>

                    <h3 className="text-xl font-bold text-(--text)">{title}</h3>
                    <p className="text-(--text-second) opacity-80">{message}</p>

                    <div className="flex w-full gap-4 mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-(--bs-border) text-(--text-second) bg-(--bg-box) hover:bg-(--bs-btn-hover) transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-opacity hover:opacity-90 shadow-sm
                                ${isDanger ? 'bg-red-600' : 'bg-(--bs-btn)'}
                            `}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
