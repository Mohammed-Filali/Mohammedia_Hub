import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi } from '../service/UserApi';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import bg from '../images/logo-com.png'

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [adress, setAdress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [CIN, setCin] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
    const { user }=useSelector(state=>state)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email invalide";
    }
  
    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
  
    if (!adress.trim()) {
      newErrors.adress = "L'adresse est requise";
    }
  
    const phoneRegex = /^\d{10}$/;
    if (!telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!phoneRegex.test(telephone)) {
      newErrors.telephone = "Le téléphone doit contenir 10 chiffres";
    }
  
    if (!CIN.trim()) {
      newErrors.cin = "Le CIN est requis";
    }
  
    const ageNumber = parseInt(age, 10);
    if (!age.trim()) {
      newErrors.age = "L'âge est requis";
    } else if (isNaN(ageNumber)) {
      newErrors.age = "L'âge doit être un nombre valide";
    } else if (ageNumber < 18 || ageNumber > 100) {
      newErrors.age = "L'âge doit être compris entre 18 et 100 ans";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    console.log('data :'+{ name, email, password, adress, telephone, CIN, age }.CIN);
    
    try {
      await UserApi.createUser({ name,adress,  CIN, age, password,  email, telephone  });
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription", error.response?.data?.message || "Une erreur est survenue");
      setErrors({ faild: error.response?.data?.message || "Une erreur est survenue" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col  items-center p-4">
      <form onSubmit={handleRegister} className="w-full max-w-xl mt-8 bg-white p-6 rounded-lg shadow-md">
      <div className="w-full flex justify-center">
              <img src={bg} width={'100px'} alt="" /> 

          </div>
          <h1 className="text-3xl w-full text-center text-custom-green font-bold">Créer un compte</h1>

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
          <label htmlFor="adress" className="block text-sm font-medium">Adresse</label>
          <input
            type="text"
            id="adress"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            className={`w-full p-2 border ${errors.adress ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.adress && <p className="text-red-500 text-sm">{errors.adress}</p>}
        </div>


        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Cin</label>
          <input
            type="text"
            id="CIN"
            value={CIN}
            onChange={(e) => setCin(e.target.value)}
            className={`w-full p-2 border ${errors.cin ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.cin}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Telephone</label>
          <input
            type="text"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={`w-full p-2 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.telephone}</p>}
        </div>
        

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`w-full p-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg mt-2`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.age}</p>}
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

        <Link className='w-fill text-center' to={'/login'}> Log In ? </Link>

        <button
          type="submit"
          className="w-full bg-custom-green text-white px-6 py-3 rounded-lg mt-4 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" /> 
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
