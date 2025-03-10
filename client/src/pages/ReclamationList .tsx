import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi'; // Assuming UserApi is where the API calls are made
import Layout from '../layouts/layout';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState<any[]>([]); // Assuming reclamations are objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchReclamations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token=== 'false') {
          setError('You are not authenticated.');
          return;
        }

        // Fetch reclamations from the API
        const response = await UserApi.getReclamations(token);
        setReclamations(response.data); // Assuming response.data contains the array of reclamations
      } catch (err) {
        setError('Error fetching reclamations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  return (
    <Layout>
    <div className="max-w-lg mx-auto min-h-screen p-6 mt-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl text-custom-green font-bold text-center">Mes réclamations</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-6">
        {reclamations.length > 0 ? (
          <div className="space-y-6">
            {reclamations.map((reclamation) => (
              <div key={reclamation.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="font-semibold text-xxl text-custom-green">{reclamation.category}</h2>
                
                {reclamation.image_url && (
                  <div className="mt-4">
                    <img
                      src={import.meta.env.VITE_BACKEND_URL+reclamation.image_url}
                      alt="Reclamation"
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
                                    <p className='text-l p-2'>{reclamation.description}</p>

              </div>
              
            ))}
          </div>
        ) : (
          <p>Aucune réclamation trouvée.</p>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ReclamationList;
