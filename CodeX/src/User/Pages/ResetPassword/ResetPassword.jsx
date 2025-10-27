import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!password) {
        toast.error("Please Enter Password");
        return;
      }

      if (!confirmPassword) {
        toast.error("Please Enter Confirm Password");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Password Does Not Match");
        return;
      }

      await userAxios.post(`reset_password/${uid}/${token}/`, { password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg font-serif">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>

        <div className="space-y-4">
          <h3 htmlFor="password" className="block text-white mb-1">
            New Password
          </h3>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h3 htmlFor="confirm_password" className="block text-white mb-1">
            Confirm New Password
          </h3>
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white text-xl rounded-md hover:bg-green-600 transition-colors duration-200 font-medium text-base disabled:bg-zinc-800 disabled:text-zinc-500 mt-4 cursor-pointer"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
