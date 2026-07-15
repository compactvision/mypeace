<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Experience')->name('home');

Route::middleware('guest')->group(function (): void {
    Route::inertia('/login', 'Login')->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    Route::inertia('/register', 'Register')->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::inertia('/forgot-password', 'ForgotPassword')->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/admin', AdminController::class)->name('admin');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
