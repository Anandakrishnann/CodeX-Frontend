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
import { Search, Plus, User } from "lucide-react";
import Loading from "@/User/Components/Loading/Loading.jsx";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("accepted");
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await adminAxios.get("list_applicaions/");
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
    const pending = applications.filter(
      (app) => app.status === "pending"
    ).length;
    const accepted = applications.filter(
      (app) => app.status === "verified"
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "rejected"
    ).length;

    setPendingCount(pending);
    setAcceptedCount(accepted);
    setRejectedCount(rejected);
  }, [applications]);

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
            {/* Header Section with Animated Gradient */}
            <div className="mb-8">
              <h2 className="text-5xl font-extrabold text-white">
                Applications
              </h2>
            </div>

            <div className="flex-1 max-w-md mb-6 mt-2">
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

            {/* Filter Buttons with Glass Morphism */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center">
              <button
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "pending"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl shadow-orange-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setFilter("pending")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <AccessTimeIcon className="text-xl" />
                  Pending
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {pendingCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "accepted"
                    ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-2xl shadow-green-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setFilter("accepted")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <TaskAltIcon className="text-xl" />
                  Accepted
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {acceptedCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "rejected"
                    ? "bg-gradient-to-r from-red-500 to-rose-700 text-white shadow-2xl shadow-red-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setFilter("rejected")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <CancelIcon className="text-xl" />
                  Rejected
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {rejectedCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Card Grid with Stagger Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApps.length > 0 ? (
                filteredApps.map((application, index) => (
                  <div
                    key={application.id}
                    className="group relative bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl transition-all duration-500 transform "
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Gradient Border Effect */}

                    <div className="flex items-start gap-5">
                      {/* Profile Image with Ring Effect */}
                      <div className="relative">
                        <div className="absolute inset-0  rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        <img
                          src={application.profile_picture}
                          alt="profile"
                          className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-2xl font-black text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                          {application.full_name}
                        </h3>

                        <p className="text-sm text-gray-500 font-medium mb-3">
                          📅 {new Date(application.created_at).toDateString()}
                        </p>

                        <div className="mb-4">{badge(application.status)}</div>

                        {/* View Button with Hover Effect */}
                        <button
                          className="group/btn relative w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleNavigate(application.id)}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <VisibilityIcon className="text-xl" />
                            View Details
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="text-white/20 text-8xl mb-4">📋</div>
                  <p className="text-white/80 text-3xl font-bold">
                    No applications found
                  </p>
                  <p className="text-white/60 text-lg mt-2">
                    Try selecting a different filter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
};

export default Applications;
