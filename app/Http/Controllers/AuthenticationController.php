<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthenticationController extends Controller
{
    private $apiBaseUrl = 'http://18.141.173.252';

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            // Make request to external authentication service
            $response = Http::post($this->apiBaseUrl . '/login', [
                'email' => $request->email,
                'password' => $request->password,
            ]);

            if ($response->successful()) {
                $token = $response->json('accessToken');

                // Store token in session or return to client
                session(['api_token' => $token]);

                return response()->json([
                    'status' => 'success',
                    'accessToken' => $token,
                    'message' => 'Successfully logged in'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication service unavailable'
            ], 500);
        }
    }

    public function getUserDetails($email)
    {
        try {
            $token = session('api_token') ?? request()->header('Authorization');

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No token provided'
                ], 401);
            }


            // Clean the token before using it
            $cleanedToken = $this->cleanToken($token);

            // Make request to get user details
            // http://18.141.173.252/api/UserDetail/string@string.com
            $url = $this->apiBaseUrl . '/api/UserDetail/' . $email;
            // dd($token, $url);
            $response = Http::withToken($cleanedToken)
                ->get($url);

            // dd($response);

            if ($response->successful()) {
                return response()->json([
                    'status' => 'success',
                    'data' => $response->json()
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user details'
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service unavailable'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = session('api_token') ?? $request->bearerToken();

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No token provided'
                ], 401);
            }

            // Clean the token before using it
            $cleanedToken = $this->cleanToken($token);

            // Invalidate token on the external service
            $response = Http::withToken($cleanedToken)
                ->post($this->apiBaseUrl . '/logout');

            // Clear token from session regardless of external service response
            session()->forget('api_token');

            if ($response->successful()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully logged out'
                ]);
            }

            // Even if the external service fails, we still logged out locally
            return response()->json([
                'status' => 'warning',
                'message' => 'Logged out locally, but external service logout failed'
            ], 200);

        } catch (\Exception $e) {
            // Clear local session even if request fails
            session()->forget('api_token');

            return response()->json([
                'status' => 'warning',
                'message' => 'Logged out locally, but external service unavailable'
            ], 200);
        }
    }

    // Helper method for making authenticated API calls
    protected function makeAuthenticatedRequest($method, $endpoint, $data = [])
    {
        $token = session('api_token') ?? request()->header('Authorization');

        return Http::withToken($token)
            ->$method($this->apiBaseUrl . $endpoint, $data);
    }

    // Helper method to clean token
    private function cleanToken($token)
    {
        if (Str::startsWith($token, 'Bearer ')) {
            return Str::substr($token, 7);
        }
        return $token;
    }

}
