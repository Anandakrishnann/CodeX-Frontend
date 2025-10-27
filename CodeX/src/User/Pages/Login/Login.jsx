import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  loginUser,
  setPurchasedCourses,
} from "../../../redux/slices/userSlice";
import { userAxios } from "../../../../axiosConfig";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fetchCourses = async () => {
    try {
      const response = await userAxios.get("enrolled_courses/");
      console.log("course purchased requestes data", response.data);

      dispatch(setPurchasedCourses(response.data));
    } catch (error) {
      console.log(error || "Error While Loading Courses");
    }
  };

  const login = async () => {
    try {
      const verified = await userAxios.get(`google_verified/${email}/`);
      console.log("verified.status", verified.status);
      console.log("verified.data", verified.data); // Log the response data

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
          console.log("user role", user.role);

          if (user.role?.trim().toLowerCase() === "admin") {
            setTimeout(() => {
              navigate("/admin/dashboard");
            }, 10);
          } else if (user.role?.trim().toLowerCase() === "tutor") {
            console.log("tutor logined")
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
    <>
      <div className="h-screen overflow-hidden flex justify-center items-center px-2">
        <BackgroundAnimation />
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="relative z-10 w-full max-w-md mt-5 sm:mt-0">
            <div className="w-full p-8 rounded-lg shadow-lg  border border-green-500">
              <h2 className="text-5xl font-bold mb-3 text-green-500 text-start">
                Welcome <span className="text-white">Back.</span>
              </h2>
              <span className="text-1xl text-white mb-3 text-start block">
                Don't have an Account?{" "}
                <span onClick={signup} className="text-blue-500 cursor-pointer">
                  Sign Up
                </span>
              </span>

              <div className="space-y-4 mt-4">
                <input
                  className="w-full p-3 border border-green-500 bg-black text-white  text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full p-3 border border-green-500 bg-black text-white  text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-right">
                  <h1
                    className="text-blue-500 text-sm sm:text-base cursor-pointer"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </h1>
                </div>
                <button
                  onClick={login}
                  className="w-full p-2 bg-green-500 text-2xl font-extrabold text-white rounded-md hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  Log In
                </button>

                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
                <div className="text-center">
                  <button className="text-white text-md md:text-base cursor-pointer ">
                    <span
                      className="rounded-full bg-black"
                      onClick={() => navigate("/")}
                    >
                      <KeyboardBackspaceIcon
                        fontSize="large"
                        className="text-white pr-2"
                      />
                      Go Back
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
