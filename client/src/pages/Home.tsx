import Layout from "../layouts/layout";
import "../styles/animations.css";
import { Link } from "react-router-dom";
import bg from '../images/logo-com.png'
const Home = () => {
  return (
    <Layout>
      <div className="relative min-h-screen items-center justify-center  ">
        <div className=" w-full flex justify-center items-center text-center">     
             <img className="justify-center" width={'100px'} src={bg} alt="" />
        </div>
        <div className="bg-cover bg-center mt-1 bg-animation rounded"></div>
        <section className="relative text-center z-10 text-white flex flex-col items-center justify-center">

        

          <p className="mt-4 text-custom-yellow max-w-xl text-center">
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