<?php

namespace App\Services;

use App\Models\ExperienceContent;
use Illuminate\Support\Collection;

class ExperienceContentService
{
    /** @var list<string> */
    public const TYPES = ['settings', 'memories', 'love_reasons', 'timeline', 'social_posts'];

    /** @return array<string, array<int, array<string, mixed>>> */
    public function catalogue(): array
    {
        return ExperienceContent::query()
            ->where('is_active', true)
            ->whereIn('type', self::TYPES)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->groupBy('type')
            ->map(fn (Collection $items): array => $items
                ->map(fn (ExperienceContent $item): array => [
                    'id' => $item->id,
                    ...$item->payload,
                ])->values()->all())
            ->all();
    }
}
