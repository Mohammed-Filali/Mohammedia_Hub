import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaExclamationTriangle, FaPoll, FaUsers } from 'react-icons/fa';
import { UserApi } from '../service/UserApi';

type Stats = {
  totalUsers: number;
  totalReclamations: number;
  totalPolls: number;
  acceptedReclamations: number;
  rejectedReclamations: number;
  activeUsers: number;
  inactiveUsers: number;
};

type Poll = {
  id: string;
  title: string;
  createdAt: string;
};

const COLORS = ['#a78200', '#606c38'];

const Card = ({ label, count, bg, icon }: { label: string; count: number; bg: string; icon: JSX.Element }) => (
  <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
    <div className="h-full flex flex-1 flex-col justify-between">
      <p className="text-base text-gray-600">{label}</p>
      <span className="text-2xl font-semibold">{count}</span>
      <span className="text-sm text-gray-400">{"110 last month"}</span>
    </div>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${bg}`}>
      {icon}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [votes, setVotes] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const users = await UserApi.getUsers();
        const reclamations = await UserApi.getReclamations();
        const pollsData = await UserApi.getPull();
        const votesData = await UserApi.getVotes();
        setStats({
          totalUsers: users.data.length,
          totalReclamations: reclamations.data.length,
          totalPolls: pollsData.length,
          acceptedReclamations: reclamations.data.filter((u) => u.etat === 'encours').length,
          nonTreteReclamations: reclamations.data.filter((u) => u.status === '').length,
          FinisReclamations: reclamations.data.filter((u) => u.etat === 'finis').length,
          rejectedReclamations: reclamations.data.filter((u) => u.etat === 'pas encours').length,
          activeUsers: users.data.filter((u) => u.isActive === 1).length,
          inactiveUsers: users.data.filter((u) => u.isActive === 0).length,
        });

        setVotes(votesData.map((vote: any) => ({
          id: vote.id,
          question: vote.poll.question,
          userName: vote.user.name,
          voteDate: vote.created_at,
          email : vote.user.email
        })));

        setLastUpdate(new Date().toLocaleString());
      } catch (err) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  const barData = [
    { name: 'Réclamations', value: stats.totalReclamations },
    { name: 'Non Traitées', value: stats.nonTreteReclamations },
    { name: 'encours', value: stats.acceptedReclamations },
    { name: 'pas_encours', value: stats.rejectedReclamations },
    { name: 'finis', value: stats.FinisReclamations },

  ];

  const pieData = [
    { name: 'Actifs', value: stats.activeUsers },
    { name: 'Désactivés', value: stats.inactiveUsers },
  ];

  const statss = [
    {
      _id: '1',
      label: 'TOTAL Users',
      total: stats.totalUsers,
      icon: <FaUsers />,
      bg: 'bg-[#1d4ed8]',
    },
    {
      _id: '2',
      label: 'Total Reclamations',
      total: stats.totalReclamations,
      icon: <FaExclamationTriangle />,
      bg: 'bg-[#0f766e]',
    },
    {
      _id: '3',
      label: 'Total Polls',
      total: stats.totalPolls,
      icon: <FaPoll />,
      bg: 'bg-[#f59e0b]',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Aperçu des Statistiques</h2>
      <div className="text-sm text-gray-500 mb-4">
        Dernière mise à jour : {lastUpdate}
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statss.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>
      <div className="w-full flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 mt-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Statistiques Générales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#a78200" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Statut des Utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Derniers Sondages</h3>
        <ul className="space-y-4">
            {votes.slice(0, 4).map((poll) => (
            <li key={poll.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <h4 className="text-md font-semibold">{poll.question}</h4>
              <p className="text-sm text-gray-500">Créé le: {new Date(poll.voteDate).toLocaleDateString()}</p>
              <p className="text-sm text-l text-gray-500">Utilisateur: {poll.userName}</p>
              <p className="text-sm  text-gray-500"> {poll.email}</p>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
}
