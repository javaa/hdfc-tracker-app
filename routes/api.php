<?php

use App\Http\Controllers\AuthenticationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthenticationController::class, 'login']);
Route::get('/user/{email}', [AuthenticationController::class, 'getUserDetails']);
Route::post('/logout', [AuthenticationController::class, 'logout']);

Route::get('/test', function () {
    return response()->json(['message' => 'Hello, world!']);
});