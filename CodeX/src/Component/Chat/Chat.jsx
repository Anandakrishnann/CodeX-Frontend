import React, { useState, useEffect, useRef } from "react";
import { chatAxios, tutorAxios, userAxios } from "../../../axiosConfig";
import {
  FaSearch,
  FaVideo,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Chat = ({ currentUserId, tutorId }) => {
  const user = useSelector((state) => state.user.user);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [receiverName, setReceiverName] = useState("Chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentTutor, setCurrentTutor] = useState(null);

  const wsBaseUrl = import.meta.env.VITE_API_WEBSOCKET_URL;

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const previousMessagesCount = useRef(0);
  const navigate = useNavigate();

  /* -------------------- HELPER FUNCTIONS -------------------- */
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoomId(room.id);
    setReceiverName(room.receiver_name);
    setShowSidebar(false);
    // Clear currentTutor when selecting existing room - we'll use receiverName from room
    setCurrentTutor(null);
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  const fetchInitialTutor = async () => {
    try {
      const response = await tutorAxios.get(`fetch-tutor/${tutorId}`);
      setCurrentTutor(response.data);
      const tutorName = response.data.first_name && response.data.last_name 
        ? `${response.data.first_name} ${response.data.last_name}`
        : response.data.first_name || response.data.username || "Tutor";
      setReceiverName(tutorName);
    } catch (error) {
    }
  };

  // Fetch tutor only when tutorId is provided (new conversation)
  useEffect(() => {
    if (tutorId) {
      fetchInitialTutor();
    }
  }, [tutorId]);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- INITIAL SETUP -------------------- */
  useEffect(() => {
    if (user?.role === "user") {
      setReceiverName("Tutor");
    }
    // Set current user name from user object
    if (user?.first_name || user?.last_name) {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setCurrentUserName(fullName);
    }
  }, [user]);

  /* -------------------- SOCKET -------------------- */
  const connectWebSocket = (roomId) => {
    if (!roomId || socketRef.current) return;

    socketRef.current = new WebSocket(
      `${import.meta.env.VITE_API_WEBSOCKET_URL}/ws/chatroom/${roomId}/`
    );

    socketRef.current.onmessage = () => {
      fetchMessages(roomId);
      fetchRooms();
    };

    socketRef.current.onclose = () => {
      socketRef.current = null;
    };
  };

  /* -------------------- TOAST NOTIFICATION -------------------- */
  useEffect(() => {
    if (messages.length > previousMessagesCount.current && previousMessagesCount.current > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.sender_id !== currentUserId) {
        toast.info(`New message from ${receiverName}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
    previousMessagesCount.current = messages.length;
  }, [messages, currentUserId, receiverName]);

  /* -------------------- API -------------------- */
  const fetchMessages = async (roomId) => {
    if (!roomId) return;
    const res = await chatAxios.get(`messages/${roomId}/`);
    // Transform messages to include sender_id from the sender object
    const transformedMessages = (res.data || []).map(msg => ({
      ...msg,
      sender_id: msg.sender?.id || msg.sender_id,
      sender_name: msg.sender?.first_name 
        ? `${msg.sender.first_name} ${msg.sender.last_name || ''}`.trim()
        : msg.sender
    }));
    setMessages(transformedMessages);
  };

  const fetchRooms = async () => {
    const res = await chatAxios.get("rooms/");
    setRooms(res.data || []);
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (!selectedRoomId) {
        // First message - creating new room with tutorId
        if (!tutorId) {
          toast.error("No tutor selected");
          return;
        }

        const res = await chatAxios.post("send-first-message/", {
          tutor_id: tutorId,
          content: message,
        });

        setSelectedRoomId(res.data.room_id);
        setMessage("");
        
        // Refresh rooms after creating new room
        await fetchRooms();
        return;
      }

      socketRef.current?.send(
        JSON.stringify({
          message,
          sender_id: currentUserId,
        })
      );

      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Message failed");
    }
  };

  /* -------------------- SEARCH FILTER -------------------- */
  const sortedRooms = rooms.filter((room) =>
    room.receiver_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* -------------------- LOAD ROOMS -------------------- */
  useEffect(() => {
    fetchRooms();
  }, []);

  /* -------------------- ROOM CHANGE -------------------- */
  useEffect(() => {
    if (selectedRoomId) {
      connectWebSocket(selectedRoomId);
      fetchMessages(selectedRoomId);
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [selectedRoomId]);

  // Get display name for header
  const getDisplayName = () => {
    // If tutorId exists (new conversation), show fetched tutor name
    if (tutorId && currentTutor) {
      if (currentTutor.first_name && currentTutor.last_name) {
        return `${currentTutor.first_name} ${currentTutor.last_name}`;
      }
      return currentTutor.first_name || currentTutor.username || "Tutor";
    }
    // Otherwise show receiver name from selected room
    return receiverName;
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="flex h-full text-white rounded-none md:rounded-2xl overflow-hidden shadow-2xl border-0 md:border border-gray-800 relative z-10">
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
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-gray-800 bg-white">
          <div className="relative">
            <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-black text-sm" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-gray-700 rounded-xl text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black focus:border-white transition-all text-sm md:text-base"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 bg-black">
          {sortedRooms.length > 0 ? (
            sortedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`flex items-center p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                  selectedRoomId === room.id
                    ? "bg-white text-black"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm ${
                      selectedRoomId === room.id
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {getInitials(room.receiver_name)}
                  </div>
                  {/* Unread badge on avatar */}
                  {room.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-black">
                      {room.unread_count > 9 ? '9+' : room.unread_count}
                    </div>
                  )}
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="flex-1 ml-3 md:ml-4 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`font-semibold truncate text-sm md:text-base ${
                        selectedRoomId === room.id ? "text-black" : "text-white"
                      }`}
                    >
                      {room.receiver_name}
                    </h4>
                    <span
                      className={`text-xs ml-2 ${
                        selectedRoomId === room.id
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {room.last_message?.timestamp || ""}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <p
                      className={`text-xs md:text-sm truncate flex-1 ${
                        selectedRoomId === room.id
                          ? "text-gray-600"
                          : room.unread_count > 0
                          ? "text-white font-semibold"
                          : room.last_message?.is_read
                          ? "text-gray-400"
                          : "text-white font-medium"
                      }`}
                    >
                      {room.last_message?.content || "No messages"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 md:space-y-2">
                  <IoIosArrowForward
                    className={`text-sm ${
                      selectedRoomId === room.id
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">No chat rooms found</p>
          )}
        </div>
      </aside>
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
        <header className="flex-shrink-0 p-4 md:p-6 border-b border-black bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={handleBackToSidebar}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-black hover:text-white" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm md:text-lg">
                  {getInitials(getDisplayName())}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-500 border-2 md:border-3 border-black rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-black">
                  {getDisplayName()}
                </h3>
                <p className="text-xs md:text-sm text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active Now
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <button
                className="p-2 md:p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                onClick={() => navigate("/user/meet")}
              >
                <FaVideo className="text-black group-hover:text-white text-sm md:text-lg" />
              </button>
            </div>
          </div>
        </header>
        <section className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
          {messages.map((msg) => {
            // Check if current user is sender using sender_id
            const isSender = msg.sender_id === currentUserId || 
                           String(msg.sender_id) === String(currentUserId);
            
            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end space-x-2 max-w-[280px] sm:max-w-xs lg:max-w-md">
                  {!isSender && (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {getInitials(msg.sender_name || msg.sender || receiverName)}
                    </div>
                  )}
                  <div
                    className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl shadow-lg ${
                      isSender
                        ? "bg-white text-black rounded-br-md"
                        : "bg-gray-800 text-white rounded-bl-md border border-gray-700"
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed">
                      {msg.content}
                    </p>
                    <p
                      className={`text-xs mt-1 md:mt-2 ${
                        isSender ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isSender && (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {getInitials(currentUserName || user?.first_name || "You")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </section>
        <footer className="flex-shrink-0 p-4 md:p-6 border-t border-gray-800 bg-white">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-black rounded-2xl text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black focus:border-white transition-all pr-12 md:pr-14 text-sm md:text-base"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    sendMessage();
                  }
                }}
              />
            </div>
            <button
              className="p-3 md:p-4 bg-black hover:bg-white hover:text-black text-black rounded-2xl"
              onClick={sendMessage}
            >
              <FaPaperPlane className="text-white hover:text-black text-sm" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Chat;