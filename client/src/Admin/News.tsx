import React, { useEffect, useState } from 'react';
import { UserApi } from '../service/UserApi';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import NewsModal from './NewsModal';

interface NewsItem {
    id: number;
    title: string;
    description: string;
    image?: string;
    created_at: string;
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
}

const AdminNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await UserApi.getNews();
            setNews(data);
        } catch (error) {
            toast.error('Failed to fetch news');
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (newsItem: NewsItem) => {
        setCurrentNews(newsItem);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentNews(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            setIsDeleting(true);
            try {
                await UserApi.deleteNews(id);
                toast.success('News deleted successfully');
                fetchNews();
            } catch (error) {
                toast.error('Failed to delete news');
                console.error('Error deleting news:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSave = async (newsData: Omit<NewsItem, 'id' | 'created_at'>, image?: File) => {
        try {
            const formData = new FormData();
            formData.append('title', newsData.title);
            formData.append('description', newsData.description);
            if (image) formData.append('image', image);
            console.log(formData);
            
            if (currentNews) {
                // Update existing news
                await UserApi.updateNews(currentNews.id, formData);
                toast.success('News updated successfully');
            } else {
                // Add new news
                await UserApi.addNew(formData);
                toast.success('News added successfully');
            }
            
            setIsModalOpen(false);
            fetchNews();
        } catch (error) {
            toast.error(currentNews ? 'Failed to update news' : 'Failed to add news');
            console.error('Error saving news:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                >
                    <FiPlus className="mr-2" />
                    Add News
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No news available</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {news.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-4">
                                                <span>👍 {item.likes_count}</span>
                                                <span>👎 {item.dislikes_count}</span>
                                                <span>💬 {item.comments_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FiEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={isDeleting}
                                                    className="text-red-600 hover:text-red-900 disabled:text-red-300"
                                                >
                                                    <FiTrash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <NewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                newsItem={currentNews}
            />
        </div>
    );
};

export default AdminNews;