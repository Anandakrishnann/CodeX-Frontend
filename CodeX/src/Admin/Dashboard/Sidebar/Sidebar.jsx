import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Sidebar.css";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { userAxios } from '../../../../axiosConfig';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { BsFillStarFill } from "react-icons/bs";
import { IoMdHome } from "react-icons/io";
import { SiFormspree } from "react-icons/si";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path
  const dispatch = useDispatch()

  const handleNavigation = (path) => {
    navigate(path);
  };

  const logout = async () => {
    try{
        const response = await userAxios.post('logout/')
        dispatch(logoutUser())
        toast.success("Successfully Logged out")
        navigate('/')
    }catch (error){
        toast.error("Something went wrong")
    }
}

  return (
    <div
      className="col-span-1 bg-black p-4 rounded-lg text-2xl flex flex-col justify-between"
      style={{ maxHeight: "600px", maxWidth: "400px", height: "800px" }}
    >
      {/* Top Section (Navigation) */}
      <div className="space-y-4">
        <button
          className={`w-full flex items-center text-left p-2 rounded transition font-extrabold ${
            location.pathname === "/admin/dashboard" ? "bg-white text-black" : "hover:bg-white hover:text-black text-white"
          }`}
          onClick={() => handleNavigation("/admin/dashboard")}
        >
          <IoMdHome/>
          
          <p className="pl-4">Dashboard</p>
        </button>

        <button
          className={`w-full flex items-center text-left p-2 rounded transition font-extrabold ${
            location.pathname === "/admin/users" ? "bg-white text-black" : "hover:bg-white hover:text-black text-white"
          }`}
          onClick={() => handleNavigation("/admin/users")}
        >
          <GroupIcon />
          <p className="pl-4">Users</p>
        </button>

        <button
          className={`w-full flex items-center text-left p-2 rounded transition font-extrabold ${
            location.pathname === "/admin/tutors" ? "bg-white text-black" : "hover:bg-white hover:text-black text-white"
          }`}
          onClick={() => handleNavigation("/admin/tutors")}
        >
          <SchoolIcon />
          <p className="pl-4">Tutors</p>
        </button>
        <button
          className={`w-full flex items-center text-left p-2 rounded transition font-extrabold ${
            location.pathname === "/admin/applications" ? "bg-white text-black" : "hover:bg-white hover:text-black text-white"
          }`}
          onClick={() => handleNavigation("/admin/applications")}
        >
          <FileCopyIcon />
          <p className="pl-4">Applications</p>
        </button>
        <button
          className={`w-full flex items-center text-left p-2 rounded transition font-extrabold ${
            location.pathname === "/admin/plans" ? "bg-white text-black" : "hover:bg-white hover:text-black text-white"
          }`}
          onClick={() => handleNavigation("/admin/plans")}
        >
          <BsFillStarFill />
          <p className="pl-4">Subscription Plans</p>
        </button>
      </div>

      {/* Bottom Section (Logout Button) */}
      <div className="mt-auto">
        <button className="w-full p-3 bg-white hover:bg-red-600 hover:text-white text-black rounded-lg font-bold" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
