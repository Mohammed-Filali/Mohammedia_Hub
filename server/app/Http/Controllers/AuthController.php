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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
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
}
