<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PollController;

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




Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [AuthController::class, 'users'])->name('users');
    Route::put('/user/{id}', [AuthController::class, 'updateUserStatus'])->name('updateUserStatus');
    Route::apiResource('polls', PollController::class);
    Route::post('/polls/{poll}/vote', [PollController::class, 'vote']);
    Route::put('/reclamation/{id}', [ReclamationController::class, 'updateReclamationState'])->name('updateReclamationState');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/votes', [PollController::class, 'lastVotes']);

});


Route::apiResource('polls', PollController::class);

Route::post('/reclamations', [ReclamationController::class, 'store']);
Route::get('/reclamations', [ReclamationController::class, 'index']);
Route::get('/notifications/{userId}', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
