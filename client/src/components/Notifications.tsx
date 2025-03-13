import  { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await UserApi.getNotifications(userId) ;
        setNotifications(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await UserApi.MarkAsRead(userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
 };

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications?.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="space-y-4">
          {notifications?.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <p>{notification.message}</p>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Marquer comme lue
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;