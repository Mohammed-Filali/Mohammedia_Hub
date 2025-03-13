import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';
const Reclamations = () => {
  const [reclamations, setReclamations] = useState([]);

  useEffect(() => {
    const fetchReclamations = async () => {
      const data = await UserApi.getReclamations() ;
      setReclamations(data.data.filter((r)=>{
        return !r.isAccept
      }));
    };
    fetchReclamations();
  }, [reclamations]);

  const handleAccept = async (id) => {
    await UserApi.updateReclamationStatus(id,{'isAccept':1});
    setReclamations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isAccept: 1 } : r))
    );
  };

  const handleReject = async (id) => {
    // await ReclamationApi.rejectReclamation(id);
    // setReclamations((prev) =>
    //   prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    // );
  };

  return (
<div className="bg-white p-6 rounded-lg shadow-md h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Liste des Réclamations</h2>
      <div className="space-y-4 ">
        {reclamations?.map((reclamation) => (
          <div key={reclamation.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{reclamation.category}</h3>
            <p>{reclamation.description}</p>
            {reclamation.image_url && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${reclamation.image_url}`}
                alt="Reclamation"
                className="w-full h-80 mt-2 rounded-md"
              />
            )}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleAccept(reclamation.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Accepter
              </button>
              <button
                onClick={() => handleReject(reclamation.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reclamations;