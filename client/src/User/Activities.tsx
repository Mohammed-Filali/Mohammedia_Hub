import React, { useState, useEffect } from 'react';
import { UserApi } from '../service/UserApi';

interface Activity {
    id: string;
    name: string;
    description: string;
    date: string;
}

const Activities: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const user = await UserApi.getUser();
                setActivities(user.activities || []);
            } catch (err) {
                setError('Failed to fetch activities');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-lg font-medium text-gray-700">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-red-600 text-lg font-medium">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="w-full">
            <ul className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activities.slice(0, 5).reverse().map((activity) => (
                <li
                    key={activity.id}
                    className="p-4 border w-full border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">{activity.name}</h2>
                    <p className="text-gray-700 mb-3">{activity.description}</p>
                    <p className="text-gray-500 text-sm">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(activity.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                    </p>
                </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default Activities;
