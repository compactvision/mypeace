<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['type', 'payload', 'ip_hash'])]
class ExperienceResponse extends Model
{
    protected function casts(): array
    {
        return ['payload' => 'array'];
    }
}
