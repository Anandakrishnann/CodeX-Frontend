import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAxios } from "../../../../axiosConfig";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

const Signup = () => {
  const [formData, setFormdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      toast.error("Email is invalid");
    }

    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required";
      toast.error("First name is required");
    } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
      tempErrors.firstName = "First name can only contain letters";
      toast.error("First name can only contain letters");
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
      toast.error("Last name is required");
    } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
      tempErrors.lastName = "Last name can only contain letters";
      toast.error("Last name can only contain letters");
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
      toast.error("Phone number is required");
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number is invalid";
      toast.error("Phone number is invalid");
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      toast.error("Password must be at least 8 characters");
    } else if (
      !/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(
        formData.password
      )
    ) {
      tempErrors.password =
        "Password must contain uppercase, lowercase, digit, and special character";
      toast.error(tempErrors.password);
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("userEmail", formData.email);
      const expireAt = Date.now() + 120 * 1000;
      localStorage.setItem("otpExpireTime", expireAt.toString());

      try {
        const response = await userAxios.post("signup/", {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
        });

        toast.success("OTP successfully sent to your email!");
        navigate("/otp");
      } catch (error) {
        if (error.response) {
          Object.entries(error.response.data).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`);
          });
        } else if (error.request) {
          toast.error("No response from server.");
        } else {
          toast.error("Request setup failed.");
        }
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      {/* Left Side - Branding (Same as Login) */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={slideFromLeft}
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

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
            Start your journey and learn with world-class instructors
          </motion.p>

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

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-black">
        <motion.div
          className="w-full h-full flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 w-full">
            <button
              onClick={() => navigate("/")}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors group"
            >
              <KeyboardBackspaceIcon className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-2">
                <span className="text-green-500">Create</span>{" "}
                <span className="text-white">Account</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-green-500 hover:text-green-400 cursor-pointer font-semibold"
                >
                  Log In
                </span>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <InputField
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <InputField
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <InputField
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </button>
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

const InputField = ({ name, type = "text", placeholder, value, onChange }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 bg-black border border-green-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
    />
  </div>
);

export default Signup;
