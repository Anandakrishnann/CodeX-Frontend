"use client";

import { useState } from "react";
import {
  FaSearch,
  FaPhone,
  FaVideo,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FiPaperclip, FiMic } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import Layout from "../Layout/Layout";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";

const TutorChat = () => {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState("John Doe");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const users = [
    {
      name: "John Doe",
      lastMessage: "Hey! How are you doing?",
      time: "2m",
      online: true,
      unread: 2,
    },
    {
      name: "Ollie Jones",
      lastMessage: "Thanks for the help!",
      time: "5m",
      online: true,
      unread: 0,
    },
    {
      name: "Nishta Jain",
      lastMessage: "See you tomorrow",
      time: "1h",
      online: false,
      unread: 1,
    },
    {
      name: "Dhiyup Mathew",
      lastMessage: "Great work on the project",
      time: "2h",
      online: true,
      unread: 0,
    },
    {
      name: "Malini Sharma",
      lastMessage: "Can we schedule a meeting?",
      time: "1d",
      online: false,
      unread: 3,
    },
    {
      name: "Abhishek Goyal",
      lastMessage: "Perfect! Let's do it",
      time: "2d",
      online: false,
      unread: 0,
    },
  ];

  const messages = [
    { id: 1, sender: "me", text: "Hi", time: "10:30 AM", type: "text" },
    { id: 2, sender: "other", text: "Hey!", time: "10:31 AM", type: "text" },
    {
      id: 3,
      sender: "other",
      text: "Hi, how are you doing? I was wondering if you can share the documents with me by today itself.",
      time: "10:31 AM",
      type: "text",
    },
    {
      id: 4,
      sender: "me",
      text: "I am doing great. How are you doing?",
      time: "10:35 AM",
      type: "text",
    },
    {
      id: 5,
      sender: "me",
      text: "Please give me sometime.",
      time: "10:35 AM",
      type: "text",
    },
    {
      id: 6,
      sender: "me",
      text: "As I am already working on that document.",
      time: "10:36 AM",
      type: "text",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleChatSelect = (userName) => {
    setActiveChat(userName);
    // On mobile, hide sidebar when chat is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <Layout page="Chat's">
      <BackgroundAnimation/>
      <div className="flex h-full  text-white rounded-none md:rounded-2xl overflow-hidden shadow-2xl border-0 md:border border-gray-800 relative z-10">
        {/* Sidebar - Responsive */}
        <aside
          className={`
        ${showSidebar ? "flex" : "hidden"} 
        md:flex 
        w-full md:w-80 lg:w-96 
        bg-gray-900 
        border-r-0 md:border-r border-gray-800 
        flex-col
        absolute md:relative 
        z-20 md:z-auto 
        h-full
      `}
        >
          {/* Fixed Sidebar Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b border-gray-800 bg-white">

            {/* Fixed Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-black text-sm" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-gray-700 rounded-xl text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black focus:border-white transition-all text-sm md:text-base"
              />
            </div>
          </div>
          {/* Scrollable User List */}
          <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 bg-black">
            {users.map((user, index) => (
              <div
                key={index}
                onClick={() => handleChatSelect(user.name)}
                className={`flex items-center p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                  activeChat === user.name
                    ? "bg-white text-black"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm ${
                      activeChat === user.name
                        ? "bg-black text-white"
                        : user.online
                        ? "bg-white text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {getInitials(user.name)}
                  </div>
                  {user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 ml-3 md:ml-4 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`font-semibold truncate text-sm md:text-base ${
                        activeChat === user.name ? "text-black" : "text-white"
                      }`}
                    >
                      {user.name}
                    </h4>
                    <span
                      className={`text-xs ml-2 ${
                        activeChat === user.name
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {user.time}
                    </span>
                  </div>
                  <p
                    className={`text-xs md:text-sm truncate mt-1 ${
                      activeChat === user.name
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {user.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1 md:space-y-2">
                  {user.unread > 0 && (
                    <div
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                        activeChat === user.name
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <span className="text-xs font-bold">{user.unread}</span>
                    </div>
                  )}
                  <IoIosArrowForward
                    className={`text-sm ${
                      activeChat === user.name
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Section - Responsive */}
        <main
          className={`
        ${!showSidebar ? "flex" : "hidden"} 
        md:flex 
        flex-1 
        flex-col 
        bg-black
        w-full
      `}
        >
          {/* Fixed Chat Header */}
          <header className="flex-shrink-0  md:p-6 border-b border-black bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToSidebar}
                  className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="text-black hover:text-white" />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm md:text-lg">
                    {getInitials(activeChat)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-500 border-2 md:border-3 border-black rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-black">
                    {activeChat}
                  </h3>
                  <p className="text-xs md:text-sm text-green-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Active Now
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <button className="p-2 md:p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                  <FaPhone className="text-black group-hover:text-white text-sm md:text-lg" />
                </button>
                <button className="p-2 md:p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                  <FaVideo className="text-black group-hover:text-white text-sm md:text-lg" />
                </button>
                <button className="p-2 md:p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                  <HiDotsVertical className="text-black group-hover:text-white text-sm md:text-lg" />
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Messages Area */}
          <section className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto ">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[280px] sm:max-w-xs lg:max-w-md">
                  {msg.sender === "other" && (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {getInitials(activeChat)}
                    </div>
                  )}
                  <div
                    className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl shadow-lg ${
                      msg.sender === "me"
                        ? "bg-white text-black rounded-br-md"
                        : "bg-gray-800 text-white rounded-bl-md border border-gray-700"
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed">
                      {msg.text}
                    </p>
                    <p
                      className={`text-xs mt-1 md:mt-2 ${
                        msg.sender === "me" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                  {msg.sender === "me" && (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      SG
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Fixed Message Input Footer */}
          <footer className="flex-shrink-0 p-4 md:p-6 border-t border-gray-800 bg-white">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 md:p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                <FiPaperclip className="text-black group-hover:text-white text-sm md:text-lg" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-black rounded-2xl text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black focus:border-white transition-all pr-12 md:pr-14 text-sm md:text-base"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && message.trim()) {
                      // Handle send message
                      setMessage("");
                    }
                  }}
                />
                {/* <button className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-all">
                  <BsEmojiSmile className="text-black hover:text-white text-sm md:text-base" />
                </button> */}
              </div>

              <button className="p-2 md:p-3 hover:bg-black rounded-xl transition-all duration-200 group">
                <FiMic className="text-black group-hover:text-white text-sm md:text-lg" />
              </button>

              <button
                className="p-3 md:p-4 bg-black hover:bg-white hover:text-black text-black rounded-2xl"
                onClick={() => {
                  if (message.trim()) {
                    // Handle send message
                    setMessage("");
                  }
                }}
              >
                <FaPaperPlane className="text-white hover:text-black text-sm " />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </Layout>
  );
};

export default TutorChat;
