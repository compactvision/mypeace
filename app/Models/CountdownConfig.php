<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountdownConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'target_date',
        'timezone',
        'title',
        'subtitle',
        'main_message',
        'alt_message',
        'hidden_message',
        'end_message',
        'signature',
        'audio_url',
        'is_countdown_enabled',
        'is_3d_scene_enabled',
        'is_sound_enabled',
        'graphics_quality',
        'early_unlock_date',
        'manual_unlock',
        'post_expiration_text',
    ];

    protected $casts = [
        'target_date' => 'datetime',
        'early_unlock_date' => 'datetime',
        'is_countdown_enabled' => 'boolean',
        'is_3d_scene_enabled' => 'boolean',
        'is_sound_enabled' => 'boolean',
        'manual_unlock' => 'boolean',
    ];

    public function blocksPublicExperience(): bool
    {
        return $this->is_countdown_enabled
            && ! $this->manual_unlock
            && $this->target_date->isFuture();
    }
}
