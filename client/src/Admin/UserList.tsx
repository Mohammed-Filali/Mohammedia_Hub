import { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await UserApi.getUsers();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, isActive) => {
    await UserApi.updateUserStatus(id, isActive === 1 ? 0 : 1);
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !isActive } : user
      )
    );
    toast.success('Statut de l\'utilisateur mis à jour avec succès !');
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Liste des Utilisateurs</h2>
      <input
        type="text"
        placeholder="Rechercher par email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded-md w-full"
      />
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{user.name}</h3>
            <p>{user.email}</p>
            <button
              onClick={() => handleToggleStatus(user.id, user.isActive)}
              className={`mt-2 px-4 py-2 rounded-md ${
                user.isActive ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              {user.isActive ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;