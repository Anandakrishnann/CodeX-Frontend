import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCourseId } from "../../../../redux/slices/userSlice";
import { LuActivity } from "react-icons/lu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MdOutlinePendingActions } from "react-icons/md";
import { userAxios } from "../../../../../axiosConfig";

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filter, setFilter] = useState("pending");
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await userAxios.get("enrolled_courses/");
      setCourses(response.data);
    } catch (error) {
      console.log(error || "Error While Loading Courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const result = courses.filter((course) => {
      if (filter === "pending") return course.status === "pending";
      return course.status === filter;
    });
    setFilteredCourses(result);
  }, [courses, filter]);

  const handleStartCourse = async (id) => {
    try {
      await userAxios.post(`start_course/${id}/`);
      dispatch(setCourseId(id));
      fetchCourses();
      toast.success("Course Started Check Progress");
    } catch (error) {
      toast.error("Error While Starting Course");
    }
  };

  const handleCourseClick = (id) => {
    dispatch(setCourseId(id));
    navigate("/user/courses-modules");
  };

  const handleViewCertificate = (id) => {
    dispatch(setCourseId(id));
    navigate("/user/course-certificate");
  };

  return (
    <Layout page="Courses">
      <div className="p-8 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex mb-8">
            <div className="flex">
              <h2 className="text-5xl font-extrabold text-white">
                Course Dashboard
              </h2>
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
            </div>
          </div>

          <div className="mb-10">
            <button
              className="text-2xl ml-6 mr-24 text-black bg-white rounded-md font-extrabold m-3 hover:text-white hover:bg-black hover:border-white"
              style={{ width: "180px" }}
            ></button>

            <button
              className={`text-xl font-bold px-5 py-2 ml-18 mt-2 ${
                filter === "pending"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "progress"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("progress")}
            >
              In Progress
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "completed"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <h3 className="text-4xl font-bold mb-10 text-left text-white mt-6">
            Your Learning Journey
          </h3>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-3xl font-semibold text-gray-300">
                No Courses Purchased Yet
              </h2>
            
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((courseObj, index) => {
                const course = courseObj.course;

                if (courseObj.status === "pending") {
                  return (
                    <div className="relative" key={index}>
                      <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <div
                          className="absolute top-0 left-0 h-1 bg-yellow-500"
                          style={{ width: `${courseObj.progress}%` }}
                        ></div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-yellow-500/10 p-3 rounded-lg mr-4">
                            <MdOutlinePendingActions className="text-yellow-600 text-3xl" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                {course.title}
                              </h4>
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {courseObj.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${courseObj.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                {Math.round(courseObj.progress)}% completed
                              </span>
                              <span>Last accessed: 2 days ago</span>
                            </div>
                          </div>
                          <button
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500 text-yellow-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            onClick={() => handleStartCourse(course.id)}
                          >
                            Start Course
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else if (courseObj.status === "progress") {
                  return (
                    <div className="relative" key={index}>
                      <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <div
                          className="absolute top-0 left-0 h-1 bg-blue-500"
                          style={{ width: `${courseObj.progress}%` }}
                        ></div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500/10 p-3 rounded-lg mr-4">
                            <LuActivity className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                {course.title}
                              </h4>
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {courseObj.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${courseObj.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                {Math.round(courseObj.progress)}% completed
                              </span>
                              <span>Last accessed: 2 days ago</span>
                            </div>
                          </div>
                          <button
                            className="w-full bg-blue-500/10 hover:bg-blue-500 border border-blue-500 text-blue-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            onClick={() => handleCourseClick(course.id)}
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else if (courseObj.status === "completed") {
                  return (
                    <div className="relative" key={index}>
                      <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 shadow-md border border-green-200 group hover:shadow-lg hover:border-green-300 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-500/10 p-3 rounded-lg mr-4">
                            <TrendingUpIcon className="text-green-600 text-xl" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                                {course.title}
                              </h4>
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {courseObj.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>100% completed</span>
                              <span>
                                Completed on:{" "}
                                {new Date(
                                  courseObj.completed_on
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            className="w-full bg-green-500/10 hover:bg-green-500 border border-green-500 text-green-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            onClick={() => handleViewCertificate(course.id)}
                          >
                            View/Download Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserCourses;
