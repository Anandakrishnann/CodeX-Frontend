import React, { useState } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { userAxios } from '../../../../axiosConfig'
import BackgroundAnimation from '../../../Component/BackgroundAnimation'
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormdata] = useState({
    firstName: '',
    lastName: '',
    email: '',
    leetcodeId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    let tempErrors = {}

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required'
      toast.error('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid'
      toast.error('Email is invalid')
    }

    if (!formData.firstName.trim()) {
      tempErrors.firstName = 'First name is required'
      toast.error('First name is required')
    } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
      tempErrors.firstName = 'First name can only contain letters'
      toast.error('First name can only contain letters')
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = 'Last name is required'
      toast.error('Last name is required')
    } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
      tempErrors.lastName = 'Last name can only contain letters'
      toast.error('Last name can only contain letters')
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = 'Phone number is required'
      toast.error('Phone number is required')
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone number is invalid'
      toast.error('Phone number is invalid')
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required'
      toast.error('Password is required')
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters'
      toast.error('Password must be at least 8 characters')
    } else if (
      !/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(
        formData.password
      )
    ) {
      tempErrors.password =
        'Password must contain uppercase, lowercase, digit, and special character'
      toast.error(tempErrors.password)
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match'
      toast.error('Passwords do not match')
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      localStorage.setItem('userEmail', formData.email)
      try {
        const response = await userAxios.post('signup/', {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          leetcode_id: formData.leetcodeId,
          phone: formData.phoneNumber,
          password: formData.password
        })

        toast.success('OTP successfully sent to your email!')
        navigate('/otp')
      } catch (error) {
        if (error.response) {
          Object.entries(error.response.data).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`)
          })
        } else if (error.request) {
          toast.error('No response from server.')
        } else {
          toast.error('Request setup failed.')
        }
      }
    }
  }

  const login = () => {
    navigate('/login')
  }

  return (
    <div className="h-full overflow-hidden flex justify-center items-center px-2">
      <BackgroundAnimation />
      <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
      <div className="w-full h-screen max-w-md relative z-10 mt-5 sm:mt-0">
        <div className="w-full p-8 rounded-lg shadow-lg  border border-green-500">
          <h2 className="text-5xl font-bold mb-3 text-green-500 text-start">Register.</h2>
          <span className="text-base sm:text-lg text-white mb-3 text-start block">
            Already have an Account?{' '}
            <span onClick={login} className="text-blue-500 cursor-pointer">
              Log In
            </span>
          </span>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="text"
                name="leetcodeId"
                value={formData.leetcodeId}
                onChange={handleChange}
                placeholder="Leetcode ID"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg font-mono"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <button
                type="submit"
                className="w-full p-3 bg-white text-2xl font-extrabold text-black rounded-md hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

export default Signup
