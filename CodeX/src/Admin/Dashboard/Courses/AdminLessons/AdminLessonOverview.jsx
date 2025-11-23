import React, { useState, useEffect } from "react";
import { adminAxios } from "../../../../../axiosConfig";
import { useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { useNavigate } from "react-router-dom";

const AdminLessonOverview = () => {
  const [lesson, setLesson] = useState([]);
  const id = useSelector((state) => state.user.lessonId);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      const response = await adminAxios.get(`lesson_overview/${id}/`);
      console.log(response.data);
      setLesson(response.data);
    } catch (error) {
      toast.error("Error while fetching Lessons details");
      console.error(error);
    }
  };

  const toggle_status = async (e, lessonId) => {
    e.preventDefault();
    try {
      await adminAxios.post(`lesson_status/${lessonId}/`);
      toast.success("Status Updated Successfully");
      fetchLessons();
    } catch (error) {
      toast.error("Error While Updating Status");
      console.log(error);
    }
  };

  return (
    <Layout page="Courses">
      <div className="p-4 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          {!lesson ? (
            <div className="text-center text-xl">
              Loading Lessons details...
            </div>
          ) : (
            <>
              {/* Header */}
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

                  {/* Filter Buttons */}
                  <div>
                    <button
                      className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-4 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
              </div>

              {/* Lessons Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lesson ? (
                  <>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]">
                      <div className="flex flex-col justify-between h-full">
                        <div
                          className="cursor-pointer"
                          onClick={() => setShowVideo(true)}
                        >
                          {showVideo ? (
                            <video
                              src={lesson.video}
                              controls
                              autoPlay
                              className="h-full w-full rounded-t-2xl"
                            />
                          ) : (
                            <img
                              src={lesson.thumbnail}
                              alt="Lesson Thumbnail"
                              className="w-full h-48 object-cover rounded-t-2xl"
                            />
                          )}
                        </div>
                        <h2 className="text-black text-2xl font-semibold p-4">
                          {lesson.title || ""}
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-full p-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-extrabold text-gray-800">
                            Lesson Document
                          </h3>
                        </div>

                        {lesson.documents ? (
                          <a
                            href={lesson.documents}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm break-words hover:underline p-2"
                          >
                            {lesson.documents}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            No document available
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Details Not Found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminLessonOverview;
