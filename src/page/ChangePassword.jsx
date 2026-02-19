import React, { useState } from 'react'
import { Heading } from '../Component/Heading';
import { RxCrossCircled } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";
import { changePasswordApi } from '../api/user-api';
import { toast } from 'react-toastify';

const ChangePassword = ({ onClose, userId, onSuccess }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!password) return toast.error("Please enter a new password");
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        const res = await changePasswordApi({ id: userId, password });
        if (res.success) {
            toast.success(res.message);
            onSuccess();
            onClose();
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    }

    return (
        <div className="bg-(--bg-box) rounded-4xl shadow-2xl p-8 w-100 mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-center flex justify-center items-center">
                    <Heading title={"Change Password"} />
                </div>
                <button onClick={onClose}>
                    <RxCrossCircled
                        className="bg-(--bs-btn-second) text-(--text-white) rounded-full cursor-pointer"
                        size={28}
                    />
                </button>
            </div>

            <div className="space-y-5">
                <InputField
                    label="New Password"
                    placeholder="Enter new password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    RightIcon={
                        <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-700">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    }
                />

                <InputField
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    RightIcon={
                        <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-700">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    }
                />
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Button
                    title="Cancel"
                    onClick={onClose}
                    className="p-1.5 px-5 text-sm rounded-sm shadow-xl bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                />

                <Button
                    title={loading ? "Updating..." : "Update Password"}
                    onClick={handleSubmit}
                    className="bg-(--bs-btn-third) p-1.5 px-5 text-sm rounded-sm shadow-xl text-white hover:opacity-90 transition-opacity"
                />
            </div>
        </div>
    )
}

export default ChangePassword
