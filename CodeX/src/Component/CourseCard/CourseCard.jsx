// src/Component/CourseCard.jsx
import React from "react";
import { motion } from "framer-motion";

const CourseCard = ({ course, onClick }) => {
  const levelBadgeColor = {
    beginer: "bg-green-500/90",
    intermediate: "bg-yellow-500/90",
    advanced: "bg-red-500/90",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative flex flex-col h-[350px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-green-500/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-green-400/30 transition-all duration-500 group"
    >
      {/* Neon Blur Bubble */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-green-400/10 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

      <div className="p-6 flex-grow z-10">
        {/* Level Badge */}
        <span
          className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-xl text-white backdrop-blur-md animate-pulse ${
            levelBadgeColor[course.level.toLowerCase()] || "bg-gray-400/90 text-black"
          }`}
        >
          {course.level}
        </span>

        {/* Title */}
        <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
          {course.title}
        </h3>

        {/* Course Details */}
        <div className="space-y-3 mb-4 text-sm text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Category:</span>
            <span className="text-white bg-gray-800/50 px-2 py-0.5 rounded-md">
              {course.category}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Instructor:</span>
            <span className="text-white">{course.created_by}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Price:</span>
            <span className="text-green-400 font-bold text-base">
              ₹{course.price}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Created:</span>
            <span className="text-gray-300">
              {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-6 pt-0 mt-auto bg-gradient-to-t from-black via-transparent to-transparent z-10">
        <button
          onClick={() => onClick(course.id)}
          className="w-full bg-green-500/10 hover:bg-green-600/80 text-green-300 hover:text-white border border-green-400 rounded-xl font-semibold py-3 transition-all duration-300 hover:shadow-xl backdrop-blur-lg"
        >
          🚀 View Course
        </button>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-10 pointer-events-none"></div>
    </motion.div>
  );
};

export default CourseCard;
