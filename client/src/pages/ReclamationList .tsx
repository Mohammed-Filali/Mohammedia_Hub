import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';
import Layout from '../layouts/layout';
import { Loader2 } from 'lucide-react';

// Define the Reclamation interface
interface Reclamation {
  id: string;
  category: string;
  description: string;
  image_url?: string;
}

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [reclamationsAccepter, setReclamationsAccepter] = useState<Reclamation[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReclamations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token || token === 'false') {
          setError('You are not authenticated.');
          return;
        }

        // Fetch reclamations from the API
        const response = await UserApi.getReclamations();
        if (response.data) {
          setReclamations(response.data);
        } else {
          setError('No data found.');
        }
      } catch (err) {
        setError('Error fetching reclamations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  useEffect(()=>{

    setReclamationsAccepter(reclamations.filter((r)=>{
      return r.isAccept 
    }))
  },[reclamations])

  return (
    <Layout>
      <div className="w-full flex flex-col mx-auto min-h-screen p-6 mt-2 rounded-lg">
        <h1 className="text-3xl text-custom-green font-bold text-center mb-8">Réclamations</h1>
        {loading && (
          <div className="w-full flex justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-custom-green" />
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mt-6 w-full">
          {reclamations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reclamationsAccepter.map((reclamation) => (
                <div
                  key={reclamation.id}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="font-semibold text-xl text-custom-green mb-4">{reclamation.category}</h2>
                  <p className="text-gray-700 mb-4">{reclamation.description}</p>
                  {reclamation.image_url && (
                    <div className="mt-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${reclamation.image_url}`}
                        alt="Reclamation"
                        className="w-full h-auto rounded-md"
                        onError={(e) => {
                          // Fallback in case the image fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-gray-500">Aucune réclamation trouvée.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReclamationList;