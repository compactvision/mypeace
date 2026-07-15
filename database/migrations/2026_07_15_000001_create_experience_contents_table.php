<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experience_contents', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 40)->index();
            $table->json('payload');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('experience_responses', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 40)->index();
            $table->json('payload');
            $table->string('ip_hash', 64)->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience_responses');
        Schema::dropIfExists('experience_contents');
    }
};
