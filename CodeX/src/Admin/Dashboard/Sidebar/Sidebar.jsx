"use client";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { userAxios } from "../../../../axiosConfig";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import StarIcon from "@mui/icons-material/Star";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Trash2, Flag, HandCoins  } from "lucide-react";
import { useState } from "react";
import Loading from "@/User/Components/Loading/Loading";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await userAxios.post("logout/");
      dispatch(logoutUser());
      toast.success("Successfully Logged out");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      icon: <HomeIcon className="h-6 w-6" />,
      label: "Dashboard",
    },
    {
      path: "/admin/users",
      icon: <GroupIcon className="h-6 w-6" />,
      label: "Users",
    },
    {
      path: "/admin/tutors",
      icon: <SchoolIcon className="h-6 w-6" />,
      label: "Tutors",
    },
    {
      path: "/admin/courses",
      icon: <SchoolIcon className="h-6 w-6" />,
      label: "Courses",
    },
    {
      path: "/admin/applications",
      icon: <FileCopyIcon className="h-6 w-6" />,
      label: "Applications",
    },
    {
      path: "/admin/course-requests",
      icon: <PostAddIcon fontSize="medium" className="h-6 w-6" />,
      label: "Coures Requests",
    },
    {
      path: "/admin/wallet",
      icon: <AccountBalanceWalletIcon fontSize="medium" className="h-6 w-6" />,
      label: "Wallet",
    },
    {
      path: "/admin/payout-requests",
      icon: <HandCoins fontSize="medium" className="h-6 w-6" />,
      label: "Payout Requests",
    },
    {
      path: "/admin/Reports",
      icon: <Flag fontSize="medium" className="h-6 w-6" />,
      label: "Reports",
    },
    {
      path: "/admin/category",
      icon: <ViewListIcon className="h-6 w-6" />,
      label: "Category",
    },
    {
      path: "/admin/plans",
      icon: <StarIcon className="h-6 w-6" />,
      label: "Subscription Plans",
    },
  ];

  return loading ? (
    <Loading />
  ) : (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-black p-4 flex flex-col overflow-y-auto">
      {/* Logo or Brand */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-extrabold text-white">CodeX</h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`w-full flex items-center text-left p-3 rounded-lg transition font-bold text-lg ${
              location.pathname === item.path
                ? "bg-white text-black"
                : "text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="pt-6 pb-4">
        <button
          className="w-full p-3 bg-white hover:bg-red-600 hover:text-white text-black rounded-lg font-bold flex items-center justify-center"
          onClick={logout}
        >
          <LogoutIcon className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
