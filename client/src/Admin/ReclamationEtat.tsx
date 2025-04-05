import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { UserApi } from "../service/UserApi";
import { toast } from "react-toastify";

interface Reclamation {
    id: string;
    category: string;
    description: string;
    email: string;
    etat: string;
    image?: string;
}

interface Filters {
    searchEmail: string;
    selectedCategory: string;
}

const categories: string[] = ["voirie", "proprete", "eclairage"];

const FilterInputs = ({
    filters,
    setFilters,
}: {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => (
    <div className="mb-4">
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
                setFilters((prev) => ({
                    ...prev,
                    selectedCategory: e.target.value,
                }))
            }
            className="p-2 border rounded-md w-full"
        >
            <option value="">Toutes les catégories</option>
            {categories.map((category, i) => (
                <option key={i} value={category}>
                    {category}
                </option>
            ))}
        </select>
    </div>
    );

const ReclamationList = ({
    title,
    reclamations,
    statusLabel,
    handleEtat,
}: {
    title: string;
    reclamations: Reclamation[];
    statusLabel: string;
    handleEtat: (id: string, etat: string) => void;
}) => (
    <div className="w-1/3 p-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {reclamations.length > 0 ? (
            reclamations.map((r) => (
                <div
                    key={r.id}
                    className="reclamation bg-white shadow-md rounded-lg p-4 mb-4"
                >
                    <div className="reclamation-info mb-2">
                        <p className="text-sm font-semibold">
                            Category: {r.category}
                        </p>
                        <p className="text-sm text-gray-600">
                            Description: {r.description}
                        </p>
                        <p className="text-sm text-gray-600">Email: {r.email}</p>
                        {r.image_url && (
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${r.image_url}`}
                                alt="Reclamation"
                                className="w-full h-auto mt-2 rounded"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display =
                                        "none";
                                }}
                            />
                        )}
                    </div>
                    <div className="reclamation-status flex items-center mb-2">
                        <CheckCircle
                            size={24}
                            className="text-green-500 mr-2"
                        />
                        <p className="text-sm font-medium">{statusLabel}</p>
                    </div>
                    <div className="reclamation-actions">
                        <select
                            className="border border-gray-300 rounded p-2 w-full"
                            value={r.etat}
                            onChange={(e) =>
                                handleEtat(r.id, e.target.value)
                            }
                        >
                            <option value="encours">Encours</option>
                            <option value="finis">Finis</option>
                            <option value="pas encours">Pas Encours</option>
                        </select>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No reclamations available.</p>
        )}
    </div>
);

export default function ReclamationEtat() {
    const [reclamations, setReclamations] = useState<Reclamation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        searchEmail: "",
        selectedCategory: "",
    });

    useEffect(() => {
        const fetchReclamations = async () => {
            try {
                const { data } = await UserApi.getReclamations();
                const filteredReclamations = data.filter(
                    (r: Reclamation) => r.status === "accept"
                );
                setReclamations(filteredReclamations);
            } catch (error) {
                toast.error(
                    "Erreur lors du chargement des réclamations. Veuillez réessayer."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReclamations();
    }, []);

    const handleEtat = async (id: string, etat: string) => {
        try {
            await UserApi.updateReclamationStatus(id, { etat });
            setReclamations((prevReclamations) =>
                prevReclamations.map((rec) =>
                    rec.id === id ? { ...rec, etat } : rec
                )
            );
            toast.success("État mis à jour avec succès.");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de l'état.");
        }
    };

    const filteredReclamations = reclamations.filter(
        (r) =>
            r.email.toLowerCase().includes(filters.searchEmail.toLowerCase()) &&
            (filters.selectedCategory
                ? r.category === filters.selectedCategory
                : true)
    );

    const groupedReclamations = {
        encours: filteredReclamations.filter((r) => r.etat === "encours"),
        finis: filteredReclamations.filter((r) => r.etat === "finis"),
        pasEncours: filteredReclamations.filter(
            (r) => r.etat === "pas encours"
        ),
    };

    if (loading) {
        return <p className="text-gray-500">Chargement des réclamations...</p>;
    }

    return (
        <div className="w-full">
            <FilterInputs filters={filters} setFilters={setFilters} />
            {filteredReclamations.length === 0 ? (
                <p>Aucune réclamation trouvée.</p>
            ) : (
                <div className="w-full flex flex-wrap bg-gray-100 p-6">
                    <ReclamationList
                        title="Pas Encours"
                        reclamations={groupedReclamations.pasEncours}
                        statusLabel="Pas Encours"
                        handleEtat={handleEtat}
                    />
                    <ReclamationList
                        title="Encours"
                        reclamations={groupedReclamations.encours}
                        statusLabel="Encours"
                        handleEtat={handleEtat}
                    />
                    <ReclamationList
                        title="Finis"
                        reclamations={groupedReclamations.finis}
                        statusLabel="Finis"
                        handleEtat={handleEtat}
                    />
                </div>
            )}
        </div>
    );
}
