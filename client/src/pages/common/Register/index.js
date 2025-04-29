import { Form, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../../assets/logo.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </Form.Item>
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
            Register
          </button>
          <div className="text-center text-sm">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 underline hover:text-blue-400 font-normal">
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
