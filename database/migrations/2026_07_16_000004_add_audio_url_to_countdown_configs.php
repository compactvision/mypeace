<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('countdown_configs', function (Blueprint $table) {
            $table->string('audio_url', 2000)->nullable()->after('signature');
        });
    }

    public function down(): void
    {
        Schema::table('countdown_configs', function (Blueprint $table) {
            $table->dropColumn('audio_url');
        });
    }
};
