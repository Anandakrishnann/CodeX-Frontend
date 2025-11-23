import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Users, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import Layout from '../Layout/Layout';
import { tutorAxios } from '../../../../axiosConfig';
import { useSelector } from 'react-redux';
import Loading from '@/User/Components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const AdminCourseAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const course_id = useSelector((state) => state.user.courseId);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await tutorAxios.get(`course-monthly-trends/${course_id}/`);
        const data = response.data;
        console.log(data);

        setAnalyticsData({
          totalUsers: data.total_users,
          monthlyPurchases: data.monthly_purchases,
          yearlyPurchases: data.yearly_purchases,
          totalRevenue: data.total_revenue,
          monthlyRevenue: data.monthly_revenue,
          yearlyRevenue: data.yearly_revenue,
          growthRate: data.growth_rate,
        });

        setMonthlyData(data.monthly_trends || []);
        setYearlyData(data.yearly_trends || []); // 👈 assuming backend sends yearly_trends
      } catch (error) {
        console.error("Error fetching course analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, iconBg, trend }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg border border-white/20 group hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl`}>
            <Icon className="text-white text-2xl" size={28} />
          </div>
          {trend && (
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
              +{trend}%
            </span>
          )}
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        <p className="text-white/60 text-xs">{subtitle}</p>
      </div>
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
        <div className="flex items-center justify-center h-screen text-white text-lg">
          No data available
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-5xl font-extrabold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-white/60 text-lg">Track your course performance and revenue</p>
          </div>
          <button
                    className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-40 mb-5 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Users"
              value={analyticsData.totalUsers?.toLocaleString()}
              subtitle="All time enrollments"
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-blue-400/30"
              trend={analyticsData.growthRate}
            />
            <StatCard
              icon={ShoppingCart}
              title="Monthly Purchases"
              value={analyticsData.monthlyPurchases}
              subtitle="This month"
              gradient="from-purple-500 to-purple-600"
              iconBg="bg-purple-400/30"
              trend={12.3}
            />
            <StatCard
              icon={Calendar}
              title="Yearly Purchases"
              value={analyticsData.yearlyPurchases?.toLocaleString()}
              subtitle="Last 12 months"
              gradient="from-green-500 to-green-600"
              iconBg="bg-green-400/30"
              trend={18.7}
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`$${(analyticsData.totalRevenue / 1000).toFixed(1)}k`}
              subtitle="All time earnings"
              gradient="from-orange-500 to-orange-600"
              iconBg="bg-orange-400/30"
              trend={25.4}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trend Chart */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-cyan-400" size={24} />
                Monthly Purchase Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="purchases" 
                    stroke="#06B6D4" 
                    fillOpacity={1} 
                    fill="url(#colorPurchases)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={24} />
                Monthly Revenue
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 👇 New Yearly Purchase Trend Chart */}
          {yearlyData.length > 0 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-yellow-400" size={24} />
                Yearly Purchase Trend
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    stroke="#FACC15"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#FACC15' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-2xl p-6">
              <h4 className="text-cyan-400 font-semibold mb-2">Monthly Revenue</h4>
              <p className="text-white text-2xl font-bold">${analyticsData.monthlyRevenue?.toLocaleString()}</p>
              <p className="text-white/60 text-sm mt-1">Current month earnings</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6">
              <h4 className="text-purple-400 font-semibold mb-2">Yearly Revenue</h4>
              <p className="text-white text-2xl font-bold">${analyticsData.yearlyRevenue?.toLocaleString()}</p>
              <p className="text-white/60 text-sm mt-1">Last 12 months earnings</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6">
              <h4 className="text-orange-400 font-semibold mb-2">Average Revenue</h4>
              <p className="text-white text-2xl font-bold">${(analyticsData.totalRevenue / analyticsData.totalUsers).toFixed(2)}</p>
              <p className="text-white/60 text-sm mt-1">Per user lifetime value</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourseAnalytics;
