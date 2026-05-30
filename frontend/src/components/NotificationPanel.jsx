import { useEffect, useState } from "react";
import api from "../services/api";

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/api/notifications/unread-count"
      );

      setUnreadCount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(
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
    <div className="bg-white rounded-xl shadow-md p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold text-gray-800">
          Notifications
        </h2>

        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
          {unreadCount}
        </span>

      </div>

      {/* Button */}
      <button
        onClick={markAllRead}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-4 transition"
      >
        Mark All Read
      </button>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto space-y-3">

        {notifications.length > 0 ? (

          notifications.map((notification) => (

            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.isRead
                  ? "bg-gray-100 border-gray-200"
                  : "bg-yellow-100 border-yellow-300"
              }`}
            >

              <div className="flex justify-between items-center">

                <p className="text-sm text-gray-700">
                  {notification.message}
                </p>

                <span className="text-lg">
                  {notification.isRead
                    ? "✅"
                    : "🔔"}
                </span>

              </div>

            </div>

          ))

        ) : (

          <div className="text-center text-gray-500 py-6">
            No notifications available
          </div>

        )}

      </div>

    </div>
  );
}

export default NotificationPanel;