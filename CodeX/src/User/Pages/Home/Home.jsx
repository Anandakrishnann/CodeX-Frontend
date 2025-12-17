import React, { useState, useEffect } from "react";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";
import CourseCard from "@/Component/CourseCard/CourseCard";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";
import { Button } from "../../../Component/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { userAxios } from "../../../../axiosConfig";
import { useDispatch } from "react-redux";
import { setCourseId } from "../../../redux/slices/userSlice";
import Loading from "@/User/Components/Loading/Loading";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await userAxios.get("courses/");
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseView = (courseId) => {
    dispatch(setCourseId(courseId));
    navigate("/courses/details");
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-poppins">
        <BackgroundAnimation />
        <Navbar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-poppins">
      <BackgroundAnimation />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 md:pt-40 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1
            className="md:text-7xl font-bold mb-10"
            style={{ marginTop: "55px" }}
          >
            <span className="text-white text-8xl ">Start Your</span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-7xl text-transparent mb-10">
              Learning Journey
            </span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-xl mx-auto">
            Learn to code with our interactive platform designed for beginners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/courses")}
              className="bg-black border-2 border-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg mt-10 rounded-lg transition-all shadow-lg"
            >
              Explore Courses
            </Button>
            {/* <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
            >
              Sign Up Free
            </Button> */}
          </div>
        </motion.div>
        <motion.section
          className="container mx-auto px-4 py-20 relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h2
            className="text-7xl font-bold text-white text-center relative z-10"
            style={{ marginBottom: "70px" }}
            variants={fadeIn}
          >
            Popular Courses
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {courses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="relative flex flex-col h-[350px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-green-500/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-green-400/30 transition-all duration-500 group"
                        >
                          {/* Neon Bubble */}
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
          
                            {/* Details */}
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
                                <span className="text-gray-400 font-medium">Price:</span>
                                <span className="text-green-400 font-bold text-base">
                                  $ {course.price}
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
          
                          {/* View Button */}
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

        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          className="container mx-auto px-4 py-16 relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h2
            className="text-7xl font-bold text-white text-center mb-12"
            variants={fadeIn}
          >
            Why Choose <span className="text-white">Code</span>
            <span className="text-green-500">X</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div className="text-center p-6" variants={fadeIn}>
              <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-25 w-25 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Interactive Learning
              </h3>
              <p className="text-gray-400">
                Learn by doing with our hands-on coding exercises and real-time
                feedback.
              </p>
            </motion.div>

            <motion.div className="text-center p-6" variants={fadeIn}>
              <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-25 w-25 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Expert Curriculum
              </h3>
              <p className="text-gray-400">
                Courses designed by industry professionals to teach you relevant
                skills.
              </p>
            </motion.div>

            <motion.div className="text-center p-6" variants={fadeIn}>
              <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-25 w-25 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Community Support
              </h3>
              <p className="text-gray-400">
                Join a community of learners and get help when you need it.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
