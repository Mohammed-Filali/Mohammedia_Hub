<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Récupérer les notifications d'un utilisateur
    public function index($userId)
    {
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // Marquer une notification comme lue
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    // Créer une nouvelle notification
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'message' => 'required|string',
        ]);

        $notification = Notification::create([
            'user_id' => $request->user_id,
            'message' => $request->message,
        ]);

        return response()->json($notification, 201);
    }
}
