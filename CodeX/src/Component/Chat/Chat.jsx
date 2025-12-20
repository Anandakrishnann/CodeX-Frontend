import React, { useState, useEffect, useRef } from "react";
import { chatAxios } from "../../../axiosConfig";
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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Chat = ({ roomId: initialRoomId, currentUserId }) => {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverName, setReceiverName] = useState("Chat Room");
  const [showSidebar, setShowSidebar] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const reconnectInterval = 3000;
  const bottomRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }
    if (!selectedRoomId) {
      console.log("No room selected, skipping WebSocket connection");
      return;
    }
    console.log("Connecting to roomId:", selectedRoomId);

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chatroom/${selectedRoomId}/`
    );

    ws.onopen = () => {
      console.log(`WebSocket connected to room ${selectedRoomId}`);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        fetchMessages();
        fetchRooms();

        if (
          data?.sender_id &&
          data.sender_id !== currentUserId && // not my message
          data?.message && // message exists
          data?.room_id !== selectedRoomId // not the room I'm viewing
        ) {
          toast.info("📩 New message received!");
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log(
        `WebSocket disconnected: code=${event.code}, reason=${event.reason}`
      );
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        const delay = reconnectInterval + Math.random() * 100;
        console.log(
          `Reconnecting in ${delay}ms... (Attempt ${reconnectAttempts.current})`
        );
        setTimeout(connectWebSocket, delay);
      } else {
        console.error("Max reconnect attempts reached");
      }
    };

    socketRef.current = ws;
  };

  const fetchMessages = async () => {
    if (!selectedRoomId) return;
    try {
      const data = await chatAxios.get(`messages/${selectedRoomId}/`);
      setMessages(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error while fetching messages:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await chatAxios.get("rooms/");
      const roomsData = Array.isArray(response.data) ? response.data : [];

      const enrichedRooms = await Promise.all(
        roomsData.map(async (room) => {
          if (!room.receiver_name) {
            // Room missing receiver_name
          }
          const summary = await fetchRoomSummary(room.id);
          return {
            ...room,
            receiver_name: room.receiver_name || "Chat Room",
            last_message: summary?.last_message || {
              content: "",
              timestamp: "",
              is_read: false,
            },
            unread_count: summary?.participants?.[0]?.unread_count || 0,
          };
        })
      );

      setRooms(enrichedRooms);

      if (selectedRoomId) {
        const selectedRoom = enrichedRooms.find(
          (room) => room.id === parseInt(selectedRoomId)
        );
        if (selectedRoom) {
          setReceiverName(selectedRoom.receiver_name);
        } else {
          setReceiverName("Chat Room");
        }
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    }
  };

  const fetchRoomSummary = async (roomId) => {
    try {
      const response = await chatAxios.get(`room_summary/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room summary for room ${roomId}:`, error);
      return null;
    }
  };

  const handleRoomSelect = async (room) => {
    setSelectedRoomId(room.id);
    setReceiverName(room.receiver_name);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    fetchMessages();
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoomId) {
      connectWebSocket();
      fetchMessages();
    }
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, [selectedRoomId]);

  const sendMessage = () => {
    if (!currentUserId) {
      console.error("Invalid userId:", currentUserId);
      return;
    }

    if (!message.trim()) {
      console.error("Message is empty");
      return;
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not open, attempting to reconnect...");
      connectWebSocket();
      setTimeout(() => {
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          const payload = { message, sender_id: currentUserId };
          console.log("Sending message:", payload);
          socketRef.current.send(JSON.stringify(payload));
          setMessage("");
        } else {
          console.error("WebSocket still not open after reconnect attempt");
        }
      }, 1000);
    } else {
      const payload = { message, sender_id: currentUserId };
      socketRef.current.send(JSON.stringify(payload));
      setMessage("");
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") {
      return "CR";
    }
    const cleanName = name.replace(" (user)", "").trim();
    return cleanName
      .split(" ")
      .filter((n) => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  const currentUserName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "You";


  const sortedRooms = [...rooms]
    .filter((room) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        room.receiver_name?.toLowerCase().includes(query) ||
        room.last_message?.content?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const getTime = (room) => {
        if (room.last_message?.timestamp) {
          return new Date(room.last_message.timestamp).getTime();
        }
        return new Date(room.created_at).getTime();
      };

      return getTime(b) - getTime(a);
    });

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
                          : room.last_message?.is_read
                          ? "text-gray-400"
                          : "text-white font-medium"
                      }`}
                    >
                      {room.last_message?.content || "No messages"}
                    </p>
                    {room.unread_count > 0 && (
                      <div
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-xs font-bold ml-2`}
                      >
                        {room.unread_count}
                      </div>
                    )}
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
            <p className="text-gray-400 text-center">No chat rooms found</p>
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
                  {getInitials(receiverName)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-500 border-2 md:border-3 border-black rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-black">
                  {receiverName}
                </h3>
                <p className="text-xs md:text-sm text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active Now
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <button className="p-2 md:p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 group"
              onClick={() => navigate("/user/meet")}
              >
                <FaVideo className="text-black group-hover:text-white text-sm md:text-lg" />
              </button>
            </div>
          </div>
        </header>
        <section className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender.includes(currentUserName)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="flex items-end space-x-2 max-w-[280px] sm:max-w-xs lg:max-w-md">
                {!msg.sender.includes(currentUserName) && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                    {getInitials(msg.sender)}
                  </div>
                )}
                <div
                  className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl shadow-lg ${
                    msg.sender.includes(currentUserName)
                      ? "bg-white text-black rounded-br-md"
                      : "bg-gray-800 text-white rounded-bl-md border border-gray-700"
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed">
                    {msg.content}
                  </p>
                  <p
                    className={`text-xs mt-1 md:mt-2 ${
                      msg.sender.includes(currentUserName)
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {msg.sender.includes(currentUserName) && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                    {getInitials(currentUserName)}
                  </div>
                )}
              </div>
            </div>
          ))}
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
