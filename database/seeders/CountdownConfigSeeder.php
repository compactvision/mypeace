<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CountdownConfig;

class CountdownConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CountdownConfig::create([
            'target_date' => '2026-07-21 00:00:00',
            'timezone' => 'Europe/Paris',
            'title' => 'Until Chapter Five',
            'subtitle' => '21 July 2026',
            'main_message' => 'Every second brings me closer to celebrating My Peace.',
            'alt_message' => 'Five months ago, our story began by the river.',
            'hidden_message' => 'No matter how long the countdown is, I would still choose you.',
            'end_message' => 'Happy five months, My Peace.',
            'signature' => 'From Only You.',
            'is_countdown_enabled' => true,
            'is_3d_scene_enabled' => true,
            'is_sound_enabled' => false,
            'graphics_quality' => 'high',
            'manual_unlock' => false,
            'post_expiration_text' => 'Chapter Five is unlocked.',
        ]);
    }
}
