import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { User, Tag, Calendar } from "lucide-react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useDispatch, useSelector } from "react-redux";
import { adminAxios, tutorAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../CourseRequests/CourseRequests.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { setCourseId } from "../../../redux/slices/userSlice";

const CourseRequests = () => {
  const [pendingCourseRequests, setPendingCourseRequests] = useState([]);
  const [rejectedCourseRequests, setRejectedCourseRequests] = useState([]);
  const tutor = useSelector((state) => state.user.user);
  const [selectedData, setSelectedData] = useState(null);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(tutor.email);
  console.log("selected data", selectedData);
  console.log("pending data", pendingCourseRequests);
  console.log("rejected data", rejectedCourseRequests);

  const fetchCourseRequests = async () => {
    try {
      const response = await adminAxios.get("list_course_request/");
      const data = response.data;

      const pending = data.filter((course) => course.status === "pending");
      const rejected = data.filter((course) => course.status === "rejected");

      setPendingCourseRequests(pending);
      setRejectedCourseRequests(rejected);
      console.log(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourseRequests();
  }, []);

  const toggle_status = async (e, course_id) => {
    e.preventDefault();
    try {
      await adminAxios.post(`course_request_status/${course_id}/`);
      toast.success("Status Changed Successfully");
      fetchCourseRequests();
    } catch (error) {
      toast.error("Course not Found");
      console.error("Error:", error);
    }
  };

  const handleAccept = async (e, courseId) => {
    e.preventDefault();
    try {
      await adminAxios.post(`accept_course_request/${courseId}/`);
      toast.success("Course Accepted Successfully");
      fetchCourseRequests();
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
    }
  };

  const handleReject = async (e, courseId) => {
    e.preventDefault();
    try {
      await adminAxios.post(`reject_course_request/${courseId}/`);
      toast.success("Course Rejected Successfully");
      fetchCourseRequests();
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
    }
  };

  const handleCourseClick = (id) => {
    console.log("course navigated");

    dispatch(setCourseId(id));
    navigate("/admin/courses/Overview");
  };

  return (
    <Layout page="Courses">
      <div className="p-8 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex mb-12 items-center space-x-4">
            <div className="flex">
              <h2 className="text-5xl font-extrabold text-white">
                Course Requests
              </h2>
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
            </div>
          </div>
          <div
            className="flex mb-9 items-center space-x-4 "
            style={{ marginLeft: "450px" }}
          >
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-2 text-lg font-semibold rounded-md transition-all duration-200 ${
                step === 1
                  ? "bg-cyan-500"
                  : "bg-white text-black hover:bg-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStep(2)}
              className={`px-4 py-2 text-lg font-semibold rounded-md transition-all duration-200 ${
                step === 2
                  ? "bg-cyan-500"
                  : "bg-white text-black hover:bg-gray-600"
              }`}
            >
              Rejected
            </button>
          </div>

          {step === 1 ? (
            <>
              <div className="flex mb-5">
                <div className="flex">
                  <h2 className="text-4xl font-extrabold text-white">
                    Pending Requests{" "}
                    <PendingActionsIcon className="h-6 w-6" fontSize="large" />
                  </h2>
                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingCourseRequests &&
                  pendingCourseRequests.map((course, index) => (
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
                                course.level.toLowerCase() === "beginner"
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
                              <User size={16} className="mr-2 text-cyan-500" />
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
                            ₹ {course.price}
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
                                  onClick={(e) => handleReject(e, course.id)}
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
                  ))}
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
                {rejectedCourseRequests &&
                  rejectedCourseRequests.map((course, index) => (
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
                                course.level.toLowerCase() === "beginner"
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
                              <User size={16} className="mr-2 text-cyan-500" />
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
                            ₹ {course.price}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition">
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
                                  onClick={(e) => handleReject(e, course.id)}
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
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseRequests;
