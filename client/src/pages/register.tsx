import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserApi } from '../service/UserApi';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email invalide";
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    const newErrors: { [key: string]: string } = {};

    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await UserApi.createUser({ name, email, password });
      navigate('/login');
    } catch (error) {
      newErrors.faild = error.response.data.message;

      console.error("Erreur lors de l'inscription", error.response.data.message);
      setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <form onSubmit={handleRegister} className="w-full max-w-sm mt-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl text-custom-green font-bold">Créer un compte</h1>
        {errors.faild && <p className="text-red-500 text-sm">{errors.faild}</p>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-custom-green text-white px-6 py-3 rounded-lg mt-4 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default Register;
