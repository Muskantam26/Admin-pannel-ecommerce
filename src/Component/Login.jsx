import React, { useState } from "react";
import { MainHeading } from "./Heading";
import { InputField } from "./InputBox";
import Button from "./Btn";
// import PageLoader from './Pageloader'
import { adminLoginApi } from "../api/auth-api";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/slice/loadingSlice";
import { emailValidator, passwordValidator } from "../utils/inputValidator";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  // const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "Test@123",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
   
    dispatch(showLoader());
    try {
      // loginUser({
      //     token: "1234567890",
      //     userId: "1",
      //     role: "SUPER_ADMIN",
      //     name: "admin",
      //     email: "[EMAIL_ADDRESS]",
      //   }),
      const response = await adminLoginApi(formData);
      dispatch(
        loginUser({
          token: response?.data?.token,
          userId: response?.data?.id,
          role: response?.data?.role,
          name: response?.data?.name,
          email: response?.data?.email,
        }),
      );
      toast.success("Welcome Back Admin!")
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!")
    } finally {
      dispatch(hideLoader());
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailErr = emailValidator(formData.email);
    const passwordErr = passwordValidator(formData.password);
    if (emailErr) {
      newErrors.email = emailErr;
    }
    if (passwordErr) {
      newErrors.password = passwordErr;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      {/* {loading && <PageLoader/>}  */}
      <div className="relative w-full h-screen bg-gray-50 overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"
            alt="Modern Office Background"
            className="w-full h-full object-cover opacity-100"
          />

          <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-white/20"></div>
        </div>

        <div className="relative z-10 flex h-full">
          <div className="w-full md:w-125 h-full grediant-img backdrop-blur-xl border-r border-white/50 flex flex-col justify-center p-8 md:p-12 shadow-[10px_0_30px_rgba(0,0,0,0.05)]">
            {/* Logo Area */}
            <div className="mb-10">
              <div className="w-12 h-12 bg-(--btn-hover) rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back.
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Log in to your dashboard.
              </p>
            </div>

            {/* The Form */}
            <div className="space-y-6">
              <div className="group">
                <label className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                  Email
                </label>
                <InputField
                  placeholder="name@company.com"
                  value={formData.email}
                  name="email"
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 placeholder:text-gray-400"
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="group">
                <label className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                  Password
                </label>
                <InputField
                  placeholder="••••••••••••"
                  name="password"
                  value={formData.password}
                  type="password"
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 placeholder:text-gray-400"
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <div className="flex justify-end mt-2">
                  <a
                    href="#"
                    className="text-xs font-semibold text-(--text-main) hover:text-indigo-800 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                title={"Sign In"}
                className="w-full py-4 bg-(--btn-hover) hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-300 tracking-wide"
                onClick={handleSubmit}
              />
            </div>

            {/* Footer / Social */}
          </div>

          <div className="hidden lg:flex flex-1 flex-col justify-end p-20 pb-40 relative">
            <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <span className="h-px w-10 bg-indigo-600"></span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  Market Leader
                </span>
              </div>

              <h2 className="text-6xl font-bold text-(--text-main) leading-tight mb-6 drop-shadow-sm">
                Build the Future <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  Without Limits.
                </span>
              </h2>

              <p className="text-(--text-second) text-lg max-w-lg leading-relaxed font-medium">
                Join the world's most powerful platform for developers. Scale
                your business with enterprise-grade security and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
