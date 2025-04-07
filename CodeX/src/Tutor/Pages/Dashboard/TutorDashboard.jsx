import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import { useSelector } from "react-redux";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const user = useSelector((state) => state.user.user)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <BackgroundAnimation/>

        {/* Dashboard Content */}
        <div className="p-6 relative z-10">
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
      </div>
    </div>
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
