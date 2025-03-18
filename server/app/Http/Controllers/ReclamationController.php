<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
if ($user &&!$user->isActive) {
    return response()->json(['message' => 'Le email de ce compte est déjà désactivé'], 400);
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
            'message' => 'ggggggggggg',
        ]);

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

    public function updateReclamationState(Request $request , $id){
        $request->validate([
            'etat' => 'required|in:pas encours,encours,finis',
        ]);
        $reclamation=Reclamation::find($id);
        $reclamation->update(['etat' => $request->etat]);

        return response()->json(['message' => 'État mis à jour avec succès.']);

    }

}
