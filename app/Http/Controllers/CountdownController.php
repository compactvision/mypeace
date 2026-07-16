<?php

namespace App\Http\Controllers;

use App\Models\CountdownConfig;
use App\Services\ExperienceContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CountdownController extends Controller
{
    public function home(ExperienceContentService $content): Response|RedirectResponse
    {
        if (CountdownConfig::query()->first()?->blocksPublicExperience()) {
            return redirect()->route('countdown');
        }

        return Inertia::render('Experience', [
            'catalogue' => $content->catalogue(),
        ]);
    }

    public function show(): Response|RedirectResponse
    {
        if (! CountdownConfig::query()->first()?->blocksPublicExperience()) {
            return redirect()->route('home');
        }

        return Inertia::render('CountdownExperience');
    }

    /**
     * Get the countdown configuration and current server time.
     */
    public function getConfig(): JsonResponse
    {
        // Cache the configuration for 1 hour, since admin updates clear it.
        // The server time is appended dynamically outside the cache.
        $config = Cache::remember('countdown_config_public', 3600, function () {
            $configModel = CountdownConfig::first();

            if (! $configModel) {
                return null;
            }

            return [
                'target_date' => $configModel->target_date->toIso8601String(),
                'timezone' => $configModel->timezone,
                'title' => $configModel->title,
                'subtitle' => $configModel->subtitle,
                'main_message' => $configModel->main_message,
                'alt_message' => $configModel->alt_message,
                'hidden_message' => $configModel->hidden_message,
                'end_message' => $configModel->end_message,
                'signature' => $configModel->signature,
                'is_countdown_enabled' => $configModel->is_countdown_enabled,
                'is_3d_scene_enabled' => $configModel->is_3d_scene_enabled,
                'is_sound_enabled' => $configModel->is_sound_enabled,
                'graphics_quality' => $configModel->graphics_quality,
                'manual_unlock' => $configModel->manual_unlock,
                'post_expiration_text' => $configModel->post_expiration_text,
            ];
        });

        if (! $config) {
            return response()->json(['error' => 'Configuration not found'], 404);
        }

        return response()->json([
            'server_time' => now()->toIso8601String(),
            'config' => $config,
        ]);
    }
}
