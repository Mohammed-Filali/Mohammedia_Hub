// src/pages/Home.tsx
import React from "react";
import Layout from "../layouts/layout";
import "../styles/animations.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        {/* Background Container */}
        <div className="absolute inset-0 bg-cover bg-center bg-animation blur-sm"></div>

        {/* Content */}
        <section className="relative text-center z-10 text-white flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">Bienvenue sur Mohammedia Hub</h2>
          <p className="mt-4 max-w-xl text-center">
            "Mohammedia Hub" est une plateforme citoyenne conçue pour faciliter la communication entre les habitants et la commune. 
            Signalez des problèmes urbains, suivez l'actualité communale et participez activement aux décisions municipales.
          </p>
          <Link to={'/reclamations-list'} className="mt-6 px-6 py-3 bg-custom-green text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </Link>
        </section>
      </div>
    </Layout>
  );
};

export default Home;