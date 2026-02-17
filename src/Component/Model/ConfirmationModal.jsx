import React from 'react';
import Modal from './Modal';
import Button from '../Btn';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="p-6 w-full max-w-md bg-white rounded-lg relative">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title || "Confirm Action"}</h2>
                </div>
                <div className="mb-6">
                    <p className="text-gray-600">{message || "Are you sure you want to proceed?"}</p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        title="Cancel"
                        onClick={onClose}
                        bg="bg-gray-200"
                        text="text-gray-700 hover:bg-gray-300"
                        className="px-4 py-2 rounded-md transition-colors"
                    />
                    <Button
                        title="Confirm"
                        onClick={onConfirm}
                        bg="bg-red-600"
                        text="text-white hover:bg-red-700"
                        className="px-4 py-2 rounded-md transition-colors"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
