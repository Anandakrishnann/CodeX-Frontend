import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { User, Tag, Calendar } from "lucide-react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { adminAxios, tutorAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../CourseRequests/CourseRequests.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { setCourseId } from "../../../redux/slices/userSlice";
import { Search } from "lucide-react";
import Loading from "@/User/Components/Loading/Loading";

const CourseRequests = () => {
  const [pendingCourseRequests, setPendingCourseRequests] = useState([]);
  const [rejectedCourseRequests, setRejectedCourseRequests] = useState([]);
  const [isPendingRequests, setIsPendingRequests] = useState(0);
  const [isRejectedRequests, setIsRejectedRequests] = useState(0);
  const [selectedData, setSelectedData] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const tutor = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(tutor.email);
  console.log("selected data", selectedData);
  console.log("rejection Reason", rejectionReason);
  console.log("pending data", pendingCourseRequests);
  console.log("rejected data", rejectedCourseRequests);

  const fetchCourseRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("list_course_request/");
      const data = response.data;

      const pending = data.filter((course) => course.status === "pending");
      const rejected = data.filter((course) => course.status === "rejected");

      const pendingRequests = data.filter(
        (course) => course.status === "pending"
      ).length;
      const rejectedRequests = data.filter(
        (course) => course.status === "rejected"
      ).length;

      setPendingCourseRequests(pending);
      setRejectedCourseRequests(rejected);

      setIsPendingRequests(pendingRequests);
      setIsRejectedRequests(rejectedRequests);

      console.log(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseRequests();
  }, []);

  const toggle_status = async (e, course_id) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminAxios.post(`course_request_status/${course_id}/`);
      toast.success("Status Changed Successfully");
      fetchCourseRequests();
    } catch (error) {
      toast.error("Course not Found");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();

      const combined = [...pendingCourseRequests, ...rejectedCourseRequests];

      return combined.filter((course) => {
        return (
          course.name.toLowerCase().includes(lower) ||
          course.title.toLowerCase().includes(lower) ||
          course.category.toLowerCase().includes(lower) ||
          course.created_by.toLowerCase().includes(lower) ||
          course.level.toLowerCase().includes(lower)
        );
      });
    }

    if (step === 1) return pendingCourseRequests;
    if (step === 2) return rejectedCourseRequests;

    return [];
  };

  const filteredResults = getFilteredResults();

  const handleAccept = async (e, courseId) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminAxios.post(`accept_course_request/${courseId}/`);
      toast.success("Course Accepted Successfully");
      fetchCourseRequests();
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
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
      await adminAxios.post(`reject_course_request/${selectedData}/`, {
        reason: rejectionReason,
      });
      toast.success("Course Rejected Successfully");
      fetchCourseRequests();
      selectedData(null);
      setRejectionReason("");
      setShowRejectModal(false);
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const handleCourseClick = (id) => {
    console.log("course navigated");

    dispatch(setCourseId(id));
    navigate("/admin/courses/Overview");
  };

  return (
    <Layout page="Courses">
      {loading ? (
        <Loading />
      ) : (
        <div className="p-8 min-h-screen relative z-10 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex mb-8 items-center space-x-4">
              <div className="flex">
                <h2 className="text-5xl font-extrabold text-white">
                  Course Requests
                </h2>
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
              </div>
            </div>
            <div className="flex-1 max-w-md mb-6 ">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-white p-2 pl-10 rounded-md text-black focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="flex mb-9 items-center justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  step === 1
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl shadow-orange-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Pending
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {isPendingRequests}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => setStep(2)}
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  step === 2
                    ? "bg-gradient-to-r from-red-500 to-rose-700 text-white shadow-2xl shadow-red-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Rejected
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {isRejectedRequests}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {step === 1 ? (
              <>
                <div className="flex mb-5">
                  <div className="flex">
                    <h2 className="text-4xl font-extrabold text-white">
                      Pending Requests{" "}
                      <PendingActionsIcon
                        className="h-6 w-6"
                        fontSize="large"
                      />
                    </h2>
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResults && filteredResults.length > 0 ? (
                    filteredResults.map((course, index) => (
                      <div
                        key={index}
                        className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                        <div className="p-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                                {course.name}
                              </h3>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-white ${
                                  course.level.toLowerCase() === "beginer"
                                    ? "bg-green-500"
                                    : course.level.toLowerCase() ===
                                      "intermediate"
                                    ? "bg-yellow-500"
                                    : course.level.toLowerCase() === "advanced"
                                    ? "bg-red-500"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {course.level}
                              </span>
                            </div>

                            <p className="text-gray-800 font-semibold mb-3 text-lg">
                              {course.title}
                            </p>

                            <div className="space-y-2 mb-4 text-sm">
                              <div className="flex items-center text-gray-700">
                                <User
                                  size={16}
                                  className="mr-2 text-cyan-500"
                                />
                                <span className="font-medium text-gray-900">
                                  Tutor :
                                </span>
                                <span className="ml-2 text-gray-700">
                                  {course.created_by}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Tag size={16} className="mr-2 text-cyan-500" />
                                <span className="font-medium text-gray-900">
                                  Category:
                                </span>
                                <span className="ml-2 text-gray-700">
                                  {course.category}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar
                                  size={16}
                                  className="mr-2 text-cyan-500"
                                />
                                <span className="text-xs font-medium">
                                  {course.created_at}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-bold text-lg">
                              $ {course.price}
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleCourseClick(course.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </button>

                              {course.status === "pending" ? (
                                <>
                                  <button
                                    className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                    onClick={(e) => handleAccept(e, course.id)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                    onClick={() => rejectModalOpen(course.id)}
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : course.status === "accepted" ? (
                                course.is_active ? (
                                  <button
                                    className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                    onClick={(e) => toggle_status(e, course.id)}
                                  >
                                    <DeleteForeverIcon fontSize="small" />
                                  </button>
                                ) : (
                                  <button
                                    className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                    onClick={(e) => toggle_status(e, course.id)}
                                  >
                                    <RestoreFromTrashIcon fontSize="small" />
                                  </button>
                                )
                              ) : (
                                <span className="p-2 text-white font-semibold bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                      <div className="text-white/20 text-8xl mb-4">📚</div>
                      <p className="text-white/80 text-3xl font-bold">
                        No Courses Pending
                      </p>
                      <p className="text-white/60 text-lg mt-2">
                        All courses verified No courses are in Pending
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex mb-5 mt-4">
                  <div className="flex">
                    <h2 className="text-4xl font-extrabold text-white">
                      Rejected Requests{" "}
                      <CancelIcon className="h-6 w-6" fontSize="large" />
                    </h2>
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResults && filteredResults.length > 0 ? (
                    filteredResults.map((course, index) => (
                      <div
                        key={index}
                        className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                        <div className="p-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                                {course.name}
                              </h3>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-white ${
                                  course.level.toLowerCase() === "beginer"
                                    ? "bg-green-500"
                                    : course.level.toLowerCase() ===
                                      "intermediate"
                                    ? "bg-yellow-500"
                                    : course.level.toLowerCase() === "advanced"
                                    ? "bg-red-500"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {course.level}
                              </span>
                            </div>

                            <p className="text-gray-800 font-semibold mb-3 text-lg">
                              {course.title}
                            </p>

                            <div className="space-y-2 mb-4 text-sm">
                              <div className="flex items-center text-gray-700">
                                <User
                                  size={16}
                                  className="mr-2 text-cyan-500"
                                />
                                <span className="font-medium text-gray-900">
                                  Tutor :
                                </span>
                                <span className="ml-2 text-gray-700">
                                  {course.created_by}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Tag size={16} className="mr-2 text-cyan-500" />
                                <span className="font-medium text-gray-900">
                                  Category:
                                </span>
                                <span className="ml-2 text-gray-700">
                                  {course.category}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar
                                  size={16}
                                  className="mr-2 text-cyan-500"
                                />
                                <span className="text-xs font-medium">
                                  {course.created_at}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-bold text-lg">
                              $ {course.price}
                            </span>

                            <div className="flex items-center space-x-2">
                              <span className="p-2 text-white font-semibold bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition">
                                Rejected
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                      <div className="text-white/20 text-8xl mb-4">📚</div>
                      <p className="text-white/80 text-3xl font-bold">
                        No Courses Pending
                      </p>
                      <p className="text-white/60 text-lg mt-2">
                        All courses verified No courses are in Pending
                      </p>
                    </div>
                  )}
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
                          Reject Course
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
                        placeholder="Enter the reason for rejecting this Course..."
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

export default CourseRequests;
