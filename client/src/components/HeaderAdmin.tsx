import { LogOut, Bell } from "lucide-react";
import { UserApi } from "../service/UserApi";
import { RootState, setUser } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notifications from "./Notifications";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("token");

  // État pour afficher/masquer les notifications
  const [showNotifications, setShowNotifications] = useState(false);

  // Fonction pour gérer la déconnexion
  const logout = async () => {
    try {
      await UserApi.logout();
      localStorage.setItem("token", "false");
      dispatch(setUser(null)); // Réinitialiser l'utilisateur dans le store
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Rediriger l'utilisateur s'il n'est pas connecté
  useEffect(() => {
    if (!user && token === "false") {
      navigate("/");
    }
  }, [user, token, navigate]);

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        {/* Bouton de déconnexion */}
        <button onClick={logout} className="text-gray-500 hover:text-gray-700">
          <LogOut className="w-6 h-6" />
        </button>

        {/* Section utilisateur et notifications */}
        <div className="flex items-center space-x-4">
          {/* Bouton des notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-700 hover:text-custom-green transition-colors relative"
          >
            <Bell className="w-6 h-6" />
            {/* Badge pour les notifications non lues (optionnel) */}
            {user?.unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {user.unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Affichage des notifications */}
          {showNotifications && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64">
              <Notifications  userId={user?.id} />
            </div>
          )}

          {/* Avatar et nom de l'utilisateur */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;