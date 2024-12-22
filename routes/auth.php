<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationSessionController;

Route::get('login', [AuthenticationSessionController::class, 'create'])
->name('login');

Route::post('login', [AuthenticationSessionController::class, 'store']);
Route::post('logout', [AuthenticationSessionController::class, 'logout'])
->name('logout');

