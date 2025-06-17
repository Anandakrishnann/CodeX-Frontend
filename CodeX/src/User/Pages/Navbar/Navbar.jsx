import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { userAxios } from "../../../../axiosConfig";
import { logoutUser } from "../../../redux/slices/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  console.log(isAuthenticated);
  console.log(user);

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const logout = async () => {
    try {
      await userAxios.post("logout/"); // Ensure this is imported and correct
      dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const login = () => {
    navigate("/login");
  };

  const tutor = () => {
    navigate("/tutor");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-black bg-opacity-80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1
              onClick={() => navigate("/")}
              className="text-3xl md:text-4xl lg:text-5xl font-bold cursor-pointer group"
            >
              <span className="text-white transition-all duration-300 text-6xl">
                Code
              </span>
              <span className="text-green-500 transition-all duration-300 group-hover:text-white text-7xl">
                X
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 text-xl">
            <div className="relative">
              <input
                type="text"
                className="px-4 py-2 text-white bg-gray-900/70 border border-gray-700 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Search courses..."
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white hover:rounded-full transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <button
              className="nav-link relative text-white hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/courses")}
            >
              <span className="relative z-10 text-xl">Courses</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            <button
              className="nav-link relative text-white hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 overflow-hidden group"
              onClick={tutor}
            >
              <span className="relative z-10 text-xl">Be a Tutor</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            <button
              className="nav-link relative text-white hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/user-dashboard")}
            >
              <span className="relative z-10 text-xl">Dashboard</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md transition-all duration-300"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={login}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md transition-all duration-300"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-green-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative mx-2 my-2">
              <input
                type="text"
                className="w-full px-4 py-2 text-white bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Search courses..."
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-green-500 hover:text-white transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <button
              className="w-full text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all text-left"
              onClick={() => {
                navigate("/courses");
                setMobileMenuOpen(false);
              }}
            >
              Courses
            </button>

            <button
              className="w-full text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all text-left"
              onClick={() => {
                tutor();
                setMobileMenuOpen(false);
              }}
            >
              Be a Tutor
            </button>

            <button
              className="w-full text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all text-left"
              onClick={() => {
                navigate("/user-dashboard");
                setMobileMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-2 rounded-md transition-all text-left"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-2 rounded-md transition-all text-left"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
