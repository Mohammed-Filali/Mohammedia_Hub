import { LogOut, Bell } from "lucide-react";
import { UserApi } from "../service/UserApi";
import { RootState, setUser } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notifications from "./Notifications";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [noticesCount, setNoticesCount] = useState(0);
  const token = localStorage.getItem("token");

  const [showNotifications, setShowNotifications] = useState(false);
  const logout = async () => {
    try {
      await UserApi.logout();
      localStorage.setItem("token", "false");
      dispatch(setUser(null));
      navigate("/");
      toast.success("Déconnexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    const fetchUserNotices = async () => {
    try {
      const userData = await UserApi.getUser();
      setNoticesCount(userData.noticesCount)

    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

   fetchUserNotices() 
    if (!user && token === "false") {
      navigate("/");
    }
      
    

    
  }, [user, token, navigate]);

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex flex-wrap justify-between items-center">
        {/* Logout Button */}
        <button
          onClick={logout}
          className="text-custom-green hover:text-gray-700 mb-4 md:mb-0"
        >
          <LogOut className="w-6 h-6" />
        </button>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-custom-green hover:text-custom-green transition-colors relative"
            >
              <Bell className="w-6 h-6" />
              {noticesCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {noticesCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                <Notifications setNoticesCount={setNoticesCount} userId={user?.id} />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-custom-green text-white rounded-full flex items-center justify-center">
              <span className="text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700 text-sm md:text-base truncate max-w-[150px]">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;