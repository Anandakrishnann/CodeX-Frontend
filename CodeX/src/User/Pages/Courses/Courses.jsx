import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { userAxios } from "../../../../axiosConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCourseId } from "../../../redux/slices/userSlice";
import { motion } from "framer-motion";
import cover_photo from "../../../assets/cover.png";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Store all courses
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClick = (id) => {
    dispatch(setCourseId(id));
    navigate("/courses/details");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await userAxios.get("categories/");
        setCategories(response.data);
      } catch {
        toast.error("Error While Loading Categories");
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await userAxios.get("courses/");
        setCourses(response.data);
        setAllCourses(response.data); // Store all courses
      } catch {
        toast.error("Error While Loading Courses");
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  // Filter courses when category is selected
  useEffect(() => {
    if (selectedCategory === null) {
      // Show all courses when no category is selected
      setCourses(allCourses);
    } else {
      // Filter courses by selected category
      const filtered = allCourses.filter(
        (course) => course.category_id === selectedCategory || course.category === categories.find(cat => cat.id === selectedCategory)?.name
      );
      setCourses(filtered);
    }
  }, [selectedCategory, allCourses, categories]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If clicking the same category, deselect it (show all)
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-poppins bg-black">
      <Navbar />
      {/* Page Layout */}
      <div className="flex pt-24">
        {/* Sidebar */}
        <div className="fixed top-24 left-0 h-[calc(100vh-6rem)] w-64 p-6 overflow-y-auto z-10 border-r border-gray-800 ml-2">
          <h2 className="text-3xl font-extrabold text-white mb-8">Category</h2>
          
          {/* All Courses Option */}
          <div
            className={`cursor-pointer text-lg mb-4 transition-all duration-300 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
                : "text-white hover:text-purple-400 px-4 py-2"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Courses
          </div>

          <div className="space-y-4">
            {categories?.map((item) => (
              <div
                key={item.id}
                className={`cursor-pointer text-lg transition-all duration-300 ${
                  item.id === selectedCategory
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform scale-105"
                    : "text-white hover:text-green-400 hover:bg-gray-800/50 px-4 py-2 rounded-lg"
                }`}
                onClick={() => handleCategoryClick(item.id)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6 space-y-12 text-white relative z-10">
          {/* Banner */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={cover_photo || ""}
              alt="Online Photography"
              className="w-full h-60 object-cover"
            />
          </div>

          {/* Section Title with Filter Info */}
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-bold font-serif">
              {selectedCategory 
                ? `${categories.find(cat => cat.id === selectedCategory)?.name} Courses`
                : "Popular Classes"
              }
            </h3>
            <div className="text-gray-400 text-lg">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
            </div>
          </div>

          {/* Advanced Cards */}
          {courses.length > 0 ? (
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

                  {/* View Button */}
                  <div className="p-6 pt-0 mt-auto bg-gradient-to-t from-black via-transparent to-transparent z-10">
                    <button
                      onClick={() => handleClick(course.id)}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
              <p className="text-gray-400">
                {selectedCategory 
                  ? `No courses available in ${categories.find(cat => cat.id === selectedCategory)?.name} category`
                  : "No courses available at the moment"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;