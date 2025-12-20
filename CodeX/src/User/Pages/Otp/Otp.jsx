import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { otpTime, setOtpTime } from "../../../redux/slices/userSlice";
import { userAxios } from "../../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SchoolIcon from "@mui/icons-material/School";
import MailLockIcon from "@mui/icons-material/MailLock";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Loading from "../../Components/Loading/Loading";


const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false)
  const seconds = useSelector((state) => state.user.second);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };


  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    setEmail(emailFromStorage);

    let expireAt = localStorage.getItem("otpExpireTime");
    if (!expireAt) {
      const newExpireAt = Date.now() + 120 * 1000;
      localStorage.setItem("otpExpireTime", newExpireAt.toString());
      expireAt = newExpireAt;
    }

    const remaining = Math.floor((+expireAt - Date.now()) / 1000);
    if (remaining > 0) {
      dispatch(otpTime(remaining));
      setExpired(false);
    } else {
      dispatch(otpTime(0));
      setExpired(true);
    }
  }, [dispatch]);

  // ✅ Countdown logic
  useEffect(() => {
    if (seconds <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      dispatch(otpTime(seconds - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, dispatch]);


  const handleResend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const response = await userAxios.post("resend-otp/", { email });
      toast.success(response.data.message || "OTP has been resent!");
      const expireAt = Date.now() + 120 * 1000;
      localStorage.setItem("otpExpireTime", expireAt.toString());
      dispatch(setOtpTime());
      setExpired(false);
    } catch (error) {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false)
    }
  };

  // ✅ Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      
      await userAxios.post("verify-otp/", { otp, email });
      toast.success("Your Account Activated Successfully. Please Login!");
      dispatch(otpTime(0));
      localStorage.removeItem("otpExpireTime");
      setOtp("");
      setExpired(false);
      dispatch(setOtpTime());
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
    {loading ? (
      <Loading />
    ):(
    <div className="h-screen flex overflow-hidden bg-black">
      {/* Left Side - Branding */}
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
              <MailLockIcon sx={{ fontSize: 70 }} className="text-black" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold mb-4"
          >
            <span className="text-white">Verify</span>
            <span className="text-green-500">OTP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 text-center max-w-md"
          >
            Secure your account with one-time verification and complete your
            signup process.
          </motion.p>

          <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
            <FeatureCard
              icon={<AccessTimeIcon sx={{ fontSize: 40 }} />}
              title="120s Timer"
              delay={0.5}
            />
            <FeatureCard
              icon={<VerifiedIcon sx={{ fontSize: 40 }} />}
              title="Instant Verify"
              delay={0.6}
            />
            <FeatureCard
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Join Codex"
              delay={0.7}
            />
            <FeatureCard
              icon={<MailLockIcon sx={{ fontSize: 40 }} />}
              title="Secure Access"
              delay={0.8}
            />
          </div>
        </div>
      </motion.div>

      {/* Right Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-black">
        <motion.div
          className="w-full h-full flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 w-full">
            <button
              onClick={() => navigate("/signup")}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors group"
            >
              <KeyboardBackspaceIcon className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Signup</span>
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-5xl font-bold mb-2">
                <span className="text-green-500">OTP</span>{" "}
                <span className="text-white">Verification</span>
              </h2>
              <p className="text-gray-400 text-lg">
                A verification code was sent to{" "}
                <span className="text-green-500 font-semibold">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-4 bg-black border border-green-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />

              <div className="text-center text-sm text-gray-400 font-mono">
                {seconds > 0 ? (
                  <span>
                    Resend OTP in{" "}
                    <span className="text-green-400 font-bold">{seconds}s</span>
                  </span>
                ) : (
                  <span className="text-green-400">
                    You can resend the OTP now
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={expired}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                Verify OTP
              </button>
            </form>

            <div className="text-center text-sm mt-6 text-gray-400">
              Didn’t receive the code?{" "}
              <button
                onClick={handleResend}
                className="text-green-400 hover:text-green-300 hover:underline font-semibold"
              >
                Resend now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    )}
    </>
  );
};

// ✅ FeatureCard for left section
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

export default OTPVerification;
