// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi } from '../service/UserApi';
import {  setUser } from '../redux/store';
import { useDispatch } from 'react-redux';
import bg from '../images/logo-com.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch()

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
    const newErrors: { [key: string]: string } = {};
    try {
      await UserApi.getCsrfToken();
      const res = await UserApi.login({ email, password });
    localStorage.setItem('token', res.data.token);
    dispatch(setUser(await UserApi.getUser()));
      if(res.data.user.isAdmin){
        navigate('/dashboard');

      }else if(res.data.user.isActive){
        navigate('/');

      }else if(!res.data.user.isActive){
          alert('ce compte est desactivé')
      }
    } catch (error) {
      newErrors.faild = error.response.data.message;

      setErrors(newErrors);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm mt-8 bg-white text-center p-6 rounded-lg shadow-md">
          <div className="w-full flex justify-center">
              <img src={bg} width={'100px'} alt="" />

          </div>
        <h1 className="text-3xl text-custom-green font-bold">Se connecter</h1>
        {errors.faild && <p className="text-red-500 text-lg">{errors.faild}</p>}


        <div className="mb-4 text-left">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <Link to={'/register'}> creé un nevau compt</Link>

        <button type="submit" className="w-full bg-custom-green text-white px-6 py-3 rounded-lg mt-4">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
