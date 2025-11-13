import React, { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { NotificationProvider, useNotifications } from "../../../context/NotificationContext";

function NotificationsContent() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, read, unread

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      !searchTerm ||
      (notification.message || notification.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "read" && notification.is_read) ||
      (filter === "unread" && !notification.is_read);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading notifications...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-black mt-20">
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row px-6 py-4">
          {/* Left Side Illustration */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            {/* <img
              src=""
              alt="Person relaxing with coffee"
              className="relative z-10"
            /> */}
          </div>

          {/* Middle Content */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-start pt-8">
            <h2 className="text-white text-4xl font-bold mb-6">
              Notifications
            </h2>
            <div className="w-full relative">


            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="w-full md:w-1/3 flex items-center justify-center mt-8 md:mt-0">
            {/* <img
              src=""
              alt="Computer monitor with person"
              className="transform rotate-6"
            /> */}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-200 flex-1 px-6 py-8 rounded-t-3xl">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={markAllAsRead}
                className="bg-gray-900 text-white py-3 px-4 rounded-md text-center hover:bg-gray-800"
              >
                Mark all as read
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`border-2 px-6 py-2 rounded-md flex items-center ${
                    filter === "all"
                      ? "border-black bg-gray-300"
                      : "border-gray-400"
                  }`}
                >
                  <span className="font-semibold">All</span>
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`border-2 px-6 py-2 rounded-md flex items-center ${
                    filter === "unread"
                      ? "border-black bg-gray-300"
                      : "border-gray-400"
                  }`}
                >
                  <span className="font-semibold">Unread</span>
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`border-2 px-6 py-2 rounded-md flex items-center ${
                    filter === "read"
                      ? "border-black bg-gray-300"
                      : "border-gray-400"
                  }`}
                >
                  <span className="font-semibold">Read</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No notifications found
                </div>
              ) : (
                <table className="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="border-b-2 border-gray-400 bg-gray-300">
                      <th className="text-left py-4 px-4 font-bold">S.No.</th>
                      <th className="text-left py-4 px-4 font-bold">Message</th>
                      <th className="text-left py-4 px-4 font-bold">Type</th>
                      <th className="text-left py-4 px-4 font-bold">Status</th>
                      <th className="text-left py-4 px-4 font-bold">Date</th>
                      <th className="text-left py-4 px-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotifications.map((notification, index) => (
                      <tr
                        key={notification.id}
                        className={`border-b border-gray-300 ${
                          !notification.is_read ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-6 px-4">{index + 1}</td>
                        <td className="py-6 px-4">
                          {notification.message || notification.title || "Notification"}
                        </td>
                        <td className="py-6 px-4">
                          {notification.type || "-"}
                        </td>
                        <td className="py-6 px-4">
                          {notification.is_read ? (
                            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full">
                              Read
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full">
                              Unread
                            </span>
                          )}
                        </td>
                        <td className="py-6 px-4">
                          {formatDate(notification.created_at || notification.timestamp)}
                        </td>
                        <td className="py-6 px-4">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Mark as read
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const Notifications = () => {
  return (
    <NotificationProvider userType="tutor">
      <NotificationsContent />
    </NotificationProvider>
  );
};

export default Notifications;
