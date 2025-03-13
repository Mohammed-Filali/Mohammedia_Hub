import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen ">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-custom-green">Admin Dashboard</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100 font-semibold' : ''
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100 font-semibold' : ''
                }`
              }
            >
              <Users className="w-5 h-5 mr-3" />
              Utilisateurs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/reclamations"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100 font-semibold' : ''
                }`
              }
            >
              <FileText className="w-5 h-5 mr-3" />
              Réclamations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100 font-semibold' : ''
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              Paramètres
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;