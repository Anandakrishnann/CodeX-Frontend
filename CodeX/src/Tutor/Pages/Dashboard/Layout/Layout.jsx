import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";
import { useNotifications } from "../../../../context/NotificationContext";

function LayoutContent({ children, page }) {
  const [activeItem, setActiveItem] = useState(page || "Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addNotification } = useNotifications();

  const handleNotification = (data) => {
    if (data && data.message) {
      addNotification({
        ...data,
        id: data.id || Date.now(),
        is_read: data.is_read !== undefined ? data.is_read : false,
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background Animation - Fixed behind everything */}
      <BackgroundAnimation />
      
      {/* Main Content */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar container: no fixed width on mobile, reserved width on large screens */}
        <div className="w-0 lg:w-64 shrink-0">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Right Side: Navbar + Scrollable Content */}
        <div className="flex flex-col flex-1 h-full">
          {/* Navbar - Fixed */}
          <div className="h-16 shrink-0">
            <Navbar setSidebarOpen={setSidebarOpen} />
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children, page }) {
  return (
    <LayoutContent page={page}>
      {children}
    </LayoutContent>
  );
}
