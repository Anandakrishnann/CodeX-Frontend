import React, { useState, useRef, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../../context/NotificationContext";
import { useSelector } from "react-redux";

const Navbar = ({ setSidebarOpen }) => {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setShowNotifications(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <header
      className="flex items-center justify-between h-16 px-6 border-gray-200 relative z-50"
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
        <div className="relative"></div>
        <div className="relative z-50" ref={notificationRef}>
          <button
            className="relative p-1"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <NotificationsIcon
              fontSize="large"
              className="w-5 h-5 text-white"
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] max-h-96 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/tutor/notifications");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        !notification.is_read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {notification.message ||
                              notification.title ||
                              "Notification"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(
                              notification.created_at || notification.timestamp
                            )}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 5 && (
                <div className="p-2 border-t border-gray-200 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/tutor/notifications");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    See all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button className="relative group p-1">
          <AccountCircleIcon fontSize="large" className="w-5 h-5 text-white" />

          {/* Hover Label */}
          <span
            className="
    absolute left-1/2 -translate-x-1/2 top-8
    bg-black text-white text-xs font-semibold
    py-1 px-2 rounded-md whitespace-nowrap
    opacity-0 group-hover:opacity-100
    transition-all duration-200
  "
          >
            {user.email}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
