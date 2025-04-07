import React, { useState } from 'react'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-6xl font-extrabold text-white">CodeX</span>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-white p-2 rounded-md text-black focus:outline-none"
          />
          <div className="flex space-x-2">
            <button className="bg-white p-2 rounded-full">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            
          </div>
          <div className="flex items-center space-x-2 bg-white p-2 rounded-md">
            <span className="text-black"><AccountCircleIcon/></span>
          </div>
        </div>
      </div>
  )
}

export default Navbar
