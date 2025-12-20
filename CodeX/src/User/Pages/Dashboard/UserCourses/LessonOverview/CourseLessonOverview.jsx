import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { setLessonId } from "../../../../../redux/slices/userSlice";
import { userAxios } from "../../../../../../axiosConfig";
import { Flag } from "lucide-react";
import Loading from "@/User/Components/Loading/Loading";

const CourseLessonOverview = () => {
  const [lesson, setLesson] = useState(null);
  const lesson_id = useSelector((state) => state.user.lessonId);
  const [showVideo, setShowVideo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("lesson ", lesson);
  console.log("lesson_id data", lesson_id);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await userAxios.get(`started-lesson/${lesson_id}/`);
      console.log("requestes data", response.data);

      setLesson(response.data);
    } catch (error) {
      toast.error("Error While Loading module");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, []);

  const handleCompleteLesson = async (lesson_id) => {
    try {
      const response = await userAxios.post("complete-lesson/", {
        lesson_id,
      });
      dispatch(setLessonId(lesson_id));
      toast.success("Congradulations Lesson Completed Keep Learning");
      navigate("/user/courses-lessons");
    } catch (error) {
      toast.error("Error While Completing Lesson");
    }
  };

  const Course = () => {
    navigate("/user/courses");
  };

  const Module = () => {
    navigate("/user/courses-modules");
  };

  const Lesson = () => {
    navigate("/user/courses-lessons")
  }

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

            <span className="opacity-70 hover:opacity-100 cursor-pointer transition-all"
            onClick={Lesson}
            >Lessons
            </span>

            <span className="opacity-50">{">"}</span>

            <span className="text-white"
            >Lessons Overview
            </span>
          </div>
          {/* Header */}
          {lesson ? (
            <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl relative">
              <div className="flex justify-between items-start flex-wrap">
                <div>
                  <h2 className="text-5xl font-extrabold text-white mb-3">
                    {lesson.title || ""}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mb-4">
                    {lesson.description || ""}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-md">
                    <div>
                      <span className="font-bold">Created On:</span>{" "}
                      {lesson.created_at || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* Filter Buttons */}
          <div className="mb-10">
            <button
              className="text-2xl p-2 ml-6 mr-24 text-black bg-white border border-white  rounded-md font-extrabold m-3  hover:text-white hover:bg-black hover:border-white "
              onClick={() => setShowModal(true)}
            >
              Complete Lesson
            </button>
          </div>
          <h3 className="text-4xl font-bold mb-10 text-left text-white mt-6">
            Your Learning Journey
          </h3>
          {/* Course Cards Grid */}

          {lesson ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {/* Video Card */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]">
                <div className="flex flex-col justify-between h-full">
                  <div
                    className="cursor-pointer relative"
                    onClick={() => setShowVideo(true)}
                  >
                    {showVideo ? (
                      <video
                        src={lesson.video}
                        controls
                        autoPlay
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="h-64 w-full object-cover rounded-t-2xl"
                      />
                    ) : (
                      <img
                        src={lesson.thumbnail || ""}
                        alt="Lesson Thumbnail"
                        className="w-full h-64 object-cover rounded-t-2xl"
                      />
                    )}
                  </div>
                  <h2 className="text-gray-900 text-xl font-bold px-5 py-4 border-t border-gray-100">
                    {lesson.title || "Untitled Lesson"}
                  </h2>
                </div>
              </div>

              {/* Document Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Lesson Document
                  </h3>

                  {lesson.documents ? (
                    <div className="text-sm text-gray-700 space-y-3">
                      <p className="italic text-gray-500">
                        Preview only. Download is restricted.
                      </p>
                      <iframe
                        src={`https://docs.google.com/gview?url=${lesson.documents}&embedded=true`}
                        className="w-full h-64 border rounded-md"
                        frameBorder="0"
                        title="Lesson Document"
                        onContextMenu={(e) => e.preventDefault()}
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No document available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-gray-800">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-black mb-4 text-center">
              Mark Lesson as Complete
            </h2>

            {/* Motivational Message */}
            <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6">
              <p className="text-xl leading-relaxed">
                Completing a lesson is a meaningful step in your learning
                journey. Please ensure you’ve genuinely understood the material
                before marking it as complete. Every step counts—true growth
                comes from honest effort and consistent practice.
              </p>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center">
              <button
                className="text-2xl p-2  text-white bg-black border-white  rounded-md font-extrabold m-3 border transition duration-200 hover:bg-white hover:text-black hover:border-black"
                onClick={() => {
                  handleCompleteLesson(lesson_id);
                }}
              >
                Complete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseLessonOverview;
