import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, setUser } from '../redux/store';
import { UserApi } from '../service/UserApi';
import bg from '../images/logo-com.png';
import { Home, AlertCircle, MessageSquare, LogIn, LogOut, UserPlus, User, Menu, X } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userSetter = async () => {
    try {
      const userData = await UserApi.getUser();
      dispatch(setUser(userData.user));
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    if (token !== 'false' && !user) {
      userSetter();
    }
  }, [user, token, dispatch]);

  const logout = async () => {
    try {
      await UserApi.logout();
      localStorage.setItem('token', 'false');

      dispatch(setUser({}));
      navigate("/");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderAuthLinks = () => {
    if (user && token !== 'false') {
      return (
        <>
          <li>
            <button
              onClick={logout}
              className="text-custom-yellow hover:text-custom-green flex items-center cursor-pointer "
              aria-label="Logout"
            >
              <LogOut className="mr-2" /> Logout
            </button>
          </li>
          <Link to="/user/dashboard">
            <span
              className="text-white bg-custom-green rounded-full w-10 h-10 flex items-center justify-center text-xl font-semibold shadow-md"
              aria-label="User Profile"
            >
              {user.name ? user.name[0] : <User />}
            </span>
          </Link>
        </>
      );
    }

    return (
      <>
        <li>
          <Link
            to="/login"
            className="text-custom-yellow hover:text-custom-green flex items-center "
            aria-label="Login"
          >
            <LogIn className="mr-2" /> Login
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="text-custom-yellow hover:text-custom-green flex items-center "
            aria-label="Register"
          >
            <UserPlus className="mr-2" /> Register
          </Link>
        </li>
      </>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-white w-full p-4 text-custom-yellow flex flex-col md:flex-row md:justify-between items-center shadow-md">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <img className="mr-4 shadow-md rounded-lg" width="80px" src={bg} alt="Logo" />
            <h1 className="text-2xl md:text-3xl font-bold">Mohammedia Hub</h1>
          </div>
          <button
            className="md:hidden text-custom-yellow hover:text-custom-green "
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:block mt-4 md:mt-0 w-full md:w-auto shadow-md md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 items-center">
            <li>
              <Link
                to="/"
                className="text-custom-yellow hover:text-custom-green flex items-center "
                aria-label="Home"
              >
                <Home className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/reclamation"
                className="text-custom-yellow hover:text-custom-green flex items-center "
                aria-label="Reclamation"
              >
                <AlertCircle className="mr-2" /> Reclamation
              </Link>
            </li>
            <li>
              <Link
                to="/polls"
                className="text-custom-yellow hover:text-custom-green flex items-center "
                aria-label="Polls"
              >
                <MessageSquare className="mr-2" /> Polls
              </Link>
            </li>
            {renderAuthLinks()}
          </ul>
        </nav>
      </header>

      <main className="w-full flex-1 p-4 bg-gray-100 shadow-inner">{children}</main>

      <footer className="bg-white text-custom-yellow p-4 text-center shadow-inner">
        <p>&copy; 2025 Mohammedia Commune. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Layout;