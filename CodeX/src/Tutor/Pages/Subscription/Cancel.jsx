import React from 'react';

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-white text-black rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">Your payment process was cancelled. Please try again.</p>
        <a
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Cancel;
