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

    public function test_admin_can_upload_and_delete_the_profile_photo(): void
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
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post("/admin/content/{$settings->id}/profile-photo", [
                'photo' => UploadedFile::fake()->image('profile.jpg'),
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $settings->refresh();
        $profileImage = $settings->payload['profile_image_url'];
        $this->assertStringStartsWith('/storage/experience/images/', $profileImage);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $profileImage));

        $this->actingAs($admin)
            ->delete("/admin/content/{$settings->id}/media/profile")
            ->assertRedirect()
            ->assertSessionHas('status', 'Photo de profil supprimée.');

        $settings->refresh();
        $this->assertArrayNotHasKey('profile_image_url', $settings->payload);
        Storage::disk('public')->assertMissing(str_replace('/storage/', '', $profileImage));
    }

    public function test_admin_can_edit_the_letter_and_final_reveal_content(): void
    {
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
                'letter_title' => 'Une lettre rien que pour toi',
                'letter_body' => "Ma vie,\nVoici notre histoire.",
                'letter_signature' => 'Only You.',
                'final_intro_title' => "Notre histoire,\nnotre univers.",
                'final_reveal_lines' => "Premier chapitre.\nEt ce n’est que le début.",
                'final_question' => 'On continue ensemble ?',
                'final_primary_answer' => 'Toujours ❤️',
                'final_secondary_answer' => 'Évidemment ❤️',
                'final_gift_title' => 'Ce monde est à nous.',
                'final_gift_lines' => "Aujourd’hui.\nDemain.\nToujours.",
                'is_active' => true,
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $settings->refresh();

        $this->assertSame('Une lettre rien que pour toi', $settings->payload['letter_title']);
        $this->assertSame('On continue ensemble ?', $settings->payload['final_question']);
        $this->assertSame("Aujourd’hui.\nDemain.\nToujours.", $settings->payload['final_gift_lines']);
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

    public function test_admin_can_add_one_video_memory(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->post('/admin/content', [
                'type' => 'memories',
                'title' => 'Notre instant en mouvement',
                'category' => 'fleuve',
                'behind_story' => 'Un instant que les photos seules ne pouvaient pas raconter.',
                'is_active' => true,
                'video' => UploadedFile::fake()->create('memory.mp4', 2048, 'video/mp4'),
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $memory = ExperienceContent::query()->where('type', 'memories')->firstOrFail();

        $this->assertStringStartsWith('/storage/experience/videos/', $memory->payload['video_url']);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $memory->payload['video_url']));
    }

    public function test_admin_cannot_create_a_second_video_memory(): void
    {
        Storage::fake('public');
        ExperienceContent::query()->create([
            'type' => 'memories',
            'payload' => [
                'title' => 'Première vidéo',
                'category' => 'fleuve',
                'video_url' => '/storage/experience/videos/first.mp4',
            ],
            'display_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs(User::factory()->create())
            ->post('/admin/content', [
                'type' => 'memories',
                'title' => 'Deuxième vidéo',
                'category' => 'sorties',
                'is_active' => true,
                'video' => UploadedFile::fake()->create('second.mp4', 2048, 'video/mp4'),
            ])
            ->assertSessionHasErrors('video');

        $this->assertDatabaseCount('experience_contents', 1);
        Storage::disk('public')->assertMissing('experience/videos/second.mp4');
    }

    public function test_admin_can_delete_a_photo_or_video_without_deleting_the_memory(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('experience/images/memory.webp', 'photo');
        Storage::disk('public')->put('experience/videos/memory.mp4', 'video');
        $memory = ExperienceContent::query()->create([
            'type' => 'memories',
            'payload' => [
                'title' => 'Notre souvenir',
                'category' => 'fleuve',
                'photo_url' => '/storage/experience/images/memory.webp',
                'video_url' => '/storage/experience/videos/memory.mp4',
            ],
            'display_order' => 1,
            'is_active' => true,
        ]);
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->delete("/admin/content/{$memory->id}/media/photo")
            ->assertRedirect()
            ->assertSessionHas('status', 'Photo supprimée.');

        $memory->refresh();
        $this->assertArrayNotHasKey('photo_url', $memory->payload);
        $this->assertArrayHasKey('video_url', $memory->payload);
        Storage::disk('public')->assertMissing('experience/images/memory.webp');

        $this->actingAs($admin)
            ->delete("/admin/content/{$memory->id}/media/video")
            ->assertRedirect()
            ->assertSessionHas('status', 'Vidéo supprimée.');

        $memory->refresh();
        $this->assertArrayNotHasKey('video_url', $memory->payload);
        $this->assertDatabaseHas('experience_contents', ['id' => $memory->id]);
        Storage::disk('public')->assertMissing('experience/videos/memory.mp4');
    }

    public function test_content_management_routes_require_authentication(): void
    {
        $this->post('/admin/content')->assertRedirect('/login');
        $this->post('/admin/content/1/profile-photo')->assertRedirect('/login');
        $this->delete('/admin/content/1/media/photo')->assertRedirect('/login');
        $this->put('/admin/countdown')->assertRedirect('/login');
    }
}
