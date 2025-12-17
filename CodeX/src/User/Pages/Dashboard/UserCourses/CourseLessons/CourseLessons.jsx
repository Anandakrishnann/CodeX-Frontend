import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  setCourseId,
  setLessonId,
  setModuleId,
} from "../../../../../redux/slices/userSlice";
import { LuActivity } from "react-icons/lu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MdOutlinePendingActions } from "react-icons/md";
import { userAxios } from "../../../../../../axiosConfig";
import Loading from "@/User/Components/Loading/Loading";

const CourseLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [isPending, setIsPending] = useState(0);
  const [isInProgress, setIsInProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const module_id = useSelector((state) => state.user.moduleId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("lessons ", lessons);
  console.log("type", typeof lessons);
  console.log("isArray", Array.isArray(lessons));

  console.log("module ", module);
  console.log("module_id data", module_id);

  const fetchModule = async () => {
    try {
      const response = await userAxios.get(`started_module/${module_id}/`);
      console.log("requestes data", response.data);

      setModule(response.data);
    } catch (error) {
      toast.error("Error While Loading module");
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await userAxios.get("started_module_lessons/", {
        params: { module_id },
      });
      console.log("requested data", response.data);
      setLessons(response.data);
    } catch (error) {
      toast.error("Error While Loading lessons");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchModule(),
          fetchLessons()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const pending = lessons.filter((c) => c.status === "pending").length;
    const progress = lessons.filter((c) => c.status === "progress").length;
    const completed = lessons.filter((c) => c.status === "completed").length;

    const result = lessons.filter((lesson) => {
      if (filter === "pending") return lesson.status === "pending";
      return lesson.status === filter;
    });

    setFilteredLessons(result);

    setIsPending(pending);
    setIsInProgress(progress);
    setIsCompleted(completed);
  }, [lessons, filter]);

  const lessonInProgress = lessons.some((l) => l.status === "progress");

  const handleStartLesson = async (lesson_id) => {
    try {
      const response = await userAxios.post(`start_lesson/`, { lesson_id });

      dispatch(setLessonId(lesson_id));
      setSelectedData(lesson_id);
      fetchLessons();
      toast.success("Lesson started successfully!");
    } catch (error) {
      if (error.response && error.response.data?.error) {
        toast.warning(error.response.data.error);
      } else {
        toast.error("Error starting lesson");
      }
    }
  };

  const handleContinueLearning = (lesson_id) => {
    dispatch(setLessonId(lesson_id));
    navigate("/user/lesson-overview");
  };

  const Course = () => {
    navigate("/user/courses");
  };

  const Module = () => {
    navigate("/user/courses-modules");
  };

  if (loading) {
    return (
      <Layout page="Courses">
        <Loading />
      </Layout>
    );
  }

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

            <span
              className="opacity-70 hover:opacity-100 cursor-pointer transition-all"
              onClick={Module}
            >
              Modules
            </span>

            <span className="opacity-50">{">"}</span>

            <span className="text-white">Lessons</span>
          </div>

          {/* Header */}
          {module ? (
            <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl relative">
              <div className="flex justify-between items-start flex-wrap">
                <div>
                  <h2 className="text-5xl font-extrabold text-white mb-3">
                    {module.title || ""}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mb-4">
                    {module.description || ""}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-md">
                    <div>
                      <span className="font-bold">Created On:</span>{" "}
                      {module.created_at || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* Filter Buttons */}
          <div className="mb-10">
            <button
              className="text-2xl ml-6 mr-24 text-black bg-white  rounded-md font-extrabold m-3  hover:text-white hover:bg-black hover:border-white "
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
            {filteredLessons &&
              filteredLessons.map((lessonObj, index) => {
                const lesson = lessonObj.lesson;

                // Pending Card
                if (lessonObj.status === "pending") {
                  return (
                    <>
                      <div className="relative" key={index}>
                        <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                          <div className="absolute top-0 left-0 h-1 bg-yellow-500"></div>

                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-yellow-500/10 p-3 rounded-lg mr-4">
                              <MdOutlinePendingActions className="text-yellow-600 text-3xl" />
                            </div>

                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                  {lesson.title}
                                </h4>
                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                  {lessonObj.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {/* Progress + Date */}
                            <div className="mb-3">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                {/* <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${lessonObj.progress}%` }}
                                ></div> */}
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                {/* <span>
                                  Started At:{" "}
                                  {new Date(
                                    lessonObj.started_at
                                  ).toDateString()}
                                </span> */}
                              </div>
                            </div>

                            {/* Button */}
                            <button
                              disabled={
                                lessonInProgress && lesson.status !== "progress"
                              }
                              className={`w-full ${
                                lessonInProgress && lesson.status !== "progress"
                                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                  : "bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500 text-yellow-600 hover:text-white"
                              } font-medium py-2 rounded-lg transition-all duration-300`}
                              onClick={() => handleStartLesson(lesson.id)}
                            >
                              Start Lesson
                            </button>

                            {lessonInProgress &&
                              lesson.status !== "progress" && (
                                <p className="text-sm text-red-500 mt-2 text-center">
                                  Please complete the current lesson before
                                  starting a new one.
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                // Progress Card
                else if (lessonObj.status === "progress") {
                  return (
                    <div className="relative" key={index}>
                      <div className="h-60 flex flex-col justify-between overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border border-blue-200 group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <div className="absolute top-0 left-0 h-1 bg-blue-500"></div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500/10 p-3 rounded-lg mr-4">
                            <LuActivity className="text-blue-600 text-xl" />
                          </div>

                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                {lesson.title}
                              </h4>
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {lessonObj.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          {/* Progress + Date */}
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              {/* <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${lessonObj.progress}%` }}
                              ></div> */}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                Started At:{" "}
                                {new Date(lessonObj.started_at).toDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            className="w-full bg-blue-500/10 hover:bg-blue-500 border border-blue-500 text-blue-600 hover:text-white font-medium py-2 rounded-lg transition-all duration-300"
                            onClick={() => handleContinueLearning(lesson.id)}
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Completed Card
                else if (lessonObj.status === "completed") {
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
                                {lesson.title}
                              </h4>
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                                {lessonObj.status}
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
                                style={{ width: `100%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>100% completed</span>
                              <span>
                                Completed on:{" "}
                                {new Date(
                                  lessonObj.completed_on
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

export default CourseLessons;
