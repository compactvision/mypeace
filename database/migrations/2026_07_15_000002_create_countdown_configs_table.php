<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('countdown_configs', function (Blueprint $table) {
            $table->id();
            $table->dateTime('target_date');
            $table->string('timezone')->default('UTC');
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('main_message')->nullable();
            $table->string('alt_message')->nullable();
            $table->string('hidden_message')->nullable();
            $table->string('end_message')->nullable();
            $table->string('signature')->nullable();
            $table->boolean('is_countdown_enabled')->default(true);
            $table->boolean('is_3d_scene_enabled')->default(true);
            $table->boolean('is_sound_enabled')->default(false);
            $table->enum('graphics_quality', ['low', 'medium', 'high'])->default('high');
            $table->dateTime('early_unlock_date')->nullable();
            $table->boolean('manual_unlock')->default(false);
            $table->string('post_expiration_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countdown_configs');
    }
};
