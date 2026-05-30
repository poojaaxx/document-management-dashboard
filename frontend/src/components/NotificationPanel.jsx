import { useEffect, useState } from "react";
import api from "../services/api";

function NotificationPanel() {

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {

      const response =
        await api.get("/api/notifications");

      setNotifications(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {

      const response =
        await api.get("/api/notifications/unread-count");

      setUnreadCount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // SSE connection
  useEffect(() => {

    const eventSource =
      new EventSource(
        "http://localhost:8080/api/notifications/stream"
      );

    eventSource.addEventListener(
  "notification",
  () => {
    fetchNotifications();
    fetchUnreadCount();
  }
);

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => {
      eventSource.close();
    };

  }, []);

  const markAllRead = async () => {

    try {

      await api.put(
        "/api/notifications/read-all"
      );

      fetchNotifications();
      fetchUnreadCount();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2>
        🔔 Notifications ({unreadCount})
      </h2>

      <button onClick={markAllRead}>
        Mark All Read
      </button>

      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}
            {" "}
            {notification.isRead
              ? "✅"
              : "🔴"}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default NotificationPanel;