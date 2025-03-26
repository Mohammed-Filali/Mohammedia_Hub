import { useEffect, useState } from "react";
import { UserApi } from "../service/UserApi";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Reclamation {
  id: number;
  category: string;
  description: string;
  image_url?: string;
  name?: string;
  email: string;
  etat: string;
}

const UserReclamations = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const categorie = ["voirie", "proprete", "eclairage"];

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const { reclamations } = await UserApi.getUser();
        setReclamations(reclamations);
      } catch (error) {
        toast.error("Erreur lors du chargement des réclamations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  const filteredReclamations = reclamations.filter((r) =>
    selectedCategory ? r.category === selectedCategory : true
  );

  return (
    <div className="flex flex-col w-full p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes réclamations</h1>

      {/* Search and filter */}
      <div className="flex items-center space-x-4 mb-6">
        <select
          className="border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categorie.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {filteredReclamations.length > 0 ? (
            filteredReclamations.reverse().map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{r.category}</p>
                  <p className="text-gray-600">{r.description}</p>
                  <p className="text-sm text-gray-500">{r.email}</p>
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      r.etat === "encours"
                        ? "text-yellow-500"
                        : r.etat === "finis"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {r.etat === "encours"
                      ? "En cours"
                      : r.etat === "finis"
                      ? "Terminé"
                      : "Refusé"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Aucune réclamation trouvée.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserReclamations;
