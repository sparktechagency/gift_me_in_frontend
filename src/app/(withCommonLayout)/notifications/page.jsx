"use client";

import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "../../../redux/apiSlice/orderSlice";
import { format } from "date-fns";

const NotificationPage = () => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery();
  const [updateNotification] = useUpdateNotificationMutation();

  if (isLoading)
    return <h1 className="text-lg font-semibold">Loading notifications...</h1>;
  if (isError || !notifications?.data)
    return <h1 className="text-red-500">Failed to load notifications.</h1>;

  const notificationData = notifications.data;

  const handleUpdateNotification = async (id) => {
    try {
      await updateNotification(id);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>
      <div className="space-y-4">
        {notificationData.map((notif) => (
          <div
            key={notif._id}
            onClick={() => handleUpdateNotification(notif._id)}
            className={`p-4 rounded-lg shadow-sm border cursor-pointer ${
              notif.isRead
                ? "bg-gray-100 border-gray-300"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <h2 className="text-lg font-semibold">{notif.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
            <span className="text-xs text-gray-500">
              {format(new Date(notif.createdAt), "PPPpp")}
            </span>
            {!notif.isRead && (
              <span className="ml-2 inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
