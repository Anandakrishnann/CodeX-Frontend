import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "./Layout/Layout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AccessTime,
  EmojiEvents,
  Whatshot,
  BarChart,
  CalendarToday,
} from "@mui/icons-material";
import {
  LuActivity,
  LuBrain,
  LuBookOpen,
  LuGraduationCap,
  LuTrophy,
} from "react-icons/lu";
import { userAxios } from "../../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { couch } from "globals";
import Loading from "@/User/Components/Loading/Loading";

const UserDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userAxios.get("user_dashboard/");
        setDashboardData(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchDashboard();
  }, []);

  const course = () => {
    navigate("/user/courses");
  };

  if (!dashboardData) {
    return (
      <Layout page={"Home"}>
        <Loading />
      </Layout>
    );
  }

  const { stats, current_course, completed_course } = dashboardData;
  const activeCourses = Array.isArray(current_course)
    ? current_course
    : current_course
    ? [current_course]
    : [];
  const completedCourses = Array.isArray(completed_course)
    ? completed_course
    : completed_course
    ? [completed_course]
    : [];
  

  return (
    <Layout page={"Home"}>
      <div className="p-6 relative z-10 min-h-screen">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white p-8 rounded-2xl shadow-lg mb-8 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-4xl font-bold mb-2 flex items-center">
                Good {timeOfDay},{" "}
                <span className=" ml-2">{user.first_name}</span>!
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="ml-3 text-yellow-300"
                >
                  👋
                </motion.div>
              </h2>
              <p className="text-indigo-200 text-lg">
                Ready to continue your learning journey?
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <CalendarToday className="text-indigo-300" fontSize="small" />
              <span className="text-indigo-100">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <QuickStat
              icon={<LuBookOpen className="text-cyan-300" />}
              value={stats.active_courses}
              label="Active Courses"
            />
            <QuickStat
              icon={<LuGraduationCap className="text-green-300" />}
              value={stats.completed_courses}
              label="Completed"
            />
            <QuickStat
              icon={<LuTrophy className="text-yellow-300" />}
              value={stats.achievements}
              label="Achievements"
            />
            <QuickStat
              icon={<Whatshot className="text-orange-300" />}
              value={stats.day_streak}
              label="Day Streak"
            />
          </div>
        </motion.div>

        {/* Learning Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-white flex items-center">
              <LuBrain className="mr-3 text-purple-400" />
              Your Learning Journey
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Courses */}
            {activeCourses.length > 0 ? (
              activeCourses.map((course, index) => (
                <CourseCard
                  key={`active-${index}`}
                  title={course.title}
                  description={course.description}
                  progress={course.progress || 0}
                  status={course.status}
                  lastAccessed={course.last_accessed}
                  color="blue"
                  buttonType="Continue Learning"
                />
              ))
            ) : (
              <div className="text-indigo-200 bg-white/5 rounded-xl p-6 text-center col-span-2">
                <p>No active courses found. Start learning today! 🚀</p>
              </div>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 ? (
              completedCourses.map((course, index) => (
                <CourseCard
                  key={`completed-${index}`}
                  title={course.title}
                  description={course.description}
                  progress={null}
                  status="Completed"
                  completedOn={course.completed_on}
                  color="green"
                  buttonType="View Certificate"
                />
              ))
            ) : (
              <div className="text-green-200 bg-white/5 rounded-xl p-6 text-center col-span-2">
                <p>No completed courses yet. Keep going! 💪</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Quick Stats Component
const QuickStat = ({ icon, value, label }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 border border-white/5">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-indigo-200">{label}</div>
    </div>
  </div>
);

// Dynamic Course Card Component
const CourseCard = ({
  title,
  description,
  progress,
  status,
  lastAccessed,
  completedOn,
  color,
  buttonType,
}) => {
  const colors = {
    blue: {
      gradient: "from-blue-900 via-blue-800 to-indigo-900",
      border: "border-blue-700/30",
      bar: "from-blue-400 to-cyan-400",
      iconBg: "bg-blue-500/20",
      text: "text-blue-200",
      tag: "bg-blue-500/30 text-blue-100",
    },
    green: {
      gradient: "from-green-900 via-green-800 to-teal-900",
      border: "border-green-700/30",
      bar: "from-green-400 to-emerald-400",
      iconBg: "bg-green-500/20",
      text: "text-green-200",
      tag: "bg-green-500/30 text-green-100",
    },
  };
  const navigate = useNavigate();

  const c = colors[color];

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative overflow-hidden bg-gradient-to-br ${c.gradient} rounded-2xl shadow-xl border ${c.border}`}
    >
      <div className="p-6">
        {progress && (
          <div
            className={`absolute top-0 left-0 h-1.5 bg-gradient-to-r ${c.bar}`}
            style={{ width: `${progress}%` }}
          ></div>
        )}

        <div className="flex items-start">
          <div className={`${c.iconBg} p-4 rounded-xl mr-4 backdrop-blur-sm`}>
            {color === "blue" ? (
              <LuActivity className="text-blue-300 text-2xl" />
            ) : (
              <TrendingUp className="text-green-300 text-2xl" />
            )}
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-xl text-white">{title}</h4>
              <span
                className={`${c.tag} text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border border-white/10`}
              >
                {status}
              </span>
            </div>

            <p className={`${c.text} mb-4`}>{description}</p>

            {progress && (
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-3">
                <div
                  className={`bg-gradient-to-r ${c.bar} h-2.5 rounded-full relative`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
            )}

            <div
              className={`flex justify-between items-center text-sm ${c.text}`}
            >
              {progress !== null ? (
                <>
                  <div className="flex items-center">
                    <BarChart className="mr-1" fontSize="small" />
                    <span>{progress}% completed</span>
                  </div>
                  {lastAccessed && (
                    <div className="flex items-center">
                      <AccessTime className="mr-1" fontSize="small" />
                      <span>
                        Started:{" "}
                        {new Date(lastAccessed).toLocaleDateString("en-US")}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                completedOn && (
                  <div className="flex items-center">
                    <EmojiEvents className="mr-1" fontSize="small" />
                    <span>
                      Completed on:{" "}
                      {new Date(completedOn).toLocaleDateString("en-US")}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/user/courses")}
          className={`w-full mt-6 bg-gradient-to-r ${c.bar} hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center`}
        >
          <span>{buttonType}</span>
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {buttonType === "Continue Learning" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
