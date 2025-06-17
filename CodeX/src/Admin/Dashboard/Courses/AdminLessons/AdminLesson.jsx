import React, { useState, useEffect, use } from "react";
import { adminAxios, tutorAxios } from "../../../../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { setLessonId } from "../../../../redux/slices/userSlice";

const AdminLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [filter, setFilter] = useState("accepted");
  const id = useSelector((state) => state.user.moduleId);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await adminAxios.get(`view_module/${id}/`);
        setModule(response.data);
      } catch (error) {
        toast.error("Error while fetching Module details");
        console.error(error);
      }
    };

    fetchModuleDetails();
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      const response = await adminAxios.get(`course_lessons/${id}/`);
      console.log(response.data);
      setLessons(response.data);
    } catch (error) {
      toast.error("Error while fetching Lessons details");
      console.error(error);
    }
  };

  const toggle_status = async (e, lessonId) => {
    e.preventDefault();
    try {
      console.log(lessonId);

      await adminAxios.post(`lesson_status/${lessonId}/`);
      toast.success("Status Updated Successfully");
      fetchLessons();
    } catch (error) {
      toast.error("Error While Updating Status");
      console.log(error);
    }
  };

  const handleAccept = async (e, lessonId) => {
    e.preventDefault();
    try {
      await adminAxios.post(`accept_lesson/${lessonId}/`);
      fetchLessons();
      toast.success("Lesson Accepted");
    } catch (error) {
      toast.error(error || "Error While Accepting Lesson");
    }
  };

  const handleReject = async (e, lessonId) => {
    e.preventDefault();
    try {
      await adminAxios.post(`reject_lesson/${lessonId}/`);
      fetchLessons();
      toast.success("Lesson Rejected");
    } catch (error) {
      toast.error(error || "Error While Rejecting Lesson");
    }
  };

  useEffect(() => {
    const result = lessons.filter((lesson) => {
      if (filter === "accepted") return lesson.status === "accepted";
      return lesson.status === filter;
    });
    setFilteredLessons(result);
  }, [lessons, filter]);

  const handleLessonClick = (lessonId) => {
    dispatch(setLessonId(lessonId));
    navigate("/admin/courses/lessons/overview");
  };

  return (
    <Layout page="Courses">
      <div className="p-4 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          {!module ? (
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

                  {/* Filter Buttons */}
                  <div>
                    <button
                      className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-40 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
                      onClick={() => navigate("/admin/courses/Overview")}
                    >
                      Back
                    </button>
                    <button
                      className={`text-xl font-bold px-5 py-2 ml-20 mt-2 ${
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
                        filter === "accepted"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                      onClick={() => setFilter("accepted")}
                    >
                      Accepted
                    </button>
                    <button
                      className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                        filter === "rejected"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                      onClick={() => setFilter("rejected")}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
              </div>

              {/* Lessons Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                    <div className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <img
                            src={lesson.thumbnail || ""}
                            className=" font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300 h-full w-full"
                          />
                        </div>
                        <p className="text-gray-800 font-semibold  text-lg">
                          {lesson.title}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <span className="text-xs font-medium">
                              Created At : {lesson.created_at}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex justify-between"
                        style={{ marginLeft: "170px" }}
                      >
                        <div className="flex items-center space-x-2">
                          {lesson.status === "pending" ? (
                            <>
                              <button
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                onClick={(e) => handleAccept(e, lesson.id)}
                              >
                                Accept
                              </button>
                              <button
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                onClick={(e) => handleReject(e, lesson.id)}
                              >
                                Reject
                              </button>
                            </>
                          ) : lesson.status === "accepted" ? (
                            lesson.is_active ? (
                              <button
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                onClick={(e) => toggle_status(e, lesson.id)}
                                style={{ marginLeft: "80px" }}
                              >
                                <DeleteForeverIcon fontSize="small" />
                              </button>
                            ) : (
                              <button
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                onClick={(e) => toggle_status(e, lesson.id)}
                                style={{ marginLeft: "80px" }}
                              >
                                <RestoreFromTrashIcon fontSize="small" />
                              </button>
                            )
                          ) : (
                            <span className="p-2 text-white font-semibold bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition">
                              Rejected
                            </span>
                          )}
                          <>
                            <button
                              className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                              style={{ marginLeft: "10px" }}
                              onClick={() => handleLessonClick(lesson.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </button>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminLessons;
