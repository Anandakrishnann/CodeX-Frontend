import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import { useSelector } from "react-redux";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BackgroundAnimation from "../../../Component/BackgroundAnimation";
import Layout from "./Layout/Layout";


const UserDashboard = () => {
  const user = useSelector((state) => state.user.user)

  return (
    <Layout page={"Home"}>
       <BackgroundAnimation/>
        <div className="flex items-center justify-end mr-9 mt-9 mb-7 relative z-10">
                  <h1 style={{color: "red", borderColor: "red"}} className="text-3xl font-extrabold border-4 border-double rounded-full text-orange-500 animate-pulse drop-shadow-[0_0_10px_#ff4500] p-3">
                    Streak {user.streak}
                  <WhatshotIcon style={{color: "red"}} className="animate-pulse ml-2 drop-shadow-[0_0_15px_#ff4500] pb-1" fontSize="large" />

                  </h1>
                </div>
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="bg-white text-black p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-4xl font-bold">Welcome back, {user.first_name} {user.last_name}!</h2>
            <p className="text-md text-black">Here is what’s happening today:</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black text-lg font-extrabold">
            <StatCard title="Total Courses" value="24" />
            <StatCard title="Completed Lessons" value="89" />
            <StatCard title="Badges Earned" value="12" />
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-5 mt-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <ul className="space-y-2">
              <ActivityItem text="Completed 'React Basics' module" />
              <ActivityItem text="Achieved 'JavaScript Expert' badge" />
              <ActivityItem text="Started 'Advanced Python' course" />
            </ul>
          </div>
        </div>
    </Layout>
  );
};

// Statistics Card Component
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col">
      <h4 className="text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

// Recent Activity Item
const ActivityItem = ({ text }) => {
  return <li className="text-gray-700 border-l-4 border-blue-500 pl-4">{text}</li>;
};

export default UserDashboard;
