import React, { useEffect, useState } from "react";
import { LineChart, BarChart } from "@mui/x-charts";
import Layout from "./Layout/Layout";
import { adminAxios } from "../../../axiosConfig";
import Loading from "@/User/Components/Loading/Loading";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await adminAxios.get("admin-dashboard/");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Dashboard Overview
            </h1>
            <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard 
              title="Total Users" 
              value={analytics.total_users} 
              gradient="from-blue-500 via-blue-600 to-cyan-500"
              icon="👥"
            />
            <StatCard 
              title="Total Tutors" 
              value={analytics.total_tutors} 
              gradient="from-emerald-500 via-green-600 to-teal-500"
              icon="🎓"
            />
            <StatCard 
              title="Total Courses" 
              value={analytics.total_courses} 
              gradient="from-purple-500 via-purple-600 to-pink-500"
              icon="📚"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${analytics.total_revenue}`} 
              gradient="from-orange-500 via-amber-600 to-yellow-500"
              icon="💰"
            />
          </div>

          {/* Revenue Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ChartCard title="Monthly Revenue Trend" icon="📈">
              <div className="mt-4">
                <LineChart
                  xAxis={[{ 
                    data: analytics.monthly_revenue_trend.map(item => item.month), 
                    scaleType: "point",
                  }]}
                  series={[{ 
                    data: analytics.monthly_revenue_trend.map(item => Number(item.revenue)), 
                    color: "#10B981",
                    curve: "natural"
                  }]}
                  width={500}
                  height={300}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tick': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tickLabel': { fill: '#9CA3AF' }
                  }}
                />
              </div>
            </ChartCard>

            <ChartCard title="Yearly Revenue Trend" icon="📊">
              <div className="mt-4">
                <BarChart
                  xAxis={[{ 
                    data: analytics.yearly_revenue_trend.map(item => String(item.year)), 
                    scaleType: "band"
                  }]}
                  series={[{ 
                    data: analytics.yearly_revenue_trend.map(item => Number(item.revenue)), 
                    color: "#8B5CF6"
                  }]}
                  width={500}
                  height={300}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tick': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tickLabel': { fill: '#9CA3AF' }
                  }}
                />
              </div>
            </ChartCard>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ListCard 
              title="Top Tutors" 
              items={analytics.top_tutors} 
              label="earnings" 
              icon="🏆"
              accentColor="text-amber-400"
            />
            <ListCard 
              title="Top Courses" 
              items={analytics.top_courses} 
              label="enrollments" 
              icon="⭐"
              accentColor="text-purple-400"
            />
          </div>

          {/* User Growth & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ChartCard title="User Growth Trend" icon="📱">
              <div className="mt-4">
                <LineChart
                  xAxis={[{ 
                    data: analytics.user_growth.map(item => item.month), 
                    scaleType: "point" 
                  }]}
                  series={[{ 
                    data: analytics.user_growth.map(item => Number(item.count)), 
                    color: "#06B6D4",
                    curve: "natural"
                  }]}
                  width={500}
                  height={300}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tick': { stroke: '#6B7280' },
                    '& .MuiChartsAxis-tickLabel': { fill: '#9CA3AF' }
                  }}
                />
              </div>
            </ChartCard>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💳</span>
                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {analytics.recent_transactions.map((txn, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 border border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{txn.user}</p>
                      <p className="text-purple-400 text-sm truncate">{txn.course}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-semibold">${txn.amount}</span>
                      <span className="text-gray-400 text-sm whitespace-nowrap">{txn.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </Layout>
  );
};

const StatCard = ({ title, value, gradient, icon }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider">{title}</h3>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
      <p className="text-4xl font-bold text-white drop-shadow-lg">{value}</p>
      <div className="mt-4 h-1 w-16 bg-white/40 rounded-full"></div>
    </div>
  </div>
);

const ChartCard = ({ title, children, icon }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

const ListCard = ({ title, items, label, icon, accentColor }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 group border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm`}>
              {idx + 1}
            </div>
            <span className="text-white font-medium">{item.name}</span>
          </div>
          <span className={`${accentColor} font-semibold text-lg group-hover:scale-110 transition-transform`}>
            {label === "earnings" ? `$${item[label]}` : item[label]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;