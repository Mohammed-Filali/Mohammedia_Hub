import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';
import Layout from '../layouts/layout';
import { Loader2 } from 'lucide-react';

// Define the Reclamation interface
interface Reclamation {
  id: string;
  category: string;
  description: string;
  etat: string; // Add etat field
  image_url?: string;
}

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [reclamationsFinis, setReclamationsFinis] = useState<Reclamation[]>([]); // Updated to filter "finis"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category filter

  // Define available categories
  const categories = ['voirie', 'proprete', 'eclairage']; // Add more categories as needed

  useEffect(() => {
    const fetchReclamations = async () => {
      setLoading(true);
      try {
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

  useEffect(() => {
    // Filter reclamations with etat === 'finis'
    const filteredFinis = reclamations.filter((r) => r.etat === 'finis');
    setReclamationsFinis(filteredFinis);
  }, [reclamations]);

  // Apply category filter to reclamationsFinis
  const filteredReclamations = selectedCategory
    ? reclamationsFinis.filter((r) => r.category === selectedCategory)
    : reclamationsFinis;

  return (
    <Layout>
      <div className="w-full flex flex-col mx-auto min-h-screen p-6 mt-2 rounded-lg bg-gray-50">
        <h1 className="text-3xl text-custom-green font-bold text-center mb-8">
          Réclamations Finis
        </h1>

        {/* Category Filter Dropdown */}
        <div className="mb-6 flex justify-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="w-full flex justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-custom-green" />
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mt-6 w-full">
          {filteredReclamations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredReclamations.map((reclamation) => (
                <div
                  key={reclamation.id}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <h2 className="font-semibold text-xl text-custom-green mb-4">
                    {reclamation.category}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {reclamation.description}
                  </p>
                  {reclamation.image_url && (
                    <div className="mt-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${reclamation.image_url}`}
                        alt="Reclamation"
                        className="w-full h-40 object-cover rounded-md"
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
            !loading && (
              <p className="text-center text-gray-500">
                Aucune réclamation finis trouvée.
              </p>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReclamationList;