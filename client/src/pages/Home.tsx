import Layout from "../layouts/layout";
import { Link } from "react-router-dom";
import bg from '../images/logo-com.png';
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-screen">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <img 
              src={bg} 
              alt="Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg" 
            />
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bienvenue sur <span className="text-custom-green">Mohammedia Hub</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              La plateforme citoyenne qui connecte les habitants à leur commune. 
              Signalez, participez et collaborez pour une ville meilleure.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              to="News-list"
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full shadow-xl bg-gradient-to-r from-custom-green to-teal-500 hover:from-teal-500 hover:to-custom-green"
            >
                <span className="relative z-10 text-lg font-semibold">Les nouvelles</span>
              <span className="relative z-10 ml-3 transition-all duration-300 group-hover:translate-x-1">
                <FiArrowRight className="w-5 h-5" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 ease-out"></span>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-custom-green">100+</div>
              <div className="text-gray-600">Problèmes résolus</div>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-custom-green">24h</div>
              <div className="text-gray-600">Temps de réponse</div>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-custom-green">500+</div>
              <div className="text-gray-600">Citoyens actifs</div>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-custom-green">30+</div>
              <div className="text-gray-600">Projets communaux</div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;