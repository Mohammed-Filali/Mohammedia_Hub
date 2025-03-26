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
}) => {
    return (
        <div className="w-1/3 p-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {reclamations.length > 0 ? (
                reclamations.map((r) => (
                    <div
                        key={r.id}
                        className="reclamation bg-white shadow-md rounded-lg p-4 mb-4"
                    >
                        <div className="reclamation-info mb-2">
                            <p className="text-sm font-semibold">Category: {r.category}</p>
                            <p className="text-sm text-gray-600">Description: {r.description}</p>
                            <p className="text-sm text-gray-600">Email: {r.email}</p>
                            {r.image_url && (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${r.image_url}`}
                                    alt="Reclamation"
                                    className="w-full h-auto mt-2 rounded"
                                    onError={(e) => {
                                        // Fallback in case the image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                />
                            )}
                        </div>
                        <div className="reclamation-status flex items-center mb-2">
                            <CheckCircle size={24} className="text-green-500 mr-2" />
                            <p className="text-sm font-medium">{statusLabel}</p>
                        </div>
                        <div className="reclamation-actions">
                            <select
                                className="border border-gray-300 rounded p-2 w-full"
                                value={r.etat}
                                onChange={(e) => handleEtat(r.id, e.target.value)}
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
};

export default function ReclamationEtat() {
    const [reclamations, setReclamations] = useState<Reclamation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReclamations = async () => {
            try {
                const { data } = await UserApi.getReclamations();
                const filteredReclamations = data.filter((r: Reclamation) => r.status === "accept");
                setReclamations(filteredReclamations);
            } catch (error) {
                toast.error("Erreur lors du chargement des réclamations.");
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

    const groupedReclamations = {
        encours: reclamations.filter((r) => r.etat === "encours"),
        finis: reclamations.filter((r) => r.etat === "finis"),
        pasEncours: reclamations.filter((r) => r.etat === "pas encours"),
    };

    if (loading) {
        return <p className="text-gray-500">Chargement des réclamations...</p>;
    }

    return (
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
    );
}
