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
  CalendarToday
} from "@mui/icons-material";
import { MdEdit } from "react-icons/md";
import { LuActivity, LuBrain, LuBookOpen, LuGraduationCap, LuTrophy } from "react-icons/lu";

const UserDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [timeOfDay, setTimeOfDay] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  return (
    <Layout page={"Home"}>
      {/* Dashboard Content */}
      <div className="p-6 relative z-10 min-h-screen">
        {/* Welcome Section - Enhanced with animation and gradient */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white p-8 rounded-2xl shadow-lg mb-8 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-4xl font-bold mb-2 flex items-center">
                Good {timeOfDay}, <span className=" ml-2">{user.first_name}</span>!
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="ml-3 text-yellow-300"
                >
                  👋
                </motion.div>
              </h2>
              <p className="text-indigo-200 text-lg">Ready to continue your learning journey?</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <CalendarToday className="text-indigo-300" fontSize="small" />
              <span className="text-indigo-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <QuickStat icon={<LuBookOpen className="text-cyan-300" />} value="2" label="Active Courses" />
            <QuickStat icon={<LuGraduationCap className="text-green-300" />} value="3" label="Completed" />
            <QuickStat icon={<LuTrophy className="text-yellow-300" />} value="5" label="Achievements" />
            <QuickStat icon={<Whatshot className="text-orange-300" />} value="7" label="Day Streak" />
          </div>
        </motion.div>

        {/* Learning Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-white flex items-center">
              <LuBrain className="mr-3 text-purple-400" />
              Your Learning Journey
            </h3>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-900/30">
              <span>View All Courses</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In Progress Course Card - Enhanced with better gradients and animations */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-xl border border-blue-700/30"
            >
              {/* Glowing corner effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
              
              <div className="p-6">
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 w-[65%]"></div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500/20 p-4 rounded-xl mr-4 backdrop-blur-sm">
                    <LuActivity className="text-blue-300 text-2xl" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-xl text-white">
                        Advanced React Development
                      </h4>
                      <span className="bg-blue-500/30 text-blue-100 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border border-blue-400/20">
                        In Progress
                      </span>
                    </div>

                    <p className="text-blue-200 mb-4">
                      Master modern React patterns and best practices
                    </p>

                    <div className="w-full bg-blue-900/50 rounded-full h-2.5 mb-3 backdrop-blur-sm">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2.5 rounded-full relative"
                        style={{ width: "65%" }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-blue-500/50"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-blue-300">
                      <div className="flex items-center">
                        <BarChart className="mr-1" fontSize="small" />
                        <span>65% completed</span>
                      </div>
                      <div className="flex items-center">
                        <AccessTime className="mr-1" fontSize="small" />
                        <span>Last accessed: 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-700/50 flex items-center justify-center">
                  <span>Continue Learning</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Completed Course Card - Enhanced with better gradients and animations */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-teal-900 rounded-2xl shadow-xl border border-green-700/30"
            >
              {/* Glowing corner effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>
              
              <div className="p-6">
                {/* Completion indicator */}
                <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-green-400 to-emerald-400 w-full"></div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-500/20 p-4 rounded-xl mr-4 backdrop-blur-sm">
                    <TrendingUp className="text-green-300 text-2xl" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-xl text-white">
                        JavaScript Fundamentals
                      </h4>
                      <span className="bg-green-500/30 text-green-100 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border border-green-400/20">
                        Completed
                      </span>
                    </div>

                    <p className="text-green-200 mb-4">
                      Core concepts and practical applications
                    </p>

                    <div className="w-full bg-green-900/50 rounded-full h-2.5 mb-3 backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2.5 rounded-full w-full">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-green-500/50"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-green-300">
                      <div className="flex items-center">
                        <EmojiEvents className="mr-1" fontSize="small" />
                        <span>100% completed</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarToday className="mr-1" fontSize="small" />
                        <span>Completed on: May 2, 2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-700/50 flex items-center justify-center">
                  <span>View Certificate</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Split into two columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activities - Enhanced with timeline design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activities
              </h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-indigo-500">
              <ActivityItem 
                icon={<LuBookOpen />} 
                text="Completed 'React Basics' module" 
                time="Today, 10:30 AM" 
                color="purple"
              />
              <ActivityItem 
                icon={<LuTrophy />} 
                text="Achieved 'JavaScript Expert' badge" 
                time="Yesterday, 3:45 PM" 
                color="yellow"
              />
              <ActivityItem 
                icon={<LuActivity />} 
                text="Started 'Advanced Python' course" 
                time="May 15, 2023" 
                color="blue"
              />
              <ActivityItem 
                icon={<LuGraduationCap />} 
                text="Completed final assessment with 95% score" 
                time="May 10, 2023" 
                color="green"
              />
            </div>
          </motion.div>
          
          {/* Recommended Next Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-xl border border-indigo-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Next Steps
            </h3>
            
            <div className="space-y-4">
              <NextStepItem 
                title="Complete React Module" 
                description="Finish the current module to unlock advanced topics"
                progress={65}
                color="blue"
              />
              <NextStepItem 
                title="Take Practice Quiz" 
                description="Test your knowledge with a quick assessment"
                progress={0}
                color="purple"
              />
              <NextStepItem 
                title="Join Community Discussion" 
                description="Share your progress with fellow learners"
                progress={0}
                color="pink"
              />
            </div>
            
            <button className="w-full mt-5 bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-all duration-300 border border-white/10">
              View Learning Path
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// Quick Stat Component
const QuickStat = ({ icon, value, label }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 border border-white/5">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-indigo-200">{label}</div>
    </div>
  </div>
);

// Enhanced Activity Item Component
const ActivityItem = ({ icon, text, time, color }) => {
  const colors = {
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500"
  };
  
  return (
    <div className="relative">
      <div className={`absolute -left-10 w-6 h-6 rounded-full ${colors[color]} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-colors">
        <p className="text-white font-medium">{text}</p>
        <p className="text-gray-400 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
};

// Next Step Item Component
const NextStepItem = ({ title, description, progress, color }) => {
  const colors = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-indigo-500",
    pink: "from-pink-500 to-purple-500"
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
      <h4 className="text-white font-medium">{title}</h4>
      <p className="text-indigo-200 text-sm mt-1">{description}</p>
      
      {progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-black/20 rounded-full h-1.5 mt-2">
            <div 
              className={`h-1.5 rounded-full bg-gradient-to-r ${colors[color]}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-indigo-200 mt-1">{progress}% complete</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;