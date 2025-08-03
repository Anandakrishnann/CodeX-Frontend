"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Home, LayoutDashboard, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";


const OrderSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path)
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-600/5 to-transparent rounded-full animate-spin-slow" />
      </div>

      {/* Floating Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-500 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  x: Math.random() * window.innerWidth,
                  opacity: 0,
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-zinc-900/90 via-black/95 to-zinc-900/90 backdrop-blur-xl border border-green-600/30 rounded-3xl p-12 text-center shadow-2xl">
          {/* Success Icon */}
          <motion.div
            className="relative flex justify-center items-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
          >
            <motion.div
              className="absolute w-32 h-32 border-2 border-green-500/30 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-24 h-24 border-2 border-green-500/50 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-full shadow-lg">
              <CheckCircle size={48} className="text-white drop-shadow-lg" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={20} className="text-green-400" />
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent mb-4 tracking-tight">
              Order Confirmed!
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                >
                  <Star size={16} className="text-green-500 fill-green-500" />
                </motion.div>
              ))}
            </div>
            <p className="text-xl text-gray-300 font-medium">Thanks for your purchase!</p>
          </motion.div>

          {/* Course Info Box */}
          <motion.div
            className="bg-gradient-to-r from-green-600/10 to-green-500/10 border border-green-600/20 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-white text-lg font-semibold mb-2">🎉 Course purchased successfully!</p>
            <p className="text-gray-300">
              Your course has been added to your dashboard. Start your learning journey now!
            </p>
          </motion.div>

          

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.button
              className="flex-1 group relative overflow-hidden bg-transparent border-2 border-green-600/50 text-green-400 hover:text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-600/25"
              onClick={() => handleNavigation("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <Home size={20} />
                <span>Go to Home</span>
              </div>
            </motion.button>

            <motion.button
              className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-600/50 hover:from-green-500 hover:to-green-400"
              onClick={() => handleNavigation("/user-dashboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative flex items-center justify-center gap-2">
                <LayoutDashboard size={20} />
                <span>Go to Dashboard</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Sparkle Line */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-green-600/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-green-600/50" />
          <Sparkles size={16} />
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-green-600/50" />
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
