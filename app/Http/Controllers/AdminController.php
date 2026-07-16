<?php

namespace App\Http\Controllers;

use App\Models\CountdownConfig;
use App\Models\ExperienceContent;
use App\Models\ExperienceResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __invoke(): Response
    {
        $contentCounts = ExperienceContent::query()
            ->selectRaw('type, count(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type');

        $responseCounts = ExperienceResponse::query()
            ->selectRaw('type, count(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type');

        return Inertia::render('AdminPanel', [
            'stats' => [
                'memories' => (int) ($contentCounts['memories'] ?? 0),
                'loveReasons' => (int) ($contentCounts['love_reasons'] ?? 0),
                'timeline' => (int) ($contentCounts['timeline'] ?? 0),
                'socialPosts' => (int) ($contentCounts['social_posts'] ?? 0),
                'finalAnswers' => (int) ($responseCounts['final_answer'] ?? 0),
                'nextDates' => (int) ($responseCounts['next_date'] ?? 0),
            ],
            'recentAnswers' => $this->responses('final_answer'),
            'recentDates' => $this->responses('next_date'),
            'contents' => ExperienceContent::query()
                ->orderBy('type')
                ->orderBy('display_order')
                ->orderBy('id')
                ->get()
                ->map(fn (ExperienceContent $item): array => [
                    'id' => $item->id,
                    'type' => $item->type,
                    'payload' => $item->payload,
                    'display_order' => $item->display_order,
                    'is_active' => $item->is_active,
                ])
                ->all(),
            'countdown' => $this->countdown(),
        ]);
    }

    /** @return array<string, mixed>|null */
    private function countdown(): ?array
    {
        $countdown = CountdownConfig::query()->first();

        if (! $countdown) {
            return null;
        }

        return [
            ...$countdown->only([
                'timezone', 'title', 'subtitle', 'main_message', 'alt_message',
                'hidden_message', 'end_message', 'signature', 'post_expiration_text',
                'graphics_quality', 'is_countdown_enabled', 'is_3d_scene_enabled',
                'is_sound_enabled', 'manual_unlock',
            ]),
            'target_date' => $countdown->target_date?->format('Y-m-d\TH:i'),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    private function responses(string $type): array
    {
        return ExperienceResponse::query()
            ->where('type', $type)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (ExperienceResponse $response): array => [
                'id' => $response->id,
                'created_at' => $response->created_at?->toIso8601String(),
                ...$response->payload,
            ])->all();
    }
}
