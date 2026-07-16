import { ImageOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
    src: string;
    alt: string;
    className?: string;
    eager?: boolean;
};

export default function ExperienceImage({
    src,
    alt,
    className = '',
    eager = false,
}: Props) {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="flex min-h-36 w-full flex-col items-center justify-center gap-2 bg-night-deep/70 text-silver/30">
                <ImageOff className="h-5 w-5" />
                <span className="text-[11px]">Souvenir indisponible</span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-night-deep/70">
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-pink/10 via-night-deep to-powder/5" />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                loading={eager ? 'eager' : 'lazy'}
                fetchPriority={eager ? 'high' : 'auto'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
            />
        </div>
    );
}
