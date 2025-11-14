"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarToday, EmojiEvents } from "@mui/icons-material";
import {
  Activity,
  LayoutDashboard,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  DollarSign,
} from "lucide-react";
import Layout from "./Layout/Layout";
import { tutorAxios } from "../../../../axiosConfig";
import { useSelector } from "react-redux";

const TutorDashboard = () => {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [data, setData] = useState(null);
  const tutor = useSelector((state) => state.user.user)

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await tutorAxios.get("tutor_dashboard/");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching tutor dashboard:", err);
    }
  };

  if (!data) return <div className="text-white p-6">Loading...</div>;

  const summary = data.summary;

  return (
    <Layout>
      <div className="min-h-screen text-white">
        <div className="p-6 relative z-10 min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white p-8 rounded-2xl shadow-lg mb-8 border border-indigo-700/30 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-4xl font-bold mb-2 flex items-center">
                  Good {timeOfDay}, {tutor.first_name}!
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
                  Here's how your courses are performing today.
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
              <QuickStat icon={<BookOpen className="text-cyan-300" />} value={summary.total_courses} label="Total Courses" />
              <QuickStat icon={<Users className="text-green-300" />} value={summary.total_students} label="Total Students" />
              <QuickStat icon={<DollarSign className="text-yellow-300" />} value={`$${summary.total_revenue}`} label="Total Revenue" />
              <QuickStat icon={<Clock className="text-pink-300" />} value={`${summary.avg_progress}%`} label="Avg Course Progress" />
            </div>
          </motion.div>

          {/* Courses Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <OverviewCard
              title="Active Courses"
              count={summary.active_courses}
              label="Currently Published"
              color="blue"
            />
            <OverviewCard
              title="Draft Courses"
              count={summary.draft_courses}
              label="Yet to Publish"
              color="purple"
            />
          </div>

          {/* Recent Enrollments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <LayoutDashboard className="mr-2 text-purple-400" />
              Recent Enrollments
            </h3>
            <div className="space-y-4">
              {data.recent_enrollments.map((enroll, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white/10 rounded-xl p-4 border border-white/5"
                >
                  <div>
                    <p className="text-white font-medium">
                      {enroll.user}
                    </p>
                    <p className="text-indigo-200 text-sm">{enroll.course}</p>
                  </div>
                  <div className="text-sm text-gray-300">{enroll.date}</div>
                  <span className={`px-3 py-1.5 text-xs rounded-full ${
                    enroll.status === "completed"
                      ? "bg-green-500/20 text-green-300"
                      : enroll.status === "progress"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}>
                    {enroll.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// 🔹 Reusable QuickStat Component
const QuickStat = ({ icon, value, label }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 border border-white/5">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-indigo-200">{label}</div>
    </div>
  </div>
);

// 🔹 Overview Card
const OverviewCard = ({ title, count, label, color }) => {
  const gradients = {
    blue: "from-blue-900 via-blue-800 to-indigo-900 border-blue-700/30",
    purple: "from-purple-900 via-indigo-800 to-purple-900 border-purple-700/30",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradients[color]} rounded-2xl shadow-xl border`}
    >
      <div className="p-6">
        <h4 className="font-bold text-xl text-white mb-2">{title}</h4>
        <p className="text-indigo-200">{label}</p>
        <div className="text-4xl font-bold mt-4 text-white">{count}</div>
      </div>
    </motion.div>
  );
};

export default TutorDashboard;
