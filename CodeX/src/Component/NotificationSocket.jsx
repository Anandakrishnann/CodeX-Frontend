import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function buildWebSocketUrl() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  
  if (VITE_API_BASE_URL) {
    const wsBase = VITE_API_BASE_URL.replace(/^http/, "ws").replace(/\/$/, "");
    return `${wsBase}/ws/notifications/`;
  }
  
  return "wss://codexlearning.online/ws/notifications/";
}

const NotificationSocket = ({ onMessage }) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  const onMessageRef = useRef(onMessage);
  const processedIdsRef = useRef(new Set());

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = (url) => {
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
          
          const notificationId = data.id;
          if (notificationId && processedIdsRef.current.has(notificationId)) {
            return;
          }
          
          if (notificationId) {
            processedIdsRef.current.add(notificationId);
          }
          
          onMessageRef.current?.(data);
          toast.info("New notification");
        } catch (err) {
        }
      };

      socket.onerror = (err) => {
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
