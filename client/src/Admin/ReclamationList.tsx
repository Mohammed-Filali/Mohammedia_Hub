import { useEffect, useState, useCallback } from "react";
import { UserApi } from "../service/UserApi";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReclamationEtat from "./ReclamationEtat";

interface Reclamation {
  id: number;
  category: string;
  description: string;
  image_url?: string;
  name?: string;
  email: string;
  etat: string;
}

const Reclamations = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [filters, setFilters] = useState({
    searchEmail: "",
    selectedCategory: "",
    selectedStatus: "",
  });

  const categories = ["voirie", "proprete", "eclairage"];

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const { data } = await UserApi.getReclamations();
        setReclamations(data.filter((r) => r.status === ""));
        toast.success("Réclamations chargées avec succès.");
      } catch (error) {
        toast.error("Erreur lors du chargement des réclamations.");
      }
    };

    fetchReclamations();
  }, [filters.selectedStatus]);

 

  const handleAccept = async (id: number, status: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await UserApi.ReclamationStatusUpdate(id, status);
      setReclamations((prevReclamations) =>
        prevReclamations.map((r) =>
          r.id === id ? { ...r, etat: status } : r
        )
      );
      toast.success("Réclamation acceptée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réclamation:", error);
      toast.error("Erreur lors de l'acceptation de la réclamation.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRefuse = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await UserApi.DeleteReclamation(id);
      setReclamations((prevReclamations) =>
        prevReclamations.filter((r) => r.id !== id)
      );
      toast.success("Réclamation refusée et supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la réclamation:", error);
      toast.error("Erreur lors du refus de la réclamation.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredReclamations = reclamations.filter((r) =>
    r.email.toLowerCase().includes(filters.searchEmail.toLowerCase()) &&
    (filters.selectedCategory ? r.category === filters.selectedCategory : true)
  );

  const renderReclamation = useCallback(
    (reclamation: Reclamation) => (
      <div
        key={reclamation.id}
        className="p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300"
      >
        <h3 className="font-semibold text-lg text-custom-green">
          {reclamation.category}
        </h3>
        <p className="text-gray-700 mt-2">{reclamation.description}</p>

        {reclamation.image_url && (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${reclamation.image_url}`}
            alt="Reclamation"
            className="w-full h-80 mt-2 rounded-md object-cover"
            onError={(e) => {
              // Fallback in case the image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        <p className="text-gray-600 mt-2">
          <strong>Nom:</strong> {reclamation.name || "N/A"}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {reclamation.email || "N/A"}
        </p>

        <div className="w-full flex space-x-2 mt-4">
          <button
            onClick={() => handleAccept(reclamation.id, "accept")}
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            disabled={loading[reclamation.id]}
          >
            {loading[reclamation.id] ? "Chargement..." : "Accepter"}
          </button>
          <button
            onClick={() => handleRefuse(reclamation.id)}
            className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            disabled={loading[reclamation.id]}
          >
            {loading[reclamation.id] ? "Chargement..." : "Refuser"}
          </button>
        </div>
      </div>
    ),
    [loading]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[85vh] overflow-y-auto">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, selectedStatus: "" }))}
          className={`px-4 py-2 rounded-md ${
            filters.selectedStatus === "" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Non Traitées
        </button>
        <button
          onClick={() => setFilters((prev) => ({ ...prev, selectedStatus: "accept" }))}
          className={`px-4 py-2 rounded-md ${
            filters.selectedStatus === "accept"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Acceptées
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Liste des Réclamations</h2>

      

      {filters.selectedStatus === "accept" ? (
        <ReclamationEtat />
      ) : (<div className="w-full">
        <input
        type="text"
        placeholder="Rechercher par email"
        value={filters.searchEmail}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, searchEmail: e.target.value }))
        }
        className="mb-4 p-2 border rounded-md w-full"
      />

      <select
        value={filters.selectedCategory}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, selectedCategory: e.target.value }))
        }
        className="mb-4 p-2 border rounded-md w-full"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((r, i) => (
          <option key={i} value={r}>
            {r}
          </option>
        ))}
      </select>

      <div className="space-y-4">
          {filteredReclamations.length === 0 ? (
            <p>Aucune réclamation trouvée.</p>
          ) : (
            filteredReclamations.map(renderReclamation)
          )}
        </div>
      </div>
        
        
      )}
    </div>
  );
};

export default Reclamations;
