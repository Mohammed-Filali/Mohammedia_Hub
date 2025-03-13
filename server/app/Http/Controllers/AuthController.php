<?php

namespace App\Http\Controllers;

use Log;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'adress'=> 'required|string|max:255',
            'CIN'=> 'required|string|max:10',
            'telephone'=> 'required|string|max:10',
            'age' => 'required|integer|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'adress'=> $request->adress,
            'CIN'=> $request->CIN,
            'telephone'=> $request->telephone,
            'age'=> $request->age,

            'password' => bcrypt($request->password),
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $user->createToken('YourAppName')->plainTextToken
        ], 201);
    }

    // Login an existing user
    public function login(Request $request)
    {
        // Validate login credentials
        $credentials = $request->only('email', 'password');

        Log::info('Login attempt', ['credentials' => $credentials]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if(!$user->isActive){
                return response()->json(['message' => 'ce compte est desactivé'], 401);

            }
            return response()->json([
                'message' => 'Login successful',
                'status'=>true,
                'token' => $user->createToken('YourAppName')->plainTextToken,
                'user' => $user
            ]);

        }

        \Log::warning('Unauthorized login attempt', ['credentials' => $credentials]);
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Logout a user and revoke token
    public function logout(Request $request)
    {
        // Revoke user's token for logout
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Logged out successfully']);
    }

    // Get authenticated user's data
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function users()
    {
        $users= User::all();
        return response()->json(['data'=>$users]);
    }

    public function updateUserStatus (Request $request , $id){
        $request->validate(
            ['isActive'=>'required']
        );
        \Log::warning('Unauthorized login attempt', ['credentials' => $request->isActive]);

        $user = User::find($id);
        $user->update([
            'isActive' => $request->isActive,

        ]);
        return response()->json(['data'=>$user]);

    }

}
