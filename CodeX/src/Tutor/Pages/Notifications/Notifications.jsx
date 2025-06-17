import React from "react";
import "./Notifications.css";
import { Search } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Notifications = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-black">
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row px-6 py-4">
          {/* Left Side Illustration */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/71/0f/f9/710ff9a6e585e27dc9658e5a68d8eb6b.jpg"
              alt="Person relaxing with coffee"
              className="relative z-10"
            />
          </div>

          {/* Middle Content */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-start pt-8">
            <h2 className="text-white text-4xl font-bold mb-6">
              Notifications
            </h2>
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white rounded-lg py-3 px-10 text-black"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="w-full md:w-1/3 flex items-center justify-center mt-8 md:mt-0">
            <img
              src="https://i.pinimg.com/736x/94/d0/11/94d011a17d2150637acee92f946a1c3f.jpg"
              alt="Computer monitor with person"
              className="transform rotate-6"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-200 flex-1 px-6 py-8 rounded-t-3xl">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-6">
              <button className="w-1/2 bg-gray-900 text-white py-3 px-4 rounded-md text-center">
                Search
              </button>
              <button className="border-2 border-black px-6 py-2 rounded-md flex items-center">
                <span className="font-semibold">Filter</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="border-b-2 border-gray-400 bg-gray-300">
                    <th className="text-left py-4 px-4 font-bold">S.No.</th>
                    <th className="text-left py-4 px-4 font-bold">ID</th>
                    <th className="text-left py-4 px-4 font-bold">Type</th>
                    <th className="text-left py-4 px-4 font-bold">Reason</th>
                    <th className="text-left py-4 px-4 font-bold">Status</th>
                    <th className="text-left py-4 px-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-6 px-4">1</td>
                    <td className="py-6 px-4">1993</td>
                    <td className="py-6 px-4">Tutor application</td>
                    <td className="py-6 px-4">-</td>
                    <td className="py-6 px-4">
                      <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full">
                        Approved
                      </span>
                    </td>
                    <td className="py-6 px-4">15/09/2024</td>
                  </tr>
                  <tr>
                    <td className="py-6 px-4">2</td>
                    <td className="py-6 px-4">1994</td>
                    <td className="py-6 px-4">Course</td>
                    <td className="py-6 px-4">-</td>
                    <td className="py-6 px-4">
                      <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full">
                        Blocked
                      </span>
                    </td>
                    <td className="py-6 px-4">15/09/2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notifications;
