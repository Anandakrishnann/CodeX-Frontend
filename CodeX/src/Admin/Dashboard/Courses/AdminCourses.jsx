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
  Search,
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
import Loading from "@/User/Components/Loading/Loading";
import Swal from "sweetalert2";

const Courses = () => {
  const [Courses, setCourses] = useState([]);
  const tutor = useSelector((state) => state.user.user);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState("active");
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("list-courses/");
      setCourses(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggle_status = async (e, course_id) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Change Status?",
      text: "Are you sure you want to change the status of this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const response = await adminAxios.post(`course-status/${course_id}/`);
      toast.success(response.data?.message || "Status Changed Successfully");

      fetchCourses();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Course not Found"
      );
    } finally {
      setLoading(false);
    }
  };

  const setDraft = async (id) => {
    try {
      setLoading(true);
      await adminAxios.post(`set-draft/${id}/`);
      toast.success("Course set to Draft");
      fetchCourses();
    } catch (error) {
      toast.error(error || "Error While Set Draft");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pending = Courses.filter((c) => c.status === "pending").length;
    const accepted = Courses.filter((c) => c.status === "accepted").length;
    const rejected = Courses.filter((c) => c.status === "rejected").length;
    const activeCourses = Courses.filter((c) => !c.is_draft).length;
    const draftCourses = Courses.filter((c) => c.is_draft).length;

    let result = [];

    if (searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();
      result = Courses.filter((course) => {
        return (
          course.name.toLowerCase().includes(lower) ||
          course.title.toLowerCase().includes(lower) ||
          course.category.toLowerCase().includes(lower) ||
          course.level.toLowerCase().includes(lower) ||
          course.created_by.toLowerCase().includes(lower)
        );
      });
    }

    else {
      result = Courses.filter((course) => {
        if (filter === "active") return !course.is_draft;
        if (filter === "draft") return course.is_draft;
        return true;
      });
    }
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
    setActiveCount(activeCourses);
    setDraftCount(draftCourses);
  }, [Courses, filter, searchQuery]);

    useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredLessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      {loading ? (
        <Loading />
      ) : (
        <div className="p-8 min-h-screen relative z-10  text-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex mb-12">
              <div className="flex">
                <h2 className="text-5xl font-extrabold text-white">Courses</h2>
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

            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setFilter("active")}
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "active"
                    ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-2xl shadow-green-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Active Courses
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {activeCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => setFilter("draft")}
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "draft"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl shadow-orange-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Drafted Courses
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {draftCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {paginatedApps && paginatedApps.length > 0 ? (
                paginatedApps.map((course, index) => (
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
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="text-white/20 text-8xl mb-4">📚</div>
                  <p className="text-white/80 text-3xl font-bold">
                    {filter === "active"
                      ? "No Active Courses Found"
                      : "No Drafted Courses Found"}
                  </p>
                  <p className="text-white/60 text-lg mt-2">
                    {filter === "active"
                      ? "All courses are currently in draft mode"
                      : "No courses are in draft mode"}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Courses;
