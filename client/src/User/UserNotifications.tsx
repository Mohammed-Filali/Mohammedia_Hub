import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';

interface UserNotificationsProps {
  userId: string;
  setNotificationsCount: (count: number) => void;
}

const UserNotifications = ({ userId , setNoticesCount   }: UserNotificationsProps) => {
  const [notifications, setNotifications] = useState<
    { id: string; message: string; read: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(null); // Reset error state
        const response = await UserApi.getNotifications(userId);
        setNotifications(response.filter((n) => !n.read ));
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await UserApi.MarkAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setNoticesCount(( prevCount  ) => prevCount - 1); // Decrease the count
    } catch (error) {
      console.error('Error updating notification:', error);
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-auto">
      {notifications?.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.reverse().map((notification) => (
            <li
              key={notification.id}
              className={`p-4 border rounded-lg transition ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <p className="text-gray-800">{notification.message}</p>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;