import React, { useState } from "react";
import Mail from "../../../assets/MailBox.jpg";
import { userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!email) {
        toast.error("Please Enter Valid Email");
        return;
      }

      await userAxios.post(`forgot_password/${email}/`);
      toast.success("📧 Password reset email sent successfully!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("❌ Failed to send password reset email. Please try again.");
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg font-serif">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Forgot Password
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-[#2c2c2c] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 font-medium text-base disabled:bg-zinc-800 disabled:text-zinc-500"
              onClick={handleSubmit}
            >
              Send Mail
            </button>
          </div>
        </div>
      </div>
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
