import { useEffect } from 'react';
import type { ExperienceCatalogue } from '@/types/experience';

function imageUrls(catalogue: ExperienceCatalogue): string[] {
    return [
        ...(catalogue.timeline ?? []),
        ...(catalogue.memories ?? []),
        ...(catalogue.social_posts ?? []),
    ]
        .map((item) => item.photo_url)
        .filter((url): url is string => Boolean(url));
}

export function useExperiencePreload(catalogue: ExperienceCatalogue): void {
    useEffect(() => {
        const urls = [...new Set(imageUrls(catalogue))];
        let cancelled = false;
        let nextIndex = 0;

        const preloadNext = () => {
            if (cancelled || nextIndex >= urls.length) {
return;
}

            const image = new Image();
            image.decoding = 'async';
            image.src = urls[nextIndex++];
            image.onload = preloadNext;
            image.onerror = preloadNext;
        };

        // Keep a little bandwidth free for the interface and soundtrack.
        Array.from({ length: Math.min(3, urls.length) }, preloadNext);

        return () => {
            cancelled = true;
        };
    }, [catalogue]);
}
