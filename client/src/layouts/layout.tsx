
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, setUser } from '../redux/store';
import { UserApi } from '../service/UserApi';
import bg from '../images/logo-com.png'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const userSetter = async () => {
    const userData = await UserApi.getUser();
    dispatch(setUser(userData));
  };
  
  useEffect(() => {
    if (token !=='false' && !user) {
      userSetter();
    }
  }, [user, token, dispatch]); 
  const logout = async () => {
    try {
      await UserApi.logout(); 
      localStorage.setItem('token', 'false'); 
      dispatch(setUser({}));

    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="h-screen w-full  flex flex-col">
      <header className="bg-custom-yellow w-full p-4 text-white flex flex-col md:flex-row md:justify-between items-center">
        <div className="flex  items-center w-full">
        <img className="justify-center" width={'100px'} src={bg} alt="" />

          <h1 className="text-3xl font-bold">Mohammedia Hub</h1>
        </div>

        <nav className="mt-4 md:mt-0">
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 items-center">
            <li>
              <Link to="/" className="text-white hover:text-custom-green">Accueil</Link>
            </li>
            <li>
              <Link to="/reclamation" className="text-white hover:text-custom-green">réclamer</Link>
            </li>

            {/* Conditionally render links based on user state */}
            {user && token !== 'false' ? (
              <>
                <li  >
                  <a  onClick={logout} className="text-white hover:text-custom-green">Se déconnecter</a>
                </li>
                
                {/* Display user's initial or name */}
                <li>
                  <span className="text-white bg-custom-green rounded-full w-10 h-10 flex items-center justify-center text-xl font-semibold">
                    {user.name ? user.name[0] : 'U'}
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-custom-green">Se connecter</Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-custom-green">Créer un compte</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="w-full flex-1">{children}</main>

      <footer className="bg-custom-yellow text-white p-4 text-center">
        <p>&copy; 2025 Mohammedia Commune. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Layout;
