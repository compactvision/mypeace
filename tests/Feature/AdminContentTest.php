<?php

namespace Tests\Feature;

use App\Models\ExperienceContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_timeline_entry_with_an_uploaded_photo(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->post('/admin/content', [
                'type' => 'timeline',
                'chapter' => 6,
                'month_label' => 'Août',
                'title' => 'A new chapter',
                'content' => 'Notre prochain souvenir.',
                'event_date' => '2026-08-21',
                'quote' => 'Toujours nous.',
                'display_order' => 6,
                'is_active' => true,
                'photo' => UploadedFile::fake()->image('chapter.jpg'),
            ])
            ->assertRedirect();

        $entry = ExperienceContent::query()->where('type', 'timeline')->firstOrFail();

        $this->assertSame('A new chapter', $entry->payload['title']);
        $this->assertStringStartsWith('/storage/experience/images/', $entry->payload['photo_url']);
        $this->assertStringEndsWith('.webp', $entry->payload['photo_url']);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $entry->payload['photo_url']));
    }

    public function test_admin_can_update_settings_with_a_music_file(): void
    {
        Storage::fake('public');
        $settings = ExperienceContent::query()->create([
            'type' => 'settings',
            'payload' => [
                'partner_two_name' => 'Cassy',
                'access_code' => '2102',
            ],
            'display_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs(User::factory()->create())
            ->post("/admin/content/{$settings->id}", [
                'type' => 'settings',
                'partner_two_name' => 'Cassy',
                'access_code' => '2102',
                'is_active' => true,
                'audio' => UploadedFile::fake()->create('our-song.mp3', 800, 'audio/mpeg'),
            ])
            ->assertRedirect();

        $settings->refresh();
        $this->assertStringStartsWith('/storage/experience/audio/', $settings->payload['background_audio_url']);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $settings->payload['background_audio_url']));
    }

    public function test_admin_cannot_upload_music_larger_than_twelve_megabytes(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->post('/admin/content', [
                'type' => 'settings',
                'partner_two_name' => 'Cassy',
                'access_code' => '2102',
                'is_active' => true,
                'audio' => UploadedFile::fake()->create('too-large.mp3', 12289, 'audio/mpeg'),
            ])
            ->assertSessionHasErrors('audio');

        Storage::disk('public')->assertDirectoryEmpty('experience/audio');
    }

    public function test_content_management_routes_require_authentication(): void
    {
        $this->post('/admin/content')->assertRedirect('/login');
        $this->put('/admin/countdown')->assertRedirect('/login');
    }
}
