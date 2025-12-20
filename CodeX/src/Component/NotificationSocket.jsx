import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function buildWebSocketUrl() {
  // Use the same pattern as chat WebSocket - connect directly to backend
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  
  if (VITE_API_BASE_URL) {
    // Extract host from API URL (e.g., "http://127.0.0.1:8000" -> "ws://127.0.0.1:8000")
    const wsBase = VITE_API_BASE_URL.replace(/^http/, "ws").replace(/\/$/, "");
    return `${wsBase}/ws/notifications/`;
  }
  
  // Default to localhost backend (same as chat)
  return "ws://127.0.0.1:8000/ws/notifications/";
}

const NotificationSocket = ({ onMessage }) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  const onMessageRef = useRef(onMessage);
  const processedIdsRef = useRef(new Set());

  // Update onMessage ref when it changes
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = (url) => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("✅ Notification WebSocket connected");
        reconnectAttempts.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Prevent duplicate processing - check if we've already processed this notification ID
          const notificationId = data.id;
          if (notificationId && processedIdsRef.current.has(notificationId)) {
            return;
          }
          
          // Mark as processed
          if (notificationId) {
            processedIdsRef.current.add(notificationId);
          }
          
          onMessageRef.current?.(data);
          toast.info("New notification");
        } catch (err) {
          // Error parsing WebSocket message
        }
      };

      socket.onerror = (err) => {
        // WebSocket error occurred
      };

      socket.onclose = (event) => {
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const jitter = Math.random() * 500;
          reconnectTimeoutRef.current = setTimeout(
            () => connect(url),
            reconnectDelay + jitter
          );
        }
      };

      socketRef.current = socket;
    } catch (err) {
      // Error creating WebSocket
    }
  };

  useEffect(() => {
    const url = buildWebSocketUrl();

    // Add 500ms delay to prevent initial Channels handshake failure
    const timeout = setTimeout(() => {
      connect(url);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return null;
};

export default NotificationSocket;
