import { useEffect } from 'react';
import { useCountdownStore } from '../../../store/useCountdownStore';

let countdownAudio: HTMLAudioElement | null = null;

function getCountdownAudio(audioUrl: string): HTMLAudioElement {
    if (
        countdownAudio &&
        countdownAudio.src !== new URL(audioUrl, window.location.href).href
    ) {
        countdownAudio.pause();
        countdownAudio = null;
    }

    if (!countdownAudio) {
        countdownAudio = new Audio(audioUrl);
        countdownAudio.loop = true;
        countdownAudio.preload = 'auto';
        countdownAudio.volume = 0.65;
    }

    return countdownAudio;
}

export async function playCountdownMusic(audioUrl: string): Promise<void> {
    await getCountdownAudio(audioUrl).play();
}

export function pauseCountdownMusic(): void {
    countdownAudio?.pause();
}

export function SoundController() {
    const isSoundEnabled = useCountdownStore((state) => state.isSoundEnabled);
    const audioUrl = useCountdownStore((state) => state.config?.audio_url);

    useEffect(() => {
        if (!isSoundEnabled || !audioUrl) {
            pauseCountdownMusic();

            return;
        }

        let isDisposed = false;

        void playCountdownMusic(audioUrl).catch(() => {
            if (!isDisposed) {
                useCountdownStore.getState().setSoundEnabled(false);
            }
        });

        return () => {
            isDisposed = true;
            pauseCountdownMusic();
        };
    }, [audioUrl, isSoundEnabled]);

    return null;
}
