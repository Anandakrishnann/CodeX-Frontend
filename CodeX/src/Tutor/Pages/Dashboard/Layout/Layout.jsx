import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";

export default function Layout({ children, page }) {
  const [activeItem, setActiveItem] = useState(page || "Home");
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background Animation - Fixed behind everything */}
      <BackgroundAnimation />
      
      {/* Main Content */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar - Fixed */}
        <div className="w-64 shrink-0">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>

        {/* Right Side: Navbar + Scrollable Content */}
        <div className="flex flex-col flex-1 h-full">
          {/* Navbar - Fixed */}
          <div className="h-16 shrink-0">
            <Navbar />
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
