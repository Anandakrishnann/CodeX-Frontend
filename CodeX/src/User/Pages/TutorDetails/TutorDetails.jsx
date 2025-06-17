import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { userAxios } from "../../../../axiosConfig";
import { IoStar } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoMdStarOutline } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { setCourseId } from "../../../redux/slices/userSlice";

const CourseDetails = () => {
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const tutor_id = useSelector((state) => state.user.tutorId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await userAxios.get(`tutor_details/${tutor_id}/`);
      setTutor(response.data.tutor);
      console.log(response.data.tutor);

      setCourses(response.data.courses);
    } catch (error) {
      console.log(error || "Error While Fetching Course Details");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [tutor_id]);

  const handleCourseView = (courseId) => {
    dispatch(setCourseId(courseId));
    navigate("/courses/details");
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      <Navbar />

      <div className="px-6 pt-24 pb-10 max-w-6xl mx-auto">
        {tutor ? (
          <>
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={
                    tutor.profile_picture ||
                    "https://i.pinimg.com/736x/6d/ac/d4/6dacd4cf41a3637d021f0aba48de54fc.jpg"
                  }
                  alt="tutor"
                  className="w-72 h-72 object-cover rounded-xl border-2 border-white"
                />
              </div>

              <div className="md:w-2/3 space-y-4 font-serif">
                <div className="flex">
                  <h1 className="text-5xl font-bold">
                    {tutor.full_name} ( {tutor.age} )
                  </h1>
                </div>
                <p className="text-gray-300 text-lg">{tutor.about}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="bg-white text-black px-2 py-1 rounded">
                    {tutor.expertise}
                  </span>
                  <span className="text-green-500 font-medium mt-1">
                    ({tutor.review_count} Reviews)
                  </span>
                  <span>{tutor.created_at}</span>
                </div>
              </div>
            </div>

            {/* Learn & Purchase */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {/* What you'll learn */}
              <div className="md:col-span-2 bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-2xl shadow-xl border border-green-500/20 font-serif relative overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>

                <h2 className="text-2xl flex items-center font-bold mb-6 text-green-500 relative">
                  More Info{" "}
                  <CiCircleInfo className="ml-2 text-3xl animate-pulse" />
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-green-500 rounded-full"></span>
                </h2>

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Education:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.education}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Occupation:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.occupation}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Expertise:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.expertise}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Experience:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.experience} Years
                    </span>
                  </div>
                </div>

                {/* Subtle grid pattern overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20"></div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
              </div>

              {/* Purchase Box */}
              <div className="bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-2xl shadow-xl border border-green-500/20 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-transparent to-green-500"></div>

                <div className="relative z-10">
                  {/* Email section */}
                  <div className="mb-6 pb-4 border-b border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-400">
                      Contact Information
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-white">
                        Email:
                      </span>
                      <span className="text-xl font-bold text-green-500 ml-3 bg-black/30 px-3 py-1 rounded-lg">
                        {tutor.email}
                      </span>
                    </div>
                  </div>

                  {/* Rating section */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-white">Rating:</p>
                      <div className="flex ml-3 bg-black/30 px-3 py-1 rounded-lg">
                        {tutor.rating === 0 ? (
                          <div className="flex space-x-1">
                            <IoMdStarOutline className="text-green-500 text-3xl" />
                            <IoMdStarOutline className="text-green-500 text-3xl" />
                            <IoMdStarOutline className="text-green-500 text-3xl" />
                            <IoMdStarOutline className="text-green-500 text-3xl" />
                            <IoMdStarOutline className="text-green-500 text-3xl" />
                          </div>
                        ) : (
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <IoStar
                                key={index}
                                className="text-yellow-400 text-3xl drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review count with badge */}
                    <div className="mt-4 flex items-center">
                      <span className="bg-black/50 text-green-400 font-bold text-lg px-4 py-1.5 rounded-full border border-green-500/30">
                        {tutor.review_count} Reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button with enhanced styling */}
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center group relative overflow-hidden">
                  <span className="relative z-10">View Reviews</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Subtle grid pattern overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20"></div>
              </div>
            </div>
            <motion.h2
              className="text-7xl font-bold text-white text-center mt-16 mb-8 relative z-10"
              variants={fadeIn}
            >
              My Courses
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative flex flex-col h-[450px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-green-500/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-green-400/30 transition-all duration-500 group"
                >
                  {/* Neon Blur Bubble */}
                  <div className="absolute -top-12 -right-12 w-44 h-44 bg-green-400/10 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>

                  <div className="p-6 flex-grow z-10">
                    {/* Level Badge */}
                    <span
                      className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-xl text-white backdrop-blur-md animate-pulse ${(() => {
                        const level = course.level?.trim().toLowerCase();
                        if (level === "beginner") return "bg-green-500/90";
                        if (level === "intermediate") return "bg-yellow-500/90";
                        if (level === "advanced") return "bg-red-500/90";
                        return "bg-gray-400/90 text-black";
                      })()}`}
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
                        <span className="text-gray-400 font-medium">
                          Category:
                        </span>
                        <span className="text-white bg-gray-800/50 px-2 py-0.5 rounded-md">
                          {course.category}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Instructor:
                        </span>
                        <span className="text-white">{course.created_by}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Price:
                        </span>
                        <span className="text-green-400 font-bold text-base">
                          ₹{course.price}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Created:
                        </span>
                        <span className="text-gray-300">
                          {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0 mt-auto bg-gradient-to-t from-black via-transparent to-transparent z-10">
                    <button
                      onClick={() => handleCourseView(course.id)}
                      className="w-full bg-green-500/10 hover:bg-green-600 text-green-300 hover:text-white border border-green-400 rounded-xl font-semibold py-3 transition-all duration-300 hover:shadow-xl backdrop-blur-lg"
                    >
                      🚀 View Course
                    </button>
                  </div>

                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-10 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Loading course content...
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetails;
