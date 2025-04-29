import React, { useState } from "react";
import { Form, message } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, getUserInfo } from "../../../apicalls/users";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../../assets/logo.png";

function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        const userResponse = await getUserInfo();
        if (userResponse.success) {
          const isAdmin = userResponse.data.isAdmin;
          window.location.href = isAdmin ? "/dashboard" : "/";
        } else {
          message.error("Failed to get user info.");
          window.location.href = "/";
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-4 mt-4">
          <img src={logo} alt="Logo" className="w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-blue-600">QuizPlatform</h2>
        </div>
        <Form layout="vertical" onFinish={onFinish} className="space-y-6">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          </Form.Item>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-400 font-normal">
              Sign Up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
