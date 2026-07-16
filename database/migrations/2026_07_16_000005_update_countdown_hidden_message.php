<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('countdown_configs')->update([
            'hidden_message' => "Je t'aime Cassy❤️",
        ]);
    }

    public function down(): void
    {
        DB::table('countdown_configs')->update([
            'hidden_message' => 'No matter how long the countdown is, I would still choose you.',
        ]);
    }
};
