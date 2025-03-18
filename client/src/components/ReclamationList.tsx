import { useEffect, useState } from "react";
import { UserApi } from "../service/UserApi";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
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

const Reclamations = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const categorie = ["voirie", "proprete", "eclairage"];

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const { data } = await UserApi.getReclamations();
        setReclamations(data.filter((r) => r.etat === 'pas encours'));
      } catch (error) {
        toast.error("Erreur lors du chargement des réclamations.");
      }
    };

    fetchReclamations();
  }, []);

  const updateReclamationStatus = async (id: number, status: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await UserApi.updateReclamationStatus(id, { etat: status });
      setReclamations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, etat: status } : r))
      );
      toast.success(`Réclamation ${status === "encours" ? "acceptée" : "refusée"} avec succès !`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la réclamation.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleConfirm = (id: number, status: string) => {
    confirmAlert({
      title: "Confirmer",
      message: `Êtes-vous sûr de vouloir ${status === "encours" ? "accepter" : "refuser"} cette réclamation ?`,
      buttons: [
        {
          label: "Oui",
          onClick: () => updateReclamationStatus(id, status),
        },
        {
          label: "Non",
        },
      ],
    });
  };

  // Apply search and category filter
  const filteredReclamations = reclamations.filter((r) =>
    r.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
    (selectedCategory ? r.category === selectedCategory : true)
  );

  const renderReclamation = (reclamation: Reclamation) => (
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
        />
      )}

      <p className="text-gray-600 mt-2">
        <strong>Nom:</strong> {reclamation.name || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Email:</strong> {reclamation.email || "N/A"}
      </p>

      <div className="mt-4 flex space-x-2">
        {/* Accept Button */}
        <button
          onClick={() => handleConfirm(reclamation.id, "encours")}
          className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
          disabled={loading[reclamation.id]}
        >
          {loading[reclamation.id] ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <CheckCircle className="mr-2" size={18} />
          )}
          {loading[reclamation.id] ? "Chargement..." : "Accepter"}
        </button>

        {/* Reject Button */}
        <button
          onClick={() => handleConfirm(reclamation.id, "finis")}
          className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          disabled={loading[reclamation.id]}
        >
          {loading[reclamation.id] ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <XCircle className="mr-2" size={18} />
          )}
          {loading[reclamation.id] ? "Chargement..." : "Refuser"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Liste des Réclamations</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Rechercher par email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="mb-4 p-2 border rounded-md w-full"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-4 p-2 border rounded-md w-full"
      >
        <option value="">Toutes les catégories</option>
        {categorie.map((r, i) => (
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
  );
};

export default Reclamations;