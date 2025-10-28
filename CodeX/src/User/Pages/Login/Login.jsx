import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  loginUser,
  setPurchasedCourses,
} from "../../../redux/slices/userSlice";
import { userAxios } from "../../../../axiosConfig";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fetchCourses = async () => {
    try {
      const response = await userAxios.get("enrolled_courses/");
      dispatch(setPurchasedCourses(response.data));
    } catch (error) {
      console.log(error || "Error While Loading Courses");
    }
  };

  const login = async () => {
    try {
      const verified = await userAxios.get(`google_verified/${email}/`);

      if (verified.status === 201) {
        toast.error(
          verified.data.error ||
            "⚠️ Unable to log you in. Please sign in using your Google account to continue."
        );
        return;
      }

      if (verified.status === 200) {
        const response = await userAxios.post("login/", { email, password });

        if (response.status === 200) {
          const user = response.data.user;
          dispatch(loginUser(user));
          fetchCourses();
          toast.success("Login successful! Welcome back.");

          if (user.role?.trim().toLowerCase() === "admin") {
            setTimeout(() => {
              navigate("/admin/dashboard");
            }, 10);
          } else if (user.role?.trim().toLowerCase() === "tutor") {
            navigate("/tutor");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ Invalid email or password. Please try again.");
    }
  };

  const signup = () => {
    navigate("/signup");
  };

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;

    if (!token || typeof token !== "string") {
      console.error(
        "Frontend Debug: ❌ Invalid token received from Google OAuth:",
        token
      );
      return;
    }

    try {
      const response = await userAxios.post(
        "google-login/",
        { token },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const user = response.data.user;
        dispatch(loginUser(user));
        fetchCourses();
        toast.success("Google Login Successful!");
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Frontend Debug: Google login error from backend:",
        error.response?.data || error.message || error
      );
      toast.error(
        error.response?.data?.error || "Google login failed. Please try again."
      );
    }
  };

  const handleError = () => {
    console.error(
      "Frontend Debug: Google Login Failed: onError callback fired."
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      {/* Left Side - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={slideFromLeft}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
              <SchoolIcon sx={{ fontSize: 80 }} className="text-black" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold mb-4"
          >
            <span className="text-white">Code</span>
            <span className="text-green-500">X</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 text-center max-w-md"
          >
            Unlock your potential with world-class courses from expert instructors
          </motion.p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
            <FeatureCard
              icon={<MenuBookIcon sx={{ fontSize: 40 }} />}
              title="1000+ Courses"
              delay={0.5}
            />
            <FeatureCard
              icon={<PeopleIcon sx={{ fontSize: 40 }} />}
              title="Expert Tutors"
              delay={0.6}
            />
            <FeatureCard
              icon={<EmojiObjectsIcon sx={{ fontSize: 40 }} />}
              title="Learn Anytime"
              delay={0.7}
            />
            <FeatureCard
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Certificates"
              delay={0.8}
            />
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-black">
        <motion.div
          className="w-full h-full flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Back Button */}
          

          {/* Form Container */}
          <div className=" backdrop-blur-sm  rounded-3xl shadow-2xl p-8 lg:p-12 w-full">
            <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors group"
          >
            <KeyboardBackspaceIcon className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-2">
                <span className="text-green-500">Welcome</span>{" "}
                <span className="text-white">Back</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Don't have an account?{" "}
                <span
                  onClick={signup}
                  className="text-green-500 hover:text-green-400 cursor-pointer font-semibold"
                >
                  Sign Up
                </span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); login(); }}>
              {/* Email Input */}
              <div>
                <span className="block text-sm font-semibold text-white mb-3">
                  Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-4 bg-black border border-green-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>

              {/* Password Input */}
              <div>
                <span className="block text-sm font-semibold text-white mb-3">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-4 bg-black border border-green-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-green-500 hover:text-green-400 text-sm font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={login}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Log In
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-300 cursor-pointer group"
  >
    <div className="text-green-500 mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-white font-semibold text-lg">{title}</h3>
  </motion.div>
);

export default Login;