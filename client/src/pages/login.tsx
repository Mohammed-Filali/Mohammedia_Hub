// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi } from '../service/UserApi';
import { setUser } from '../redux/store';
import { useDispatch } from 'react-redux';
import bg from '../images/logo-com.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';
;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "L'email est requis";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const newErrors: { [key: string]: string } = {};
    try {
      await UserApi.getCsrfToken();
      const res = await UserApi.login({ email, password });
      localStorage.setItem('token', res.data.token);
      const { user } = await UserApi.getUser();
      dispatch(setUser(user));
      toast.success('Connexion réussie !');
      if (res.data.user.isAdmin) {
        navigate('/dashboard');
      } else if (res.data.user.isActive) {
        navigate('/');
      } else if (!res.data.user.isActive) {
        toast.error('Ce compte est désactivé');
      }
    } catch (error) {
      newErrors.faild = error.response?.data?.message || 'Une erreur est survenue';
      setErrors(newErrors);
      toast.error(newErrors.faild);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {loading && <Loader2 />}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white text-center p-6 rounded-lg shadow-md"
      >
        <div className="w-full flex justify-center mb-4">
          <img src={bg} width="100px" alt="Logo" />
        </div>
        <h1 className="text-2xl md:text-3xl text-custom-green font-bold mb-6">Se connecter</h1>
        {errors.faild && (
          <p className="text-red-500 text-sm md:text-base mb-4">{errors.faild}</p>
        )}

        <div className="mb-4 text-left">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-custom-green"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-custom-green"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Link
          to="/register"
          className="text-custom-green text-sm md:text-base hover:underline block mb-4"
        >
          Créer un nouveau compte
        </Link>

        <button
          type="submit"
          className="w-full bg-custom-green text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;
