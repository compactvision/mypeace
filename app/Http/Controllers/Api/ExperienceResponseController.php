<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFinalAnswerRequest;
use App\Http\Requests\StoreNextDateResponseRequest;
use App\Models\ExperienceResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceResponseController extends Controller
{
    public function storeNextDate(StoreNextDateResponseRequest $request): JsonResponse
    {
        return $this->store($request, 'next_date', $request->validated());
    }

    public function storeFinalAnswer(StoreFinalAnswerRequest $request): JsonResponse
    {
        return $this->store($request, 'final_answer', [
            ...$request->validated(),
            'answered_at' => now()->toIso8601String(),
        ]);
    }

    /** @param array<string, mixed> $payload */
    private function store(Request $request, string $type, array $payload): JsonResponse
    {
        $response = ExperienceResponse::query()->create([
            'type' => $type,
            'payload' => $payload,
            'ip_hash' => $request->ip() ? hash('sha256', $request->ip().config('app.key')) : null,
        ]);

        return response()->json(['data' => ['id' => $response->id]], 201);
    }
}
