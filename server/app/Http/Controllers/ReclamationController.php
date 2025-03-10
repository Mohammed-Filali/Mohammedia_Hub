<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
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
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5120', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('reclamations', 'public');
        }

        $reclamation = Reclamation::create([
            'description' => $request->input('description'),
            'category' => $request->input('category'),
            'file_path' => $filePath,
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
}
