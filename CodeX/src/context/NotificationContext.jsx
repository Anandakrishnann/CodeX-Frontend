import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { notificationAxios } from "../../axiosConfig";
import { useSelector } from "react-redux";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children, userType = "user" }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // GET /notifications/
      const response = await notificationAxios.get("");
      console.log("[Notifications] GET response:", response.status, response.data);
      const data = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setNotifications(data);
      
      // Calculate unread count
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      // PATCH /notifications/{id}/read/
      const res = await notificationAxios.patch(`${notificationId}/read/`);
      console.log(`(Notifications) PATCH ${notificationId}/read/ ->`, res.status, res.data);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // POST /notifications/mark-all-read/
      const res = await notificationAxios.post("mark-all-read/");
      console.log("[Notifications] POST mark-all-read/ ->", res.status, res.data);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

