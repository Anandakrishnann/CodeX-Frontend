import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  setCourseId,
  setModuleId,
  setTutorId,
} from "../../../../../redux/slices/userSlice";
import { LuActivity } from "react-icons/lu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MdOutlinePendingActions } from "react-icons/md";
import { userAxios } from "../../../../../../axiosConfig";

const CourseModules = () => {
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [isPending, setIsPending] = useState(0);
  const [isInProgress, setIsInProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(0);
  const user = useSelector((state) => state.user.user);
  const course_id = useSelector((state) => state.user.courseId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("modules ", modules);
  console.log("course ", course);
  console.log("course_id data", course_id);

  const fetchCourse = async () => {
    try {
      const response = await userAxios.get(`started_course/${course_id}/`);
      console.log("requestes data", response.data);

      setCourse(response.data);
    } catch (error) {
      toast.error("Error While Loading modules");
    }
  };

  const fetchTutor = async () => {
    try {
      const response = await userAxios.get(`course_tutor/${course_id}/`);
      console.log("requestes data of tutor", response.data);

      setTutor(response.data);
      dispatch(setTutorId(response.data));
    } catch (error) {
      console.log(error || "Error while fetching tutor");
    }
  };

  const fetchModules = async () => {
    try {
      const response = await userAxios.get("course_modules/", {
        params: { course_id },
      });
      console.log("requested data", response.data);
      setModules(response.data);
    } catch (error) {
      toast.error("Error While Loading modules");
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchModules();
    fetchTutor();
  }, []);

  useEffect(() => {
    const pending = modules.filter((c) => c.status === "pending").length;
    const progress = modules.filter((c) => c.status === "progress").length;
    const completed = modules.filter((c) => c.status === "completed").length;

    const result = modules.filter((module) => {
      if (filter === "pending") return module.status === "pending";
      return module.status === filter;
    });
    setFilteredModules(result);

    setIsPending(pending);
    setIsInProgress(progress);
    setIsCompleted(completed);
  }, [modules, filter]);

  const moduleInProgress = modules.some(
    (modObj) => modObj.status === "progress"
  );

  const handleStartModule = async (module_id) => {
    if (
      moduleInProgress &&
      !filteredModules.find(
        (m) => m.modules.id === module_id && m.status === "progress"
      )
    ) {
      toast.error("You already have a module in progress. Complete it first.");
      return;
    }

    try {
      const response = await userAxios.post("start_module/", { module_id });
      dispatch(setModuleId(module_id));
      fetchModules();
      navigate("/user/courses-lessons");
      toast.success("Module Started! Check your progress.");
    } catch (error) {
      toast.error("Error while starting module");
    }
  };

  const Course = () => {
    navigate("/user/courses");
  };

  return (
    <Layout page="Courses">
      <div className="p-8 min-h-screen relative z-10  text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl flex items-center space-x-3 text-white text-lg font-semibold">
            <span
              className="opacity-70 hover:opacity-100 cursor-pointer transition-all"
              onClick={Course}
            >
              Course
            </span>

            <span className="opacity-50">{">"}</span>

            <span className="text-white">Modules</span>
          </div>

          {/* Header */}
          {course ? (
            <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl relative">
              <div className="flex justify-between items-start flex-wrap">
                <div>
                  <h2 className="text-5xl font-extrabold text-white mb-3">
                    {course.name || ""}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mb-4">
                    {course.description || ""}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-md">
                    <div className="col-span-2">
                      <span className="font-bold">Requirements:</span>{" "}
                      {course.requirements || ""}
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold">Benefits:</span>{" "}
                      {course.benefits || ""}
                    </div>
                    <div>
                      <span className="font-bold">Created On:</span>{" "}
                      {course.created_at || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* Filter Buttons */}
          <button
            className={`text-xl font-bold px-5 py-2 ml-6 mt-2 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
            onClick={() => navigate("/user/chat")}
          >
            Chat With Tutor
          </button>
          <div className="mb-10">
            <button
              className="text-2xl ml-6 mr-24 text-black bg-white  rounded-md font-extrabold m-3  hover:text-white hover:bg-black hover:border-white"
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
              Pending{" "}
                <span className="bg-orange-500 border border-black rounded-full px-2 py-1 ml-2">
                  {isPending}
                </span>
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "progress"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("progress")}
            >
              In Progress{" "}
                <span className="bg-blue-500 border border-black rounded-full px-2 py-1 ml-2">
                  {isInProgress}
                </span>
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "completed"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("completed")}
            >
              Completed{" "}
                <span className="bg-green-500 border border-black rounded-full px-2 py-1 ml-2">
                  {isCompleted}
                </span>
            </button>
          </div>
          <h3 className="text-4xl font-bold mb-10 text-left text-white mt-6">
            Your Learning Journey
          </h3>
          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModules &&
              filteredModules.map((moduleObj, index) => {
                const module = moduleObj.modules;

                // Pending Card
                if (moduleObj.status === "pending") {
                  return (
                    <>
                      <div className="relative" key={index}>
                        <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                          <div
                            className="absolute top-0 left-0 h-1 bg-yellow-500"
                            style={{ width: `${moduleObj.progress}%` }}
                          ></div>

                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-yellow-500/10 p-3 rounded-lg mr-4">
                              <MdOutlinePendingActions className="text-yellow-600 text-3xl" />
                            </div>

                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                  {module.title}
                                </h4>
                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                  {moduleObj.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {/* Progress + Date */}
                            <div className="mb-3">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${moduleObj.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{moduleObj.progress}% completed</span>
                                <span>
                                  Started At:{" "}
                                  {new Date(
                                    moduleObj.started_at
                                  ).toDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Button */}
                            <>
                              <button
                                disabled={
                                  moduleInProgress &&
                                  moduleObj.status !== "progress"
                                }
                                className={`w-full ${
                                  moduleInProgress &&
                                  moduleObj.status !== "progress"
                                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                    : "bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500 text-yellow-600 hover:text-white"
                                } font-medium py-2 rounded-lg transition-all duration-300`}
                                onClick={() => handleStartModule(module.id)}
                              >
                                Start Module
                              </button>

                              {moduleInProgress &&
                                moduleObj.status !== "progress" && (
                                  <p className="text-sm text-red-500 mt-2 text-center">
                                    Please complete the currently started module
                                    to proceed.
                                  </p>
                                )}
                            </>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                // Progress Card
                else if (moduleObj.status === "progress") {
                  return (
                    <div className="relative" key={index}>
                      <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <div
                          className="absolute top-0 left-0 h-1 bg-blue-500"
                          style={{ width: `${moduleObj.progress}%` }}
                        ></div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500/10 p-3 rounded-lg mr-4">
                            <LuActivity className="text-blue-600 text-xl" />
                          </div>

                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                {module.title}
                              </h4>
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {moduleObj.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          {/* Progress + Date */}
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${moduleObj.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                Started At:{" "}
                                {new Date(moduleObj.started_at).toDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            className="w-full bg-blue-500/10 hover:bg-blue-500 border border-blue-500 text-blue-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            onClick={() => handleStartModule(module.id)}
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Completed Card
                else if (moduleObj.status === "completed") {
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
                                {module.title}
                              </h4>
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {moduleObj.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {/* Progress + Date */}
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
                                  moduleObj.completed_on
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            className="w-full bg-green-500/10 hover:bg-green-500 border border-green-500 text-green-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            disabled
                          >
                            Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null; // fallback
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseModules;
