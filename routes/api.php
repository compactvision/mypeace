<?php

use App\Http\Controllers\Api\ExperienceContentController;
use App\Http\Controllers\Api\ExperienceResponseController;
use Illuminate\Support\Facades\Route;

Route::prefix('experience')->middleware('throttle:60,1')->group(function (): void {
    Route::get('/content', [ExperienceContentController::class, 'index'])->name('api.experience.content');
    Route::post('/responses/next-date', [ExperienceResponseController::class, 'storeNextDate'])
        ->name('api.experience.responses.next-date');
    Route::post('/responses/final-answer', [ExperienceResponseController::class, 'storeFinalAnswer'])
        ->name('api.experience.responses.final-answer');
});

Route::get('/countdown/config', [\App\Http\Controllers\CountdownController::class, 'getConfig'])->name('api.countdown.config');
