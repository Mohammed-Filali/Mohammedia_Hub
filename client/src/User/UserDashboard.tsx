import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserApi } from "../service/UserApi";
import { RootState, setUser } from "../redux/store";
import Profile from "./profile";
import {  FaBell, FaExclamationCircle, FaListAlt } from "react-icons/fa";
import Activities from "./Activities";
import Layout from "../layouts/layout";
import UserNotifications from "./UserNotifications";
import UserReclamations from "./UserReclamationList";
import { div } from "framer-motion/client";
import { Bell } from "lucide-react";

enum Section {
    Dashboard,
    Settings,
    Activities,
    Logout,
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
    title,
    icon,
    isActive,
    onClick,
    children,
    activeColor,
}) => {
    return (
        <div
            className={`dashboard-section mb-6 ${
            isActive ? "w-full" : "w-1/3"
            } transition-all duration-300 relative`}
        >
            <div
            className={`absolute top-0 left-0 h-1 w-full transition-all duration-300 ${
                isActive ? activeColor : "bg-transparent"
            }`}
            />
            <h4
            className={`dashboard-section-title text-xl font-semibold flex items-center gap-2 mb-4 cursor-pointer ${
                isActive ? activeColor : "text-gray-800"
            }`}            onClick={onClick}

            >
            {icon}
            {title}
            </h4>
            {isActive && <div className="text-gray-600">{children}</div>}
        </div>
    );
};

const UserDashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const [activeSection, setActiveSection] = useState<Section>(Section.Dashboard);
    const [noticesCount, setNoticesCount] = useState(0);

    const fetchUser = async () => {
        try {
            const userData = await UserApi.getUser();
            dispatch(setUser(userData.user));
        } catch (error) {
            console.error("Failed to fetch user:", error);
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
        if (token === "false" && !user) {
            fetchUser();
        }
    }, [user, token, dispatch]);

    const Icon = ({NotificationsCount})=>{
        return<>
            <div className="relative">
                <Bell className="w-6 h-6" />
                {NotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                        {NotificationsCount}
                    </span>
                )}
            </div>
        </>}
      
    return (
        <Layout>
            <div className="dashboard-container p-6 bg-gray-100 min-h-screen">
                <div className="dashboard-card bg-white shadow-md rounded-lg p-6 flex flex-wrap">
                    {/* Profile Section */}
                    <div className="dashboard-section mb-6 w-full">
                        <Profile />
                    </div>

                    {/* Dashboard Sections */}
                    <div className="w-full flex flex-wrap">

                        <DashboardSection
                            title="Notifications"
                            icon={ <Icon  NotificationsCount={noticesCount} />}
                            isActive={activeSection === Section.Settings}
                            onClick={() =>
                                setActiveSection(
                                    activeSection === Section.Settings
                                        ? Section.Dashboard
                                        : Section.Settings
                                )
                            }
                            activeColor="text-green-500"
                        >
                            <UserNotifications setNoticesCount={setNoticesCount}  userId={user?.id} />
                        </DashboardSection>

                        <DashboardSection
                            title="Activities"
                            icon={<FaListAlt />}
                            isActive={activeSection === Section.Activities}
                            onClick={() =>
                                setActiveSection(
                                    activeSection === Section.Activities
                                        ? Section.Dashboard
                                        : Section.Activities
                                )
                            }
                            activeColor="text-yellow-500"
                        >
                            <Activities />
                        </DashboardSection>
                        <DashboardSection
                            title="Reclamations"
                            icon={<FaExclamationCircle  />} 
                            isActive={activeSection === Section.Logout}
                            onClick={() =>
                                setActiveSection(
                                    activeSection === Section.Logout
                                        ? Section.Dashboard
                                        : Section.Logout
                                )
                            }
                            activeColor="text-red-500"
                        >
                            <UserReclamations />
                        </DashboardSection>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;
