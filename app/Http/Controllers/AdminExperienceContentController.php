<?php

namespace App\Http\Controllers;

use App\Models\CountdownConfig;
use App\Models\ExperienceContent;
use App\Services\ExperienceImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminExperienceContentController extends Controller
{
    /** @var list<string> */
    private const TYPES = ['settings', 'memories', 'love_reasons', 'timeline', 'social_posts', 'playlist'];

    public function store(
        Request $request,
        ExperienceImageService $images,
        ?ExperienceContent $content = null,
    ): RedirectResponse {
        $base = $request->validate([
            'type' => ['required', Rule::in(self::TYPES)],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'photo' => ['nullable', 'image', 'max:10240'],
            'audio' => ['nullable', 'file', 'mimetypes:audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,audio/mp4,audio/x-m4a', 'max:12288'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:40960'],
            'remove_video' => ['nullable', 'boolean'],
        ], [
            'audio.max' => 'La musique ne doit pas dépasser 12 Mo.',
            'audio.mimetypes' => 'Le fichier doit être une musique MP3, WAV, M4A ou OGG.',
            'audio.uploaded' => "La musique n'a pas pu être importée. Vérifiez que sa taille ne dépasse pas 12 Mo.",
            'video.max' => 'La vidéo ne doit pas dépasser 40 Mo.',
            'video.mimetypes' => 'La vidéo doit être au format MP4, WebM ou MOV.',
            'video.uploaded' => "La vidéo n'a pas pu être importée. Vérifiez que sa taille ne dépasse pas 40 Mo.",
        ]);

        $type = $base['type'];
        abort_if($content && $content->type !== $type, 422, 'Le type de contenu ne peut pas être modifié.');

        if (! $content && $type === 'settings') {
            $content = ExperienceContent::query()->where('type', 'settings')->first();
        }

        $payload = [
            ...($content?->payload ?? []),
            ...$request->validate($this->rulesFor($type)),
        ];

        if ($request->hasFile('photo')) {
            $this->deleteManagedFile($payload['photo_url'] ?? null);
            $payload['photo_url'] = $images->store($request->file('photo'));
        }

        if ($request->hasFile('audio')) {
            $this->deleteManagedFile($payload['background_audio_url'] ?? null);
            $payload['background_audio_url'] = '/storage/'.$request->file('audio')->store('experience/audio', 'public');
        }

        if ($request->boolean('remove_video')) {
            $this->deleteManagedFile($payload['video_url'] ?? null);
            unset($payload['video_url']);
        }

        if ($request->hasFile('video')) {
            $anotherVideoExists = ExperienceContent::query()
                ->where('type', 'memories')
                ->when($content, fn ($query) => $query->whereKeyNot($content->getKey()))
                ->get()
                ->contains(fn (ExperienceContent $memory): bool => filled($memory->payload['video_url'] ?? null));

            if ($anotherVideoExists) {
                throw ValidationException::withMessages([
                    'video' => "Un souvenir vidéo existe déjà. Retirez d'abord sa vidéo pour utiliser cet emplacement ailleurs.",
                ]);
            }

            $this->deleteManagedFile($payload['video_url'] ?? null);
            $payload['video_url'] = '/storage/'.$request->file('video')->store('experience/videos', 'public');
        }

        $payload = collect($payload)
            ->reject(fn (mixed $value): bool => $value === null || $value === '')
            ->all();

        $order = (int) ($base['display_order'] ?? 0);
        if (! $content && $order === 0) {
            $order = ((int) ExperienceContent::query()->where('type', $type)->max('display_order')) + 1;
        }

        ExperienceContent::query()->updateOrCreate(
            ['id' => $content?->id],
            [
                'type' => $type,
                'payload' => $payload,
                'display_order' => $order,
                'is_active' => $request->boolean('is_active', true),
            ],
        );

        return back()->with('status', 'Contenu enregistré.');
    }

    public function destroy(ExperienceContent $content): RedirectResponse
    {
        $this->deleteManagedFile($content->payload['photo_url'] ?? null);
        $this->deleteManagedFile($content->payload['background_audio_url'] ?? null);
        $this->deleteManagedFile($content->payload['video_url'] ?? null);
        $content->delete();

        return back()->with('status', 'Contenu supprimé.');
    }

    public function updateCountdown(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'target_date' => ['required', 'date'],
            'timezone' => ['required', 'string', 'max:80'],
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'main_message' => ['nullable', 'string', 'max:500'],
            'alt_message' => ['nullable', 'string', 'max:500'],
            'hidden_message' => ['nullable', 'string', 'max:500'],
            'end_message' => ['nullable', 'string', 'max:500'],
            'signature' => ['nullable', 'string', 'max:255'],
            'post_expiration_text' => ['nullable', 'string', 'max:500'],
            'graphics_quality' => ['required', Rule::in(['low', 'medium', 'high'])],
            'is_countdown_enabled' => ['nullable', 'boolean'],
            'is_3d_scene_enabled' => ['nullable', 'boolean'],
            'is_sound_enabled' => ['nullable', 'boolean'],
            'manual_unlock' => ['nullable', 'boolean'],
        ]);

        foreach (['is_countdown_enabled', 'is_3d_scene_enabled', 'is_sound_enabled', 'manual_unlock'] as $field) {
            $validated[$field] = $request->boolean($field);
        }

        CountdownConfig::query()->updateOrCreate(['id' => CountdownConfig::query()->value('id')], $validated);
        Cache::forget('countdown_config_public');

        return back()->with('status', 'Compte à rebours mis à jour.');
    }

    /** @return array<string, list<string>> */
    private function rulesFor(string $type): array
    {
        return match ($type) {
            'settings' => [
                'partner_two_name' => ['required', 'string', 'max:120'],
                'influencer_name' => ['nullable', 'string', 'max:120'],
                'primary_message' => ['nullable', 'string', 'max:500'],
                'access_code' => ['required', 'digits:4'],
                'lock_title' => ['nullable', 'string', 'max:255'],
                'lock_byline' => ['nullable', 'string', 'max:255'],
                'special_date' => ['nullable', 'date'],
                'intro_title' => ['nullable', 'string', 'max:255'],
                'intro_subtitle' => ['nullable', 'string', 'max:255'],
                'intro_lines' => ['nullable', 'string', 'max:3000'],
                'background_audio_url' => ['nullable', 'string', 'max:2000'],
                'timeline_title' => ['nullable', 'string', 'max:255'],
                'timeline_subtitle' => ['nullable', 'string', 'max:255'],
                'reasons_title' => ['nullable', 'string', 'max:255'],
                'reasons_subtitle' => ['nullable', 'string', 'max:255'],
                'gallery_title' => ['nullable', 'string', 'max:255'],
                'gallery_subtitle' => ['nullable', 'string', 'max:255'],
                'social_title' => ['nullable', 'string', 'max:255'],
                'social_subtitle' => ['nullable', 'string', 'max:255'],
                'playlist_title' => ['nullable', 'string', 'max:255'],
                'playlist_subtitle' => ['nullable', 'string', 'max:255'],
            ],
            'memories' => [
                'title' => ['required', 'string', 'max:255'],
                'category' => ['required', 'string', 'max:80'],
                'memory_date' => ['nullable', 'date'],
                'location' => ['nullable', 'string', 'max:255'],
                'photo_url' => ['nullable', 'string', 'max:2000'],
                'video_url' => ['nullable', 'string', 'max:2000'],
                'behind_story' => ['nullable', 'string', 'max:3000'],
            ],
            'love_reasons' => ['content' => ['required', 'string', 'max:1000']],
            'timeline' => [
                'chapter' => ['required', 'integer', 'min:1', 'max:999'],
                'month_label' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'content' => ['required', 'string', 'max:5000'],
                'event_date' => ['nullable', 'date'],
                'quote' => ['nullable', 'string', 'max:2000'],
                'photo_url' => ['nullable', 'string', 'max:2000'],
            ],
            'social_posts' => [
                'caption' => ['required', 'string', 'max:2000'],
                'post_date' => ['nullable', 'date'],
                'category' => ['required', 'string', 'max:80'],
                'photo_url' => ['nullable', 'string', 'max:2000'],
                'jean_michel_thought' => ['nullable', 'string', 'max:3000'],
            ],
            'playlist' => [
                'title' => ['required', 'string', 'max:255'],
                'artist' => ['required', 'string', 'max:255'],
                'desc' => ['nullable', 'string', 'max:1000'],
                'external_url' => ['nullable', 'url:http,https', 'max:2000'],
                'featured' => ['nullable', 'boolean'],
            ],
        };
    }

    private function deleteManagedFile(?string $url): void
    {
        if ($url && str_starts_with($url, '/storage/experience/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $url));
        }
    }
}
