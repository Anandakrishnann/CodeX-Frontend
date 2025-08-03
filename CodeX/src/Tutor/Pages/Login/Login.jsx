import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const response = await userAxios.post("login/", { email, password });

      console.log("Login successful:", response.data);
      if (response.status === 200) {
        dispatch(loginUser(response.data.user));
        toast.success("Login Successful!");
        if(response.data.user.role === "tutor"){
          navigate("/tutor")
        }
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const signup = () => {
    navigate("/signup");
  };

  return (
    <>
      <div className="h-screen overflow-hidden flex">
        <div className="w-1/2 bg-black">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/736x/b7/84/c6/b784c69e68438962d492143b87b6cb3b.jpg"
            alt="Login background"
          />
        </div>
        <div className="w-1/2 bg-black flex justify-center items-center">
          <div className="w-full max-w-md p-8  rounded-lg shadow-lg">
            <h2 className="text-5xl font-bold mb-3 text-white text-start">
              Welcome Back.
            </h2>
            <span className="text-1xl text-white mb-3 text-start block">
              Dont have an Account ?{" "}
              <span onClick={signup} className="text-blue-500 cursor-pointer">
                Sign Up
              </span>
            </span>
            <div className="space-y-4">
              <input
                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono font-bold"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <h1 className="text-white ml-60 cursor-pointer">
                forgot password?
              </h1>
              <button
                onClick={login}
                className="w-full p-1 bg-white text-2xl font-extrabold text-black rounded-md hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                Log In
              </button>
              {/* <button 
            className="w-full p-3 bg-white text-1xl rounded-full font-bold text-black flex items-center justify-center gap-2 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
            >
            <img src="https://i.pinimg.com/736x/c8/b8/12/c8b8129127bada9fa699aeba388b3b2b.jpg" className='w-6 h-6 rounded-full' alt="Google logo" />
            Sign in with Google
            </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
