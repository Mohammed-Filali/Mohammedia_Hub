import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Menu } from 'lucide-react';
import bg from '../images/logo-com.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden p-4 text-custom-green"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 z-40 w-64 bg-white border-r border-gray-200 h-screen transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="w-full flex justify-center">
            <img className="justify-center" width={'100px'} src={bg} alt="" />
          </div>
          <h2 className="text-2xl font-bold text-custom-green">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-3 text-custom-green hover:bg-gray-100 rounded-lg transition-colors ${
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
                  `flex items-center p-3 text-custom-green hover:bg-gray-100 rounded-lg transition-colors ${
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
                  `flex items-center p-3 text-custom-green hover:bg-gray-100 rounded-lg transition-colors ${
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
                to="/dashboard/PollsStats"
                className={({ isActive }) =>
                  `flex items-center p-3 text-custom-green hover:bg-gray-100 rounded-lg transition-colors ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                Paramètres des suggestions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/news"
                className={({ isActive }) =>
                  `flex items-center p-3 text-custom-green hover:bg-gray-100 rounded-lg transition-colors ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
              >
                <Users className="w-5 h-5 mr-3" />
                News
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;