import React from "react";
import BackgroundAnimation from "../../Component/BackgroundAnimation";
import Navbar from "../../Component/Navbar";
import { motion } from "framer-motion";
import { Button } from "../../Component/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "../Pages/Footer/Footer";

const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
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

  const popularCourses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      level: "Beginner",
      rating: 4.9,
      students: 12340,
    },
    {
      id: 2,
      title: "React.js Development",
      level: "Intermediate",
      rating: 4.8,
      students: 8765,
    },
    {
      id: 3,
      title: "Python for Data Science",
      level: "Beginner",
      rating: 4.7,
      students: 15980,
    },
    {
      id: 1,
      title: "JavaScript Fundamentals",
      level: "Beginner",
      rating: 4.9,
      students: 12340,
    },
    {
      id: 2,
      title: "React.js Development",
      level: "Intermediate",
      rating: 4.8,
      students: 8765,
    },
    {
      id: 3,
      title: "Python for Data Science",
      level: "Beginner",
      rating: 4.7,
      students: 15980,
    },
  ];

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
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-7xl text-transparent mb-10">
              Learning Journey
            </span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-xl mx-auto">
            Learn to code with our interactive platform designed for beginners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/courses")}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg mt-10 rounded-lg transition-all shadow-lg"
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
            className="text-7xl font-bold text-white text-center mb-12"
            variants={fadeIn}
          >
            Popular Courses
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-black/30 backdrop-blur-sm border border-green-500 rounded-xl p-6 hover:border-codex-green transition-all"
                variants={fadeIn}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-xl font-semibold">
                    {course.title}
                  </h3>
                  <span className="bg-codex-green/20 text-white px-2 py-1 rounded text-sm">
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="text-yellow-400 mr-1">★</div>
                  <span className="text-white mr-2">{course.rating}</span>
                  <span className="text-gray-400">
                    ({course.students.toLocaleString()} students)
                  </span>
                </div>
                <Button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="w-full bg-transparent hover:bg-black border border-green-500 text-white mt-4 transition-colors"
                >
                  View Course
                </Button>
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
            className="text-4xl font-bold text-white text-center mb-12"
            variants={fadeIn}
          >
            Why Choose <span className="text-codex-green">CodeX</span>
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

export default Index;
