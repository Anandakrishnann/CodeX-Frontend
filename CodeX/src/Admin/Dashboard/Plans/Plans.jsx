import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const Plans = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <Navbar/>
          <div className="grid grid-cols-4 gap-6">
            {/* Sidebar */}
            
            <Sidebar />
    
            {/* Main Content Area */}
            <div className="col-span-3 grid grid-rows-3 gap-6">
              {/* Overview Section */}
              <div className="row-span-1 p-4 rounded-lg ">
                <div className="flex">
                <h2 className="text-4xl font-extrabold mb-6">Subscription Plans</h2>
                <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-6 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"100px", marginLeft:"610px"}}>Create</button>

                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                    <h2 className="text-2xl font-extrabold mb-6">BASIC</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Income</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}} onClick={() => setIsModalOpen(true)}>Edit</button>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                  <h2 className="text-2xl font-extrabold mb-6">PRO</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Spending</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}}>Edit</button>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                  <h2 className="text-2xl font-extrabold mb-6">PREMIUM</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Net Profit</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isModalOpen && (
          <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{height:"420px"}}>
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-2xl text-black font-semibold mb-4 relative z-10">Edit Plan</h2>
              <div><label className="block text-gray-600">First Name</label><input name='first_name' type="text"  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10"  /></div>
              <div><label className="block text-gray-600">Last Name</label><input name='last_name' type="text"  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10"  /></div>
              <div><label className="block text-gray-600">Phone</label><input name='phone' type="text"  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10"  /></div>
              <div><label className="block text-gray-600">Leetcode Id</label><input name='leetcode_id' type="text"  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10"  /></div>
              <button
                className="absolute end right text-xl font-bold text-white hover:bg-red-600 bg-red-800 m-3 p-1 mt-4 rounded-md"
                onClick={() => setIsModalOpen(false)}

              >
                Cancel

              </button>       
              <button
                className="absolute end-2 right-2 text-xl font-bold text-white hover:bg-green-600 m-4 p-1 rounded-md bg-green-800"
                onClick={() => setIsModalOpen(false)}
              >
                Submit

              </button>       
            </div>
          </div>
        )}
        </div>
      );
}

export default Plans
