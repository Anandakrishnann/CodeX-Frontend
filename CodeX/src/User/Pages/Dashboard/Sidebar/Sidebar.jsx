import React, { useMemo, useState } from "react";
import { Home, LogOut } from "lucide-react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CastIcon from '@mui/icons-material/Cast';
import { useDispatch } from "react-redux";
import { userAxios } from "../../../../../axiosConfig";
import { logoutUser } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";

const Sidebar = ({ activeItem, setActiveItem, sidebarOpen, setSidebarOpen }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof setSidebarOpen === "function";
  const open = isControlled ? !!sidebarOpen : internalOpen;
  const setOpen = isControlled ? setSidebarOpen : setInternalOpen;
  const navigate = useNavigate();
  const dispatch = useDispatch()

   const logout = async () => {
    try {
      const response = await userAxios.post("logout/");
      dispatch(logoutUser()); // ✅ Update redux state
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-gray-800 p-2 rounded-md"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-transparent text-white p-5 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64 lg:flex lg:flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold ">Dashboard</h2>
          <div className="lg:hidden">
            <button onClick={() => setOpen(false)} className="p-2">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-4">
            <SidebarItem
              icon={<Home />}
              label="Home"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/user-dashboard");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<PersonOutlineIcon />}
              label="Profile"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/user-profile");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<SchoolIcon />}
              label="Courses"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/user/courses");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<QuestionAnswerIcon />}
              label="Chat's"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/user/chat");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<CastIcon />}
              label="Meeting's"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/user/meet");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<KeyboardReturnIcon />}
              label="Home"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            />
            <SidebarItem
              icon={<LogOut />}
              label="Logout"
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClick={logout}
            />
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, activeItem, setActiveItem, onClick }) => {
  const isActive = activeItem === label;

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        isActive
          ? "bg-white text-black"
          : "hover:bg-black hover:text-white text-white"
      }`}
      onClick={() => {
        setActiveItem(label);
        onClick && onClick();
      }}
    >
      <div className="text-lg">{icon}</div>
      <span className="text-base">{label}</span>
    </li>
  );
};

export default Sidebar;
