import React from 'react'
import BackgroundAnimation from '../../../Component/BackgroundAnimation'
import Navbar from '../Navbar/Navbar'

const Subscription = () => {
  return (
    <>
        <Navbar/>
        <BackgroundAnimation/>
        <div className="flex flex-col h-screen text-white relative z-10">

  {/* Content */}
  <div className="flex-grow flex items-center justify-center p-8">
    <div className="max-w-4xl w-full">
      {/* Step 3: Select Plan */}
      <div className="text-center mt-20">
        <h2 className="text-5xl font-bold text-green-400 mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-lg cursor-pointer transition transform hover:scale-105 border-2 border-gray-700 bg-gray-800 hover:border-green-400 bg-opacity-20" style={{height: "400px"}}>
            <h3 className="text-xl font-bold">Basic</h3>
            <p className="text-gray-400 my-2">Basic features for personal use</p>
            <div className="text-3xl font-bold">
              $10/<span className="text-sm text-gray-400">month</span>
            </div>
            <div className="mt-6 flex justify-center">
            <button className="bg-green-500 w-full hover:bg-green-600 px-3 py-1 rounded text-white font-medium transition text-sm" style={{marginTop:"170px"}}>
                Subscribe
            </button>
            </div>
          </div>
          <div className="p-6 rounded-lg cursor-pointer transition transform hover:scale-105 border-2 border-gray-700 hover:border-green-400 bg-opacity-20">
            <h3 className="text-xl font-bold">Medium</h3>
            <p className="text-gray-400 my-2">All features for professionals</p>
            <div className="text-3xl font-bold">
              $30/<span className="text-sm text-gray-400">month</span>
            </div>
            <div className="mt-6 flex justify-center">
            <button className="bg-green-500 w-full hover:bg-green-600 px-3 py-1 rounded text-white font-medium transition text-sm" style={{marginTop:"170px"}}>
                Subscribe
            </button>
            </div>
          </div>
          <div className="p-6 rounded-lg cursor-pointer transition transform hover:scale-105 border-2 border-gray-700 bg-green-500 hover:border-green-400 bg-opacity-20">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-gray-400 my-2">Custom solutions for teams</p>
            <div className="text-3xl font-bold">
              $99/<span className="text-sm text-gray-400">month</span>
            </div>
            <div className="mt-6 flex justify-center">
            <button className="bg-green-500 w-full hover:bg-green-600 px-3 py-1 rounded text-white font-medium transition text-sm" style={{marginTop:"170px"}}>
                Subscribe
            </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default Subscription
