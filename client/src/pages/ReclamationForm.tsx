import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Layout from '../layouts/layout';
import { UserApi } from '../service/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUser } from '../redux/store';
import { toast } from 'react-toastify';

const reclamationSchema = z.object({
  description: z.string().min(10, 'La description est obligatoire et doit comporter au moins 10 caractères'),
  category: z.string().min(1, 'Veuillez choisir une catégorie'),
  name: z.string(),
  email: z.string(),
  adress: z.string(),
  telephone: z.string(),
  CIN: z.string(),
  age: z.string(),
});

type ReclamationFormData = z.infer<typeof reclamationSchema>;

export default function ReclamationForm() {
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const userSetter = async () => {
    const userData = await UserApi.getUser();
    dispatch(setUser(userData.user));
  };

  useEffect(() => {
    if (token !== 'false' && !user) {
      userSetter();
    }
  }, [user, token, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReclamationFormData>({
    resolver: zodResolver(reclamationSchema),
    defaultValues: {
      age: user?.age ?? 0,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file: File | null): string | true => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) return 'Le fichier ne doit pas dépasser 5 Mo';
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return 'Le fichier doit être une image (JPG, PNG)';
      return true;
    }
    return 'Un fichier est requis';
  };

  const onSubmit = async (data: ReclamationFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const fileValidation = validateFile(file);
    if (file && fileValidation !== true) {
      setFileError(fileValidation);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('name', user?.name ?? data.name);
      formData.append('email', user?.email ?? data.email);
      formData.append('adress', user?.adress ?? data.adress);
      formData.append('telephone', user?.telephone ?? data.telephone);
      formData.append('CIN', user?.CIN ?? data.CIN);
      formData.append('age', Number(data.age).toString());
      if (file) formData.append('file', file);

      const response = await UserApi.createReclamation(formData);
      toast.success('Réclamation soumise avec succès !');
      reset();
      setFile(null);
      setFileError(null);
      setError('');
    } catch ({ response }) {
      setError(response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl text-custom-green font-bold text-center mb-6">Soumettre une réclamation</h1>
        {error && <p className="text-center text-xl text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                {...register('name')}
                defaultValue={user?.name || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                {...register('email')}
                defaultValue={user?.email || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Adresse</label>
              <input
                type="text"
                {...register('adress')}
                defaultValue={user?.adress || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">CIN</label>
              <input
                type="text"
                {...register('CIN')}
                defaultValue={user?.CIN || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Téléphone</label>
              <input
                type="text"
                {...register('telephone')}
                defaultValue={user?.telephone || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Âge</label>
              <input
                type="number"
                {...register('age')}
                defaultValue={Number(user?.age) || 0}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Catégorie</label>
            <select
              {...register('category')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="voirie">Voirie</option>
              <option value="eclairage">Éclairage</option>
              <option value="proprete">Propreté</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

            <div>
            <label className="block text-sm font-medium">Télécharger une photo</label>
            <div className="flex items-center space-x-3">
              <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setFileError(null);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
              />
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-custom-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16l4-4m0 0l4 4m-4-4v12m13-12h-4m4 0l-4-4m4 4l-4 4"
              />
              </svg>
            </div>
            {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
            </div>

          <button
            type="submit"
            className="w-full bg-custom-green text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Soumettre'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
