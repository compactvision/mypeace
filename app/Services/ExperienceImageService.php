<?php

namespace App\Services;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExperienceImageService
{
    private const MAX_DIMENSION = 1600;

    public function store(UploadedFile $file): string
    {
        $source = $this->createImage($file);

        if (! $source || ! function_exists('imagewebp')) {
            return '/storage/'.$file->store('experience/images', 'public');
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $scale = min(1, self::MAX_DIMENSION / max($width, $height));
        $targetWidth = max(1, (int) round($width * $scale));
        $targetHeight = max(1, (int) round($height * $scale));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);

        imagealphablending($target, false);
        imagesavealpha($target, true);
        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $width,
            $height,
        );

        $stream = tmpfile();

        if (! $stream || ! imagewebp($target, $stream, 82)) {
            if (is_resource($stream)) {
                fclose($stream);
            }
            imagedestroy($source);
            imagedestroy($target);

            return '/storage/'.$file->store('experience/images', 'public');
        }

        rewind($stream);
        $path = 'experience/images/'.Str::uuid().'.webp';
        Storage::disk('public')->put($path, $stream);
        fclose($stream);
        imagedestroy($source);
        imagedestroy($target);

        return '/storage/'.$path;
    }

    private function createImage(UploadedFile $file): GdImage|false
    {
        return match ($file->getMimeType()) {
            'image/jpeg' => imagecreatefromjpeg($file->getRealPath()),
            'image/png' => imagecreatefrompng($file->getRealPath()),
            'image/webp' => imagecreatefromwebp($file->getRealPath()),
            'image/gif' => imagecreatefromgif($file->getRealPath()),
            default => false,
        };
    }
}
