<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminExperienceContentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CountdownController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CountdownController::class, 'home'])->name('home');
Route::get('/countdown', [CountdownController::class, 'show'])->name('countdown');

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
    Route::post('/admin/content/{content?}', [AdminExperienceContentController::class, 'store'])->name('admin.content.store');
    Route::post('/admin/content/{content}/profile-photo', [AdminExperienceContentController::class, 'storeProfilePhoto'])->name('admin.content.profile-photo.store');
    Route::delete('/admin/content/{content}', [AdminExperienceContentController::class, 'destroy'])->name('admin.content.destroy');
    Route::delete('/admin/content/{content}/media/{media}', [AdminExperienceContentController::class, 'destroyMedia'])->name('admin.content.media.destroy');
    Route::put('/admin/countdown', [AdminExperienceContentController::class, 'updateCountdown'])->name('admin.countdown.update');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
