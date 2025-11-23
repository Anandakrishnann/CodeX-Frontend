import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import {
  User,
  Tag,
  Calendar,
  FileClock,
  FileText,
  Save,
  Pencil,
  Edit3,
  LineChart,
  FilePen,
  FileCheck,
} from "lucide-react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { useDispatch, useSelector } from "react-redux";
import { adminAxios, tutorAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { setCourseId } from "../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const Courses = () => {
  const [Courses, setCourses] = useState([]);
  const tutor = useSelector((state) => state.user.user);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState("accepted");
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(tutor.email);

  const fetchCourses = async () => {
    try {
      const response = await adminAxios.get("list_courses/");
      setCourses(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggle_status = async (e, course_id) => {
    e.preventDefault();

    try {
      const response = await adminAxios.post(`course_status/${course_id}/`);
      toast.success(response.data?.message || "Status Changed Successfully");

      fetchCourses();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Course not Found"
      );
    }
  };

  const setDraft = async (id) => {
    try {
      await adminAxios.post(`set_draft/${id}/`);
      toast.success("Course set to Draft");
      fetchCourses();
    } catch (error) {
      toast.error(error || "Error While Set Draft");
    }
  };

  useEffect(() => {
    const pending = Courses.filter((c) => c.status === "pending").length;
    const accepted = Courses.filter((c) => c.status === "accepted").length;
    const rejected = Courses.filter((c) => c.status === "rejected").length;

    const result = Courses.filter((course) => {
      if (filter === "accepted") return course.status === "accepted";
      return course.status === filter;
    });
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [Courses, filter]);

  const handleCourseClick = (id) => {
    console.log("course navigated");
    dispatch(setCourseId(id));
    navigate("/admin/courses/Overview");
  };

  const handleCourseAnalytics = (id) => {
    dispatch(setCourseId(id));
    navigate("/admin/courses/analytics");
  };

  return (
    <Layout page="Courses">
      <div className="p-8 min-h-screen relative z-10  text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex mb-12">
            <div className="flex">
              <h2 className="text-5xl font-extrabold text-white">
                Courses
              </h2>
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {filteredLessons &&
              filteredLessons.map((course, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  {/* Top Gradient Strip */}
                  <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                  <div className="p-6 flex flex-col justify-between h-full">
                    {/* Header Info */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                          {course.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-white ${
                            course.level.toLowerCase() === "beginer"
                              ? "bg-green-500"
                              : course.level.toLowerCase() === "intermediate"
                              ? "bg-yellow-500"
                              : course.level.toLowerCase() === "advanced"
                              ? "bg-red-500"
                              : "bg-gray-100 text-gray-800" // Fallback for unexpected levels
                          }`}
                        >
                          {course.level}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-gray-800 font-semibold mb-3 text-lg">
                        {course.title}
                      </p>

                      {/* Tutor, Category, Date */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <User size={16} className="mr-2 text-cyan-500" />
                          <span className="font-medium text-gray-900">
                            Tutor :{" "}
                          </span>
                          <span className="ml-2 text-gray-700">
                            {course.created_by}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Tag size={16} className="mr-2 text-cyan-500" />
                          <span className="font-medium text-gray-900">
                            Category :
                          </span>
                          <span className="ml-2 text-gray-700">
                            {course.category}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2 text-cyan-500" />
                          <span className="text-xs font-medium">
                            {course.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-bold text-lg">
                        $ {course.price}
                      </span>

                      <div className="flex items-center space-x-2">
                        <Tooltip title="View Analytics" arrow>
                          <button
                            onClick={() => handleCourseAnalytics(course.id)}
                            className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                          >
                            <LineChart fontSize="small" />
                          </button>
                        </Tooltip>
                        <Tooltip title="View Details" arrow>
                          <button
                            className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                            onClick={() => handleCourseClick(course.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                        </Tooltip>
                        {course.is_draft ? (
                          
                          <Tooltip title="Published" arrow>
                            <button
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 hover:border hover:border-green-600 transition"
                              onClick={() => setDraft(course.id)}
                            >
                              <FileCheck fontSize="small" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Set as Draft" arrow>
                            <button
                              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-white hover:text-yellow-600 hover:border hover:border-yellow-600 transition"
                              onClick={() => setDraft(course.id)}
                            >
                              <FilePen fontSize="small" />
                            </button>
                          </Tooltip>
                        )}
                        {course.is_active ? (
                          <Tooltip title="Delete" arrow>
                            <button
                              className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                              onClick={(e) => toggle_status(e, course.id)}
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Restore" arrow>
                            <button
                              className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                              onClick={(e) => toggle_status(e, course.id)}
                            >
                              <RestoreFromTrashIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
