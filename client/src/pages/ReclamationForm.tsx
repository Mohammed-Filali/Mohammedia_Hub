import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { number, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Layout from '../layouts/layout';
import { UserApi } from '../service/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUser } from '../redux/store';

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
    dispatch(setUser(userData));
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
      age: user?.age ?? 0, // Default value as a number
    },
  });

  console.log('Form errors:', errors); // Log form errors
  console.log('User:', user); // Log user object

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error , setError]= useState('')
  const validateFile = (file: File | null): string | true => {
    if (file) {// File is required
    if (file.size > 5 * 1024 * 1024) return 'Le fichier ne doit pas dépasser 5 Mo'; // File size must be <= 5MB
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return 'Le fichier doit être une image (JPG, PNG)'; // File type must be JPG or PNG
    return true; // File is valid}
  }};

  const onSubmit = async (data: ReclamationFormData) => {
    console.log('Form submitted!'); // Debugging log
    if (isSubmitting) return;
    setIsSubmitting(true);

    const fileValidation = validateFile(file);
    if ( file && fileValidation !== true) {
      console.error('File validation error:', fileValidation); // Debugging log
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

      formData.append('adress', user?.adress ??data.adress);
      formData.append('telephone', user?.telephone ??data.telephone);
      formData.append('CIN', user?.CIN ?? data.CIN);
      formData.append('age', Number(data.age)); // Ensure age is passed as a number
      if (file) {formData.append('file', file)};

      console.log('FormData:', formData); // Debugging log

      const response = await UserApi.createReclamation(formData);
      // try {
      //   await UserApi.AddNotifications({
      //     "user_id": 1,
      //     "message": "une nouvelle reclamation"
      //   })
      // } catch (error) {
      //   console.log('notifications',error);
        
      // }
      
      console.log('API response:', response); // Debugging log
      
      alert('Réclamation soumise avec succès !');
      reset();
      setFile(null);
      setFileError(null);
      setError()
    } catch ({response}) {
      setError( response.data.message); // Debugging log

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 mt-6 rounded-lg shadow-md">
        <h1 className="text-3xl text-custom-green font-bold text-center">Soumettre une réclamation</h1>
        {error? <p className=' text-center text-xl text-red-600' > {error} </p>:""}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8" encType="multipart/form-data">
                    <div className="mb-4">
  <label className="block text-sm font-medium">NAME</label>
  <input
    type="text"
    {...register('name')}
    defaultValue={user?.name || ''}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium">E-mail</label>
  <input
    type="text"
    {...register('email')}
    defaultValue={user?.email || ''}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium">ADDRESS</label>
  <input
    type="text"
    {...register('adress')}
    defaultValue={user?.adress || ''}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium">CIN</label>
  <input
    type="text"
    {...register('CIN')}
    defaultValue={user?.CIN || ''}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium">TELEPHONE</label>
  <input
    type="text"
    {...register('telephone')}
    defaultValue={user?.telephone || ''}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium">AGE</label>
  <input
    type="number"
    {...register('age')}
    defaultValue={Number(user?.age)|| 0}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>


          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm text-custom-green font-medium">Catégorie</label>
            <select {...register('category')} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Sélectionner une catégorie</option>
              <option value="voirie">Voirie</option>
              <option value="eclairage">Éclairage</option>
              <option value="proprete">Propreté</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-custom-green text-sm font-medium">Description</label>
            <textarea {...register('description')} rows={4} className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-custom-green text-sm font-medium">Télécharger une photo</label>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setFileError(null); // Clear file error when a new file is selected
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {fileError && <p className="text-red-500 text-xs">{fileError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-custom-green text-white px-6 py-3 rounded-lg flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : "Soumettre"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
