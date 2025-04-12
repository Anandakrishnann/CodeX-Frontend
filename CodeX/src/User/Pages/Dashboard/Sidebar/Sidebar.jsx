import React, { useState } from "react";
import { Home, BarChart2, Settings, LogOut } from "lucide-react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate } from "react-router-dom";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate()

  return (
    
    <div className={`text-white p-5 transition-all ${open ? "w-26" : "w-26"} duration-300 h-screen`} >
      <BackgroundAnimation />

      <div className="flex items-center justify-between relative z-10">
        <h2 className={`text-4xl font-extrabold transition-all text-green-500 ${open ? "block" : "hidden"}`}>Dashboard</h2>
        <button className="p-4 rounded-lg hover:bg-gray-800" onClick={() => setOpen(!open)}>☰</button>
      </div>
      <nav className="mt-6 relative z-10">
  <ul className="space-y-4">
    <SidebarItem 
      icon={<Home className="text-green-500"/>} 
      label="Home" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      onClick={() => navigate("/user-dashboard")}
      className="text-white hover:text-gray-900 hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
    <SidebarItem 
      icon={<PersonOutlineIcon className="text-white"/>} 
      label="Profile" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      onClick={() => navigate("/user-profile")}
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
    
    <SidebarItem 
      icon={<SchoolIcon className="text-white"/>} 
      label="Courses" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
    <SidebarItem 
      icon={<QuestionAnswerIcon className="text-white"/>} 
      label="Chat's" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
    {/* <SidebarItem 
      icon={<AccountBalanceWalletIcon className="text-white"/>} 
      label="Wallet" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    /> */}
    <SidebarItem 
      icon={<KeyboardReturnIcon className="text-white"/>} 
      label="Go Back" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      onClick={() => navigate("/")}
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
    <SidebarItem 
      icon={<LogOut className="text-white"/>} 
      label="Logout" 
      open={open} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem} 
      className="text-white hover:text-black hover:bg-white transition duration-200 px-4 py-2 rounded-md"
    />
  </ul>
</nav>

    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, open, activeItem, setActiveItem, onClick }) => {
  const isActive = activeItem === label;

  return (
    <li
      className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition ${
        isActive ? "bg-white text-black" : "hover:bg-black text-white"
      }`}
      onClick={() => {
        setActiveItem(label);
        if (onClick) onClick();
      }}
    >
      {/* Adjust icon size dynamically based on sidebar state */}
      <div className="flex items-center justify-center w-10 h-5">
        {React.cloneElement(icon, { 
          className: isActive ? "text-black" : "text-white", 
          size: open ? 20 : 20  // Increase icon size when sidebar is hidden
        })}
      </div>

      {/* Label should be hidden when sidebar is collapsed */}
      <span className={`transition-all ${open ? "block" : "hidden"}`}>{label}</span>
    </li>
  );
};


export default Sidebar;
