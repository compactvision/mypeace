<?php

namespace Tests\Feature;

use App\Models\ExperienceResponse;
use App\Models\User;
use Database\Seeders\ExperienceContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExperienceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalogue_is_served_from_the_local_database(): void
    {
        $this->seed(ExperienceContentSeeder::class);

        $this->getJson('/api/experience/content')
            ->assertOk()
            ->assertJsonCount(1, 'data.settings')
            ->assertJsonCount(5, 'data.timeline')
            ->assertJsonCount(15, 'data.love_reasons');
    }

    public function test_next_date_choices_are_validated_and_persisted(): void
    {
        $payload = [
            'food' => 'Carbonara',
            'drink' => 'Ceres Tropical',
            'location_type' => 'À la maison',
            'atmosphere' => 'Ambiance calme',
            'music_choice' => 'R&B',
            'dessert_choice' => 'Dessert',
        ];

        $this->postJson('/api/experience/responses/next-date', $payload)
            ->assertCreated()
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('experience_responses', ['type' => 'next_date']);
        $this->assertSame($payload, ExperienceResponse::query()->firstOrFail()->payload);
    }

    public function test_invalid_response_is_rejected(): void
    {
        $this->postJson('/api/experience/responses/final-answer', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('answer');
    }

    public function test_admin_page_requires_a_laravel_session(): void
    {
        $this->get('/admin')->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get('/admin')->assertOk();
    }
}
