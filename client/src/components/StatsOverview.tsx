import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { UserApi } from '../service/UserApi';

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReclamations: 0,
    acceptedReclamations: 0,
    rejectedReclamations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const users = await UserApi.getUsers();
      const reclamations = await UserApi.getReclamations();
      console.log(reclamations);

      setStats({
        totalUsers: users.data.length,
        totalReclamations: reclamations.data.length,
        acceptedReclamations: reclamations.data.filter((r) => r.isAccept == 1).length,
        rejectedReclamations: reclamations.data.filter((r) => r.isAccept === 0).length,
      });
    };
    fetchStats();
  }, []);
  
  const data = [
    { name: 'Utilisateurs', value: stats.totalUsers },
    { name: 'Réclamations', value: stats.totalReclamations },
    { name: 'Acceptées', value: stats.acceptedReclamations },
    { name: 'Refusées', value: stats.rejectedReclamations },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Aperçu des Statistiques</h2>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#4F46E5" />
      </BarChart>
    </div>
  );
};

export default StatsOverview;