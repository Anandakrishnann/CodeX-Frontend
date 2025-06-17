import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircle } from 'lucide-react';
import BackgroundAnimation from '../../../Component/BackgroundAnimation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      <BackgroundAnimation />
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <motion.div
        className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-green-600 shadow-[0_0_60px_rgba(34,197,94,0.4)] backdrop-blur-2xl rounded-3xl p-10 w-full max-w-xl text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glowing Check Icon */}
        <div className="relative flex justify-center items-center mb-6">
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-green-600 blur-xl opacity-30 animate-ping"
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 1 }}
          />
          <CheckCircle size={72} className="text-green-500 drop-shadow-lg z-10" />
        </div>

        <h1 className="text-4xl font-black text-white mb-2 tracking-wide">Order Confirmed!</h1>
        <p className="text-gray-200 text-lg mb-1 font-medium">Thanks for your purchase</p>

        <motion.p
          className="text-white text-md font-semibold my-4 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
           Course purchased successfully! It's now added to your dashboard.
          <br />  Visit your dashboard to access it and start learning!
        </motion.p>

        {user.email && (
          <p className="text-sm text-gray-400 mb-6 italic">
            <span className="text-green-500">{user.email}</span>
          </p>
        )}

        <div className="flex gap-4 mt-4">
          <button className="flex-1 bg-transparent border border-green-600 text-green-400 hover:bg-green-600 hover:text-black font-semibold py-2 rounded-xl transition duration-300 shadow-md"
          onClick={() => navigate('/')}
          >
            Go to Home
          </button>
          <button className="flex-1 bg-transparent border border-green-600 text-green-400 hover:bg-green-500 hover:text-black font-bold py-2 rounded-xl transition duration-300 shadow-lg"
          onClick={() => navigate('/user-dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
