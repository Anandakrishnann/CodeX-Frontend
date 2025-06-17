import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = ({ setSidebarOpen }) => {
  return (
    <header
      className="flex items-center justify-between h-16 px-6 border-gray-200 relative z-10"
      style={{ maxHeight: "90px", marginTop: "20px", marginBottom: "5px" }}
    >
      <div className="flex items-center">
        <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold"></h1>
      </div>

      <div
        className="flex items-center space-x-4"
        style={{ marginBottom: "20px" }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <button className="relative p-1">
          <NotificationsIcon fontSize="large" className="w-5 h-5 text-white" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <button className="relative p-1">
          <AccountCircleIcon fontSize="large" className="w-5 h-5 text-white" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
