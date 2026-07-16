<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('countdown_configs')->update([
            'is_sound_enabled' => true,
        ]);
    }

    public function down(): void
    {
        DB::table('countdown_configs')->update([
            'is_sound_enabled' => false,
        ]);
    }
};
