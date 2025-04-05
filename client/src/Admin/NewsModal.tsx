import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; description: string }, image?: File) => void;
    newsItem?: {
        title: string;
        description: string;
        image?: string;
    };
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, onSave, newsItem }) => {
    const [title, setTitle] = useState(newsItem?.title || '');
    const [description, setDescription] = useState(newsItem?.description || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(newsItem?.image || '');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description }, image || undefined);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">{newsItem ? 'Edit News' : 'Add News'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="Preview" className="h-40 object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsModal;