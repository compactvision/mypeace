<?php

namespace App\Http\Controllers;

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
        ]);
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
