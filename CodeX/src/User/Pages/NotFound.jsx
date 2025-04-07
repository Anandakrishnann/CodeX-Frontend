
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../Component/ui/button";
import BackgroundAnimation from "../../Component/BackgroundAnimation";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
      <BackgroundAnimation />
      
      <div className="text-center max-w-lg z-10 backdrop-blur-md bg-black/30 border border-gray-800 rounded-xl p-8 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
        <div className="inline-block text-9xl font-bold mb-4">
          <span className="text-white">4</span>
          <span className="text-green-500">0</span>
          <span className="text-white">4</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h1>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button 
          onClick={() => navigate("/")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md transition-all"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
