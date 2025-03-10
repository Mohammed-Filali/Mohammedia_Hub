import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '../layouts/layout';
import { UserApi } from '../service/UserApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const reclamationSchema = z.object({
  description: z.string().min(10, 'La description est obligatoire et doit comporter au moins 10 caractères'),
  category: z.string().min(1, 'Veuillez choisir une catégorie'),
  // Le champ "file" est désormais validé dans onSubmit
});

type ReclamationFormData = {
  description: string;
  category: string;
  file: File | null;
};

const ReclamationForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReclamationFormData>({
    resolver: zodResolver(reclamationSchema),
  });
 const { user } = useSelector(state => state);
  const Token = localStorage.getItem('token');
  const [file, setFile] = useState<File | null>(null);

  // Validation manuelle du fichier (taille, type)
  const validateFile = (file: File | null) => {
    if (!file) {
      return 'Le fichier est requis';
    }
    if (file.size > 5 * 1024 * 1024) { // Taille max 5MB
      return 'Le fichier ne doit pas dépasser 5 Mo';
    }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      return 'Le fichier doit être une image (JPG, PNG)';
    }
    return true;
  };

  const onSubmit = async (data: ReclamationFormData) => {
    // Valider le fichier
    const fileError = validateFile(file);
    if (fileError !== true) {
      alert(fileError); // Afficher l'erreur
      return;
    }

    try {
      // FormData pour envoyer le fichier et les autres données
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('category', data.category);
      if (file) {
        formData.append('file', file);
      }

      await UserApi.createReclamation(formData); // Appel API pour soumettre la réclamation
    } catch (error) {
      console.error('Erreur lors de la soumission de la réclamation:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl text-custom-green font-bold text-center">Soumettre une réclamation</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8" encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm text-custom-green font-medium">Catégorie</label>
            <select
              id="category"
              {...register('category')}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="voirie">Voirie</option>
              <option value="eclairage">Éclairage</option>
              <option value="proprete">Propreté</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-custom-green text-sm font-medium">Description</label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block text-custom-green text-sm font-medium">Télécharger une photo</label>
            <input
              type="file"
              id="file"
              {...register('file')}
              onChange={(e) => {
                const selectedFile = e.target.files ? e.target.files[0] : null;
                setFile(selectedFile);
                setValue('file', selectedFile); // Mettre à jour la valeur du formulaire
              }}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            />
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
          </div>

          { user && Token !== 'false' ? <button type="submit" className="w-full bg-custom-green text-white px-6 py-3 rounded-lg mt-4">
            Soumettre
          </button>: <div className='w-full text-center'> connecter pour autorisez <Link to={'/login'}>Click</Link> </div> }
        </form>
      </div>
    </Layout>
  );
};

export default ReclamationForm;
