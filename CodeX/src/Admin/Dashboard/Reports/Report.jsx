import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { adminAxios, userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";
import {
  Flag,
  User,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTutorId, setCourseId } from "../../../redux/slices/userSlice";
import Swal from "sweetalert2";
import Loading from "@/User/Components/Loading/Loading";

const Report = () => {
  const [activeTab, setActiveTab] = useState("tutor");
  const [tutorReports, setTutorReports] = useState([]);
  const [courseReports, setCourseReports] = useState([]);
  const [mostReportedTutor, setMostReportedTutor] = useState(null);
  const [mostReportedCourse, setMostReportedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // NEW

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("reports/");

      setTutorReports(response.data.tutor_reports || []);
      setCourseReports(response.data.course_reports || []);
      setMostReportedTutor(response.data.most_reported_tutor || null);
      setMostReportedCourse(response.data.most_reported_course || null);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#0d0d0d",
      color: "#fff",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const endpoint =
        type === "tutor"
          ? `tutor/${reportId}/reports/`
          : `course/${reportId}/reports/`;

      await adminAxios.delete(endpoint);

      Swal.fire({
        title: "Deleted!",
        text: "Report deleted successfully.",
        icon: "success",
        background: "#0d0d0d",
        color: "#fff",
      });

      fetchReports();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete report.",
        icon: "error",
        background: "#0d0d0d",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTutorReport = async (reportId) => {
    try {
      setLoading(true);
      await adminAxios.post(`tutor/${reportId}/reports/`);
      toast.success("Tutor report marked successfully");
      fetchReports();
    } catch (error) {
      toast.error("Failed to mark tutor report");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCourseReport = async (reportId) => {
    try {
      setLoading(true);
      await adminAxios.post(`course/${reportId}/reports/`);
      toast.success("Course report marked successfully");
      fetchReports();
    } catch (error) {
      toast.error("Failed to mark course report");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEntity = (entityId, type) => {
    if (type === "tutor") {
      dispatch(setTutorId(entityId));
      navigate(`/admin/tutor-view/`);
    } else {
      dispatch(setCourseId(entityId));
      navigate("/admin/courses/Overview");
    }
  };

  const rawReports = activeTab === "tutor" ? tutorReports : courseReports;

  const currentReports = rawReports.filter((r) => {
    if (filterType === "marked") return r.is_marked === true;
    if (filterType === "unmarked") return r.is_marked === false;
    return true;
  });

  const mostReported =
    activeTab === "tutor" ? mostReportedTutor : mostReportedCourse;

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-black text-white p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Flag className="text-red-500" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Report Management</h1>
                  <p className="text-gray-400">
                    Monitor and manage reported content
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex gap-4 mb-8"
            >
              <button
                onClick={() => setActiveTab("tutor")}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "tutor"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-green-500/20"
                }`}
              >
                <User size={24} /> Tutor Reports
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-300">
                  {tutorReports.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("course")}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "course"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-green-500/20"
                }`}
              >
                <BookOpen size={24} /> Course Reports
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-300">
                  {courseReports.length}
                </span>
              </button>
            </motion.div>

            {/* MOST REPORTED */}
            {mostReported && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="mb-8 bg-gradient-to-br from-red-900/20 to-black rounded-2xl p-6 border border-red-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-red-400">
                    Most Reported {activeTab === "tutor" ? "Tutor" : "Course"}
                  </h2>
                </div>

                <div className="bg-black/50 rounded-xl p-4 border border-red-500/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {activeTab === "tutor"
                        ? mostReported.tutor_name
                        : mostReported.course_name}
                    </h3>
                    <p className="text-red-400 font-bold">
                      {mostReported.count} Reports
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewEntity(mostReported.id, activeTab)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                  >
                    <Eye size={20} /> View
                  </button>
                </div>
              </motion.div>
            )}

            {/* FILTER BUTTONS */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg border ${
                  filterType === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 text-gray-400 border-green-500/20"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilterType("marked")}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  filterType === "marked"
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 text-gray-400 border-green-500/20"
                }`}
              >
                <CheckCircle size={16} /> Marked
              </button>

              <button
                onClick={() => setFilterType("unmarked")}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  filterType === "unmarked"
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 text-gray-400 border-green-500/20"
                }`}
              >
                <AlertTriangle size={16} /> Unmarked
              </button>
            </div>

            {/* REPORT LIST */}
            {loading ? (
              <Loading />
            ) : currentReports.length > 0 ? (
              <div className="space-y-4">
                {currentReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border ${
                      report.is_marked
                        ? "border-green-500/50 shadow-lg shadow-green-500/30"
                        : "border-green-500/20 hover:border-green-500/40"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {activeTab === "tutor" ? (
                            <User className="text-green-400" size={20} />
                          ) : (
                            <BookOpen className="text-green-400" size={20} />
                          )}
                          <h3 className="text-xl font-bold">
                            {activeTab === "tutor"
                              ? report.tutor_name
                              : report.course_name}
                          </h3>
                        </div>

                        <div className="text-gray-400 text-sm flex gap-4 flex-wrap">
                          <span>
                            Reported by:{" "}
                            <span className="text-green-400">
                              {report.user_name}
                            </span>
                          </span>

                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(report.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() =>
                            handleViewEntity(
                              activeTab === "tutor"
                                ? report.tutor
                                : report.course,
                              activeTab
                            )
                          }
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                        >
                          <Eye size={18} /> View
                        </button>

                        {activeTab === "tutor" ? (
                          <button
                            onClick={() => handleMarkTutorReport(report.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              report.is_marked
                                ? "bg-gray-600 text-white"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            <CheckCircle size={18} />
                            {report.is_marked ? "Marked" : "Mark"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkCourseReport(report.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              report.is_marked
                                ? "bg-gray-600 text-white"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            <CheckCircle size={18} />
                            {report.is_marked ? "Marked" : "Mark"}
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDeleteReport(report.id, activeTab)
                          }
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                        >
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-lg border-l-4 border-red-500">
                      <p className="text-sm text-gray-400 font-semibold">
                        Reason:
                      </p>
                      <p className="text-white">{report.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-green-500/20">
                <Flag className="text-gray-600 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-400">
                  No Reports Found
                </h3>
                <p className="text-gray-500">
                  There are no {activeTab} reports at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Report;
