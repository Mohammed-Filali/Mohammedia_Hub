<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;


class ReclamationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|min:10',
            'category' => 'required',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'adress'=> 'required|string|max:255',
            'CIN'=> 'required|string|max:10',
            'telephone'=> 'required|string|max:10',
            'age' => 'required|integer|max:255',
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::where('email', $request->input('email'))->first();
        if ($user && !$user->isActive) {
            return response()->json(['message' => 'L\'email de ce compte est déjà désactivé'], 400);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('reclamations', 'public');
        }

        $reclamation = Reclamation::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'adress' => $request->input('adress'),
            'CIN' => $request->input('CIN'),
            'telephone' => $request->input('telephone'),
            'age' => $request->input('age'),
            'description' => $request->input('description'),
            'category' => $request->input('category'),
            'file_path' => $filePath,
        ]);

        Notification::create([
            'user_id' => 1,
            'message' => sprintf(
                'Nouvelle réclamation soumise par : %s (Email : %s)',
                $request->input('name'),
                $request->input('email')
            ),
        ]);

        if ($user) {
            $user->activities()->create([
                'user_id' => $user->id,
                'action' => 'Ajout de réclamation',
                'description' => 'Vous avez ajouté une nouvelle réclamation avec la catégorie ' . $request->input('category') ,
            ]);

        }

        return response()->json(['message' => 'Réclamation soumise avec succès', 'reclamation' => $reclamation], 201);
    }

    public function index()
    {
        $reclamations = Reclamation::all();
        return response()->json([
            'data' => $reclamations->map(function ($reclamation) {
                $reclamation->image_url = asset('storage/' . $reclamation->file_path);
                return $reclamation;
            }),
        ]);
    }

    public function updateReclamationState(Request $request, $id)
    {
        $request->validate([
            'etat' => 'required|in:pas encours,encours,finis',
        ]);

        $reclamation = Reclamation::find($id);
        $reclamation->update(['etat' => $request->input('etat')]);


        $user = User::where('email', $reclamation->email)->first();
        if ($user ) {
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Votre réclamation a été mise à jour.',
            ]);        }

        return response()->json(['message' => 'État de la réclamation mis à jour avec succès.']);
    }



    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accept,refuse,', // Valider les valeurs possibles
        ]);

        $reclamation = Reclamation::findOrFail($id);
        $reclamation->status = $request->status;
        $reclamation->save();

        $user = User::where('email', $reclamation->email)->first();
        if ($user ) {
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Votre réclamation a été accepté par admine',
            ]);        }

        return response()->json(['message' => 'Statut mis à jour avec succès.']);
    }

    public function destroy($id)
    {
        $reclamation = Reclamation::find($id);
        $reclamation->delete();
        $user = User::where('email', $reclamation->email)->first();
        if ($user ) {
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Votre réclamation a été refusé par admin',
            ]);        }

        return response()->json(['message' => 'Réclamation supprimée avec succès.']);
    }

}
