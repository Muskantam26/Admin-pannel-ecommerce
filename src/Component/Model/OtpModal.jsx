import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiClock } from 'react-icons/fi';
import Button from '../Btn';

const OtpModal = ({ isOpen, onClose, email, onVerify, title = "Verify OTP", description }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // 1 minute timer

    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setTimer(60);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (isOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) return;

        setLoading(true);
        try {
            await onVerify(otpString);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            e.target.previousSibling.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-all p-6">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <FiX size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500">
                        {description || `Please enter the 6-digit code sent to ${email}`}
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <FiClock size={16} />
                    <span>Resend code in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 rounded-lg font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerify}
                        disabled={loading || otp.join('').length !== 6}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
