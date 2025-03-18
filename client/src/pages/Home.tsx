import Layout from "../layouts/layout";
import "../styles/animations.css";
import { Link } from "react-router-dom";
import bg from '../images/logo-com.png';

const Home = () => {
  return (
    <Layout>
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        {/* Logo Section */}
        <div className="w-full flex justify-center items-center text-center">
          <img className="justify-center animate-bounce" width="120px" src={bg} alt="Logo" />
        </div>

        {/* Background Animation */}
        <div className="bg-cover bg-center mt-6 bg-animation rounded-lg shadow-lg w-11/12 h-48 sm:h-64 md:h-80"></div>

        {/* Content Section */}
        <section className="relative text-center z-10 text-gray-800 flex flex-col items-center justify-center px-6 sm:px-12 mt-8">
          <p className="mt-6 text-custom-yellow max-w-3xl text-center text-base sm:text-lg md:text-xl leading-relaxed">
            "Mohammedia Hub" est une plateforme citoyenne conçue pour faciliter la communication entre les habitants et la commune. 
            Signalez des problèmes urbains, suivez l'actualité communale et participez activement aux décisions municipales.
          </p>
          <Link
            to="/reclamations-list"
            className="mt-8 px-8 py-4 bg-custom-green text-white rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110"
          >
            Get Started
          </Link>
        </section>
      </div>
    </Layout>
  );
};

export default Home;