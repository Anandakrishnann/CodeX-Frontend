import React, { useState, useEffect, use } from "react";
import { adminAxios, tutorAxios } from "../../../../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { setLessonId } from "../../../../redux/slices/userSlice";
import Loading from "@/User/Components/Loading/Loading";

const AdminLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [filter, setFilter] = useState("accepted");
  const id = useSelector((state) => state.user.moduleId);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const [selectedData, setSelectedData] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("selected data", selectedData);
  console.log("rejection Reason", rejectionReason);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true)
        const response = await adminAxios.get(`view_module/${id}/`);
        setModule(response.data);
      } catch (error) {
        toast.error("Error while fetching Module details");
        console.error(error);
      } finally {
        setLoading(false)
      }
    };

    fetchModuleDetails();
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(`course_lessons/${id}/`);
      console.log(response.data);
      setLessons(response.data);
    } catch (error) {
      toast.error("Error while fetching Lessons details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggle_status = async (e, lessonId) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminAxios.post(`lesson_status/${lessonId}/`);
      toast.success("Status Updated Successfully");
      fetchLessons();
    } catch (error) {
      toast.error("Error While Updating Status");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e, lessonId) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminAxios.post(`accept_lesson/${lessonId}/`);
      fetchLessons();
      toast.success("Lesson Accepted");
    } catch (error) {
      toast.error(error || "Error While Accepting Lesson");
    } finally {
      setLoading(false);
    }
  };

  const rejectModalOpen = (id) => {
    setSelectedData(id);
    setShowRejectModal(true);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminAxios.post(`reject_lesson/${selectedData}/`, {
        reason: rejectionReason,
      });
      toast.success("Lesson Rejected Successfully");
      fetchLessons();

      setSelectedData(null);
      setRejectionReason("");
      setShowRejectModal(false);
    } catch (error) {
      toast.error(error || "Error While Rejecting Lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  useEffect(() => {
    const pending = lessons.filter((c) => c.status === "pending").length;
    const accepted = lessons.filter((c) => c.status === "accepted").length;
    const rejected = lessons.filter((c) => c.status === "rejected").length;

    const result = lessons.filter((lesson) => {
      if (filter === "accepted") return lesson.status === "accepted";
      return lesson.status === filter;
    });
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [lessons, filter]);

  const handleLessonClick = (lessonId) => {
    dispatch(setLessonId(lessonId));
    navigate("/admin/courses/lessons/overview");
  };

  return (
    <Layout page="Courses">
      {loading ? (
        <Loading />
      ) : (
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
                        onClick={() => navigate(-1)}
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
                        Pending{" "}
                        <span className="bg-yellow-300 border border-black rounded-full px-2 py-1 ml-2">
                          {isPending}
                        </span>
                      </button>
                      <button
                        className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                          filter === "accepted"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                        onClick={() => setFilter("accepted")}
                      >
                        Accepted{" "}
                        <span className="bg-green-500 border border-black rounded-full px-2 py-1 ml-2">
                          {isAccepted}
                        </span>
                      </button>
                      <button
                        className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                          filter === "rejected"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                        onClick={() => setFilter("rejected")}
                      >
                        Rejected{" "}
                        <span className="bg-red-500 border border-black rounded-full px-2 py-1 ml-2">
                          {isRejected}
                        </span>
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

                      {/* Fixed Thumbnail Container */}
                      <div className="w-full h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={lesson.thumbnail || ""}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <p className="text-gray-800 font-semibold text-lg mb-3">
                            {lesson.title}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="text-xs font-medium">
                                Created At: {lesson.created_at}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Button Container - Aligned to Right Bottom with 2px gaps */}
                        <div className="flex justify-end items-center gap-0.5 mt-4">
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
                                onClick={() => rejectModalOpen(lesson.id)}
                              >
                                Reject
                              </button>
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleLessonClick(lesson.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </button>
                            </>
                          ) : lesson.status === "accepted" ? (
                            lesson.is_active ? (
                              <>
                                <button
                                  className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                  onClick={() => handleLessonClick(lesson.id)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </button>
                                <button
                                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                  onClick={(e) => toggle_status(e, lesson.id)}
                                >
                                  <DeleteForeverIcon fontSize="small" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                  onClick={() => handleLessonClick(lesson.id)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </button>
                                <button
                                  className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                  onClick={(e) => toggle_status(e, lesson.id)}
                                >
                                  <RestoreFromTrashIcon fontSize="small" />
                                </button>
                              </>
                            )
                          ) : (
                            <button
                              className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                              onClick={() => handleEditModal(lesson.id)}
                            >
                              Rejected <DeleteForeverIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {showRejectModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                        <CancelIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Reject Lesson
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Please provide a reason for rejection
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="block text-sm font-semibold text-gray-400 mb-2">
                        Rejection Reason
                      </span>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter the reason for rejecting this Lesson..."
                        className="w-full bg-slate-700/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        rows="4"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleRejectCancel}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CloseIcon className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminLessons;
