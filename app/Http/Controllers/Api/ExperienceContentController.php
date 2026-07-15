<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExperienceContentService;
use Illuminate\Http\JsonResponse;

class ExperienceContentController extends Controller
{
    public function index(ExperienceContentService $content): JsonResponse
    {
        return response()->json(['data' => $content->catalogue()]);
    }
}
