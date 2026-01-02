import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import Layout from "../../Layout/Layout";
import { tutorAxios } from "../../../../../../axiosConfig";
import { useSelector } from "react-redux";
import Loading from "@/User/Components/Loading/Loading";
import { useNavigate } from "react-router-dom";

const CourseAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const course_id = useSelector((state) => state.user.courseId);

  useEffect(() => {
    if (!course_id) return;

    const fetchAnalytics = async () => {
      try {
        const { data } = await tutorAxios.get(
          `course-monthly-trends/${course_id}/`
        );

        setAnalyticsData({
          totalUsers: data.total_users,
          monthlyPurchases: data.monthly_purchases,
          yearlyPurchases: data.yearly_purchases,
          totalRevenue: data.total_revenue,
          monthlyRevenue: data.monthly_revenue,
          yearlyRevenue: data.yearly_revenue,
          growthRate: data.growth_rate,
          avgRevenue: data.average_revenue_per_user,
        });

        setMonthlyData(data.monthly_trends || []);
        setYearlyData(data.yearly_trends || []);
      } catch (error) {
        console.error("Error fetching course analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [course_id]);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    iconBg,
    trend,
  }) => (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl border-2 border-black hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${iconBg} p-3 rounded-xl border-2 border-black shadow-lg`}
        >
          <Icon className="text-black" size={28} strokeWidth={2.5} />
        </div>
      </div>

      <h3 className="text-black/70 text-sm font-bold mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-black text-4xl font-black mb-1">{value}</p>
      <p className="text-black/60 text-xs font-semibold">{subtitle}</p>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!analyticsData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-black text-xl font-bold">No data available</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 min-h-screen ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Course Analytics
          </h1>
          <p className="text-gray-600 font-semibold">
            Track your course performance and revenue
          </p>
          <button
            className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-20 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={analyticsData.totalUsers}
            subtitle="All time enrollments"
            gradient="from-blue-400 to-blue-500"
            iconBg="bg-white"
            trend={analyticsData.growthRate}
          />
          <StatCard
            icon={ShoppingCart}
            title="Monthly Purchases"
            value={analyticsData.monthlyPurchases}
            subtitle="This month"
            gradient="from-purple-400 to-purple-500"
            iconBg="bg-white"
          />
          <StatCard
            icon={Calendar}
            title="Yearly Purchases"
            value={analyticsData.yearlyPurchases}
            subtitle="This year"
            gradient="from-green-400 to-green-500"
            iconBg="bg-white"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${analyticsData.totalRevenue}`}
            subtitle="All time earnings"
            gradient="from-orange-400 to-orange-500"
            iconBg="bg-white"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-black">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-black">Monthly Trends</h2>
              <div className="px-3 py-1 bg-green-500 text-black rounded-full text-xs font-bold border-2 border-black">
                Last 6 Months
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorPurchases"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                />
                <XAxis
                  dataKey="month"
                  stroke="#000"
                  strokeWidth={2}
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                />
                <YAxis
                  stroke="#000"
                  strokeWidth={2}
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #000",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#colorPurchases)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Trends */}
          {yearlyData.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-black">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-black">
                  Yearly Growth
                </h2>
                <div className="px-3 py-1 bg-green-500 text-black rounded-full text-xs font-bold border-2 border-black">
                  All Years
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeWidth={2}
                  />
                  <XAxis
                    dataKey="year"
                    stroke="#000"
                    strokeWidth={2}
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#000"
                    strokeWidth={2}
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #000",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar
                    dataKey="purchases"
                    fill="#22c55e"
                    radius={[8, 8, 0, 0]}
                    stroke="#000"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-6 shadow-xl border-2 border-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg border-2 border-black">
                <DollarSign className="text-black" size={24} strokeWidth={3} />
              </div>
              <span className="text-white/80 text-sm font-bold uppercase tracking-wide">
                Monthly Revenue
              </span>
            </div>
            <p className="text-white text-3xl font-black">
              ${analyticsData.monthlyRevenue}
            </p>
            <p className="text-green-500 text-sm font-bold mt-2">
              Current month earnings
            </p>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-6 shadow-xl border-2 border-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg border-2 border-black">
                <TrendingUp className="text-black" size={24} strokeWidth={3} />
              </div>
              <span className="text-white/80 text-sm font-bold uppercase tracking-wide">
                Yearly Revenue
              </span>
            </div>
            <p className="text-white text-3xl font-black">
              ${analyticsData.yearlyRevenue}
            </p>
            <p className="text-green-500 text-sm font-bold mt-2">
              Total year earnings
            </p>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-6 shadow-xl border-2 border-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg border-2 border-black">
                <Users className="text-black" size={24} strokeWidth={3} />
              </div>
              <span className="text-white/80 text-sm font-bold uppercase tracking-wide">
                Avg Revenue / User
              </span>
            </div>
            <p className="text-white text-3xl font-black">
              ${analyticsData.avgRevenue}
            </p>
            <p className="text-green-500 text-sm font-bold mt-2">
              Per user value
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseAnalytics;
