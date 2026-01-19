import React, { useState } from "react";
import Mail from "../../../assets/MailBox.jpg";
import { userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import { Flag } from "lucide-react";
import Loading from "../../Components/Loading/Loading";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!email) {
        toast.error("Please Enter Valid Email");
        return;
      }

      setLoading(true);
      await userAxios.post(`forgot-password/${email}/`);
      toast.success("📧 Password reset email sent successfully!");
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "❌ Failed to send password reset email. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BackgroundAnimation />
          <div className="min-h-screen flex items-center justify-center">
            <div className="border border-green-500 p-8 rounded-lg w-full max-w-md shadow-lg font-serif">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Forgot Password
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 htmlFor="email" className="block text-white mb-1">
                    Email
                  </h3>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-md bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 font-medium text-base disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
                  onClick={handleSubmit}
                >
                  Send Mail
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {isModalOpen === true ? (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black" aria-hidden="true" />

          <div className="fixed w-full h-full inset-0 flex items-center justify-center ">
            <div className=" bg-black text-center justify-center">
              <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(false)}>
                  <span className="text-white hover:text-red-400">X</span>
                </button>
              </div>

              <img
                src={
                  Mail ||
                  "https://i.pinimg.com/736x/74/33/cf/7433cf7810f0a1905a634a215211a85f.jpg"
                }
                alt="Check Email"
                className="mx-auto mb-4 w-40"
              />

              <h2 className="text-4xl font-bold text-white mb-2">
                Email Sent Successfully
              </h2>
              <p className="text-gray-300 mb-1 ">To : {email}</p>
              <p className="text-md text-gray-400">
                We've sent a password reset link to your email. Follow the
                instructions there to reset your password.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </>
  );
};

export default ForgotPassword;
