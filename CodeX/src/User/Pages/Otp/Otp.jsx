import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { otpTime, setOtpTime } from "../../../redux/slices/userSlice";
import { userAxios } from "../../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";

const OTPVerification = () => {
  const [otp, setOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [expired, setExpired] = useState(false);
  const seconds = useSelector((state) => state.user.second);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // ✅ Countdown timer
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

  // ✅ Resend OTP
  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const response = await userAxios.post("resend_otp/", { email });
      toast.success(response.data.message || "OTP has been resent!");

      const expireAt = Date.now() + 120 * 1000;
      localStorage.setItem("otpExpireTime", expireAt.toString());
      dispatch(setOtpTime()); // reset to 120
      setExpired(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to resend OTP.");
    }
  };

  // ✅ Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAxios.post("verify_otp/", { otp, email });
      toast.success("Your Account Activated Successfully. Please Login!");
      dispatch(otpTime(0));
      localStorage.removeItem("otpExpireTime");
      setOtp("");
      setExpired(false);
      dispatch(setOtpTime());
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Invalid OTP.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundAnimation />
      <div className="p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10 border-2 border-green-500">
        <h2 className="text-white text-4xl font-extrabold text-center mb-4">
          Enter Your <span className="text-green-500">OTP</span>
        </h2>
        <div className="text-white text-xl font-extrabold font-mono mb-4 text-center">
          {seconds > 0
            ? `Resend OTP in ${seconds}s`
            : "You can resend the OTP now"}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-lg">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-400 appearance-none"
              placeholder="Enter OTP"
              style={{ width: "600px" }}
            />
          </div>
          <div className="flex gap-4 justify-center">
            {expired === true ? (
              <button
                type="button"
                onClick={handleResend}
                className="px-6 py-2.5 border text-lg border-green-500 text-white font-extrabold rounded-lg hover:bg-green-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Resend
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 border text-lg border-green-500 text-white font-extrabold rounded-lg hover:bg-green-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
