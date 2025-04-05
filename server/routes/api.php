<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\ReclamationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');

Route::post('/reclamations', [ReclamationController::class, 'store']);
Route::get('/reclamations', [ReclamationController::class, 'index']);

Route::get('/notifications/{userId}', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

Route::apiResource('polls', PollController::class)->only(['index', 'show']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        $reclamations = \App\Models\Reclamation::where('email', $user->email)->get();
        $activities = \App\Models\Activity::where('user_id', $user->id)->get();
        $noticesCount = \App\Models\Notification::where('user_id', $user->id)->where('read', false)->count();
        return response()->json([
            'reclamations' => $reclamations,
            'user' => $user,
            'activities' => $activities,
            'noticesCount' => $noticesCount,
        ]);
    });
    Route::get('news', [NewsController::class, 'index'])->name('news.index');

    Route::get('/users', [AuthController::class, 'users'])->name('users');
    Route::put('/user/{id}', [AuthController::class, 'updateUserStatus'])->name('updateUserStatus');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // News Routes
    Route::post('news', [NewsController::class, 'store'])->name('news.store');
    Route::post('news/{id}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{id}', [NewsController::class, 'destroy'])->name('news.destroy');


    // Reclamation Routes
    Route::put('/reclamation/{id}', [ReclamationController::class, 'updateReclamationState'])->name('updateReclamationState');
    Route::put('/reclamation/status/{id}', [ReclamationController::class, 'updateStatus']);
    Route::delete('/reclamation/{id}', [ReclamationController::class, 'destroy'])->name('deleteReclamation');

    // Poll Routes
    Route::post('/polls/{poll}/vote', [PollController::class, 'vote']);
    Route::get('/votes', [PollController::class, 'lastVotes']);
    Route::apiResource('polls', PollController::class);
});
Route::post('news/{id}/{Uid}/like', [NewsController::class, 'like'])->name('news.like');
Route::post('news/{id}/{Uid}/dislike', [NewsController::class, 'dislike'])->name('news.dislike');
Route::post('news/{id}/{Uid}/comment', [NewsController::class, 'comment'])->name('news.comment');
