import React, { useState } from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../redux/slices/userSlice'
import { userAxios } from '../../../../axiosConfig'
import BackgroundAnimation from '../../../Component/BackgroundAnimation'
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import google from "../../../assets/google.png"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const login = async () => {
    try {
      const response = await userAxios.post("login/", { email, password });

      if (response.status === 200) {
        const user = response.data.user
        dispatch(loginUser(user));
        toast.success("Login Successful!");
      }
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    }
  }

  const signup = () => {
    navigate('/signup')
  }

  const logout = () => {
    dispatch(logoutUser())
    userAxios.post('logout/')
    navigate('/login')
  }

  return (
    <>
      <div className="h-screen overflow-hidden flex justify-center items-center px-2">
        <BackgroundAnimation />
        <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="relative z-10 w-full max-w-md mt-5 sm:mt-0">
          <div className="w-full p-8 rounded-lg shadow-lg  border border-green-500">
            <h2 className="text-5xl font-bold mb-3 text-green-500 text-start">
              Welcome <span className='text-white'>Back.</span>
            </h2>
            <span className='text-1xl text-white mb-3 text-start block'>
              Don't have an Account? <span onClick={signup} className='text-blue-500 cursor-pointer'>Sign Up</span>
            </span>

            <div className="space-y-4">
              <input
                className="w-full p-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right">
                <h1 className='text-white text-sm sm:text-base cursor-pointer'>Forgot password?</h1>
              </div>
              <button
                onClick={login}
                className="w-full p-2 bg-white text-2xl font-extrabold text-black rounded-md hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                Log In
              </button>
              <button
                className="w-full p-2 bg-white text-sm sm:text-base rounded-full font-bold text-black flex items-center justify-center gap-2 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
                onClick={logout}
              >
                <img src={google} className='w-6 h-6 rounded-full' alt="Google logo" />
                Sign in with Google
              </button>
              <div className="text-center">
                <button className='text-white text-md md:text-base cursor-pointer '><span className='rounded-full bg-black' onClick={() => navigate('/')}><KeyboardBackspaceIcon fontSize='large' className='text-white pr-2'/>Go Back</span></button>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </>
  )
}

export default Login
