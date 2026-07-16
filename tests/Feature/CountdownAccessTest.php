<?php

namespace Tests\Feature;

use App\Models\CountdownConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class CountdownAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_redirects_to_countdown_while_enabled_before_target_date(): void
    {
        Carbon::setTestNow('2026-07-15 12:00:00');
        $this->createCountdown(['target_date' => '2026-07-21 00:00:00']);

        $this->get('/')->assertRedirect('/countdown');
        $this->get('/countdown')->assertOk()->assertInertia(
            fn ($page) => $page->component('CountdownExperience'),
        );
    }

    public function test_site_is_accessible_when_countdown_is_disabled(): void
    {
        Carbon::setTestNow('2026-07-15 12:00:00');
        $this->createCountdown([
            'target_date' => '2026-07-21 00:00:00',
            'is_countdown_enabled' => false,
        ]);

        $this->get('/')->assertOk()->assertInertia(
            fn ($page) => $page->component('Experience')->has('catalogue'),
        );
        $this->get('/countdown')->assertRedirect('/');
    }

    public function test_site_is_accessible_once_target_date_is_reached(): void
    {
        Carbon::setTestNow('2026-07-21 00:00:00');
        $this->createCountdown(['target_date' => '2026-07-21 00:00:00']);

        $this->get('/')->assertOk()->assertInertia(
            fn ($page) => $page->component('Experience'),
        );
        $this->get('/countdown')->assertRedirect('/');
    }

    /** @param array<string, mixed> $overrides */
    private function createCountdown(array $overrides = []): CountdownConfig
    {
        return CountdownConfig::query()->create(array_merge([
            'target_date' => '2026-07-21 00:00:00',
            'timezone' => 'Africa/Kinshasa',
            'is_countdown_enabled' => true,
            'is_3d_scene_enabled' => true,
            'is_sound_enabled' => false,
            'graphics_quality' => 'high',
            'manual_unlock' => false,
        ], $overrides));
    }
}
