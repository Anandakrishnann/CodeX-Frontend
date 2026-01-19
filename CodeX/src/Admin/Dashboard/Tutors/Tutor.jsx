import React, { useEffect, useState } from "react";
import { adminAxios } from "../../../../axiosConfig.js";
import { toast } from "react-toastify";
import Table from "../../Components/Table/Table.jsx";
import { Search, Plus, User } from "lucide-react";
import Layout from "../Layout/Layout.jsx";
import Loading from "@/User/Components/Loading/Loading.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTutorId } from "@/redux/slices/userSlice.js";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeCount = tutors.filter((t) => t.status === false).length;
  const inactiveCount = tutors.filter((t) => t.status === true).length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminAxios.get("list-tutors/");

        setTutors(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const lower = searchQuery.toLowerCase();

    if (searchQuery.trim() !== "") {
      return (
        tutor.first_name.toLowerCase().includes(lower) ||
        tutor.last_name.toLowerCase().includes(lower) ||
        tutor.email.toLowerCase().includes(lower)
      );
    }

    if (filter === "active") return tutor.status === false;
    if (filter === "inactive") return tutor.status === true;

    return true;
  });

    useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredTutors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const handleNavigate = (id) => {
    dispatch(setTutorId(id));
    navigate("/admin/tutor-view/");
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
              <h2 className="text-5xl font-extrabold text-white">Tutor's</h2>
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center">
              <button
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "active"
                    ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-2xl shadow-green-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setFilter("active")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <TaskAltIcon className="text-xl" />
                  Active Tutors
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {activeCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                className={`group relative text-lg font-bold px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  filter === "inactive"
                    ? "bg-gradient-to-r from-red-500 to-rose-700 text-white shadow-2xl shadow-red-500/50"
                    : "bg-white/10 text-white backdrop-blur-lg border-2 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setFilter("inactive")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <BlockIcon className="text-xl" />
                  Inactive Tutors
                  <span className="bg-white/90 text-gray-900 font-black rounded-full px-3 py-1 text-sm shadow-lg">
                    {inactiveCount}
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Card Grid with Stagger Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedApps.length > 0 ? (
                paginatedApps.map((tutor, index) => (
                  <div
                    key={tutor.id}
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
                          src={tutor.picture}
                          alt="profile"
                          className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-2xl font-black text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                          {tutor.first_name} {tutor.last_name}
                        </h3>

                        <p className="text-sm text-gray-500 font-medium mb-3">
                          📅 {new Date(tutor.subscribed_on).toDateString()}
                        </p>

                        <div className="mb-4">
                          {tutor.status === false ? (
                            <span className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-gradient-to-r from-green-400 to-emerald-600 rounded-full text-sm font-semibold shadow-lg">
                              <TaskAltIcon className="text-white text-lg" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-gradient-to-r from-red-500 to-rose-700 rounded-full text-sm font-semibold shadow-lg">
                              <BlockIcon className="text-white text-lg" />
                              Blocked
                            </span>
                          )}
                        </div>

                        {/* View Button with Hover Effect */}
                        <button
                          className="group/btn relative w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleNavigate(tutor.id)}
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
                    No tutors found
                  </p>
                  <p className="text-white/60 text-lg mt-2">
                    Try selecting a different filter
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

export default Tutors;
