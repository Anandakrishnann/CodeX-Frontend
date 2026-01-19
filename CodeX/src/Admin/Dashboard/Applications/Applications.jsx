import React, { useEffect, useState } from "react";
import { adminAxios } from "../../../../axiosConfig.js";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Layout from "../Layout/Layout";
import { useDispatch } from "react-redux";
import { setApplicationId } from "../../../redux/slices/userSlice.js";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Loading from "@/User/Components/Loading/Loading.jsx";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("accepted");
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await adminAxios.get("list-applicaions/");
        setApplications(response.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error.response || error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const pending = applications.filter(a => a.status === "pending").length;
    const accepted = applications.filter(a => a.status === "verified").length;
    const rejected = applications.filter(a => a.status === "rejected").length;
    setPendingCount(pending);
    setAcceptedCount(accepted);
    setRejectedCount(rejected);
  }, [applications]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleNavigate = (id) => {
    dispatch(setApplicationId(id));
    navigate("/admin/application-view/");
  };

  const filteredApps = applications.filter((app) => {
    const lower = searchQuery.toLowerCase();
    if (searchQuery.trim() !== "") {
      return (
        app.full_name.toLowerCase().includes(lower) ||
        app.email?.toLowerCase().includes(lower) ||
        app.status.toLowerCase().includes(lower)
      );
    }
    if (filter === "accepted") return app.status === "verified";
    if (filter === "pending") return app.status === "pending";
    if (filter === "rejected") return app.status === "rejected";
    return true;
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const badge = (status) => {
    if (status === "pending")
      return (
        <span className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-sm font-semibold shadow-lg animate-pulse">
          <AccessTimeIcon className="text-white text-lg" /> Pending
        </span>
      );
    if (status === "verified")
      return (
        <span className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-gradient-to-r from-green-400 to-emerald-600 rounded-full text-sm font-semibold shadow-lg">
          <TaskAltIcon className="text-white text-lg" /> Accepted
        </span>
      );
    if (status === "rejected")
      return (
        <span className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-gradient-to-r from-red-500 to-rose-700 rounded-full text-sm font-semibold shadow-lg">
          <CancelIcon className="text-white text-lg" /> Rejected
        </span>
      );
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen">
          <div className="p-8">
            <h2 className="text-5xl font-extrabold text-white mb-8">
              Applications
            </h2>

            <div className="flex-1 max-w-md mb-6">
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

            <div className="flex flex-wrap gap-4 mb-10 justify-center">
              <button
                onClick={() => setFilter("pending")}
                className={`px-8 py-3 rounded-2xl font-bold ${
                  filter === "pending"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                Pending {pendingCount}
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-8 py-3 rounded-2xl font-bold ${
                  filter === "accepted"
                    ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                Accepted {acceptedCount}
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-8 py-3 rounded-2xl font-bold ${
                  filter === "rejected"
                    ? "bg-gradient-to-r from-red-500 to-rose-700 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                Rejected {rejectedCount}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedApps.length > 0 ? (
                paginatedApps.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white/95 p-6 rounded-3xl shadow-2xl"
                  >
                    <div className="flex gap-5">
                      <img
                        src={application.profile_picture}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900">
                          {application.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(application.created_at).toDateString()}
                        </p>
                        <div className="mb-4">
                          {badge(application.status)}
                        </div>
                        <button
                          onClick={() => handleNavigate(application.id)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl"
                        >
                          <VisibilityIcon /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-white text-2xl">
                  No applications found
                </div>
              )}
            </div>


              <div className="flex justify-center gap-2 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 bg-white rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 bg-white rounded-lg disabled:opacity-40"
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

export default Applications;
