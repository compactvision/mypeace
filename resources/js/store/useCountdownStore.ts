import { create } from 'zustand';

export interface CountdownConfig {
    target_date: string;
    timezone: string;
    title: string;
    subtitle: string;
    main_message: string;
    alt_message: string;
    hidden_message: string;
    end_message: string;
    signature: string;
    audio_url: string | null;
    is_countdown_enabled: boolean;
    is_3d_scene_enabled: boolean;
    is_sound_enabled: boolean;
    graphics_quality: 'low' | 'medium' | 'high';
    manual_unlock: boolean;
    post_expiration_text: string;
}

interface CountdownState {
    config: CountdownConfig | null;
    serverTimeOffset: number; // offset in ms (server_time - local_time)
    isSoundEnabled: boolean;
    isExploreMode: boolean;
    isRevealed: boolean;
    reducedMotion: boolean;
    quality: 'low' | 'medium' | 'high';
    setConfig: (config: CountdownConfig, serverTimeStr: string) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setExploreMode: (enabled: boolean) => void;
    revealChapterFive: () => void;
    setReducedMotion: (enabled: boolean) => void;
    setQuality: (quality: 'low' | 'medium' | 'high') => void;
}

export const useCountdownStore = create<CountdownState>((set) => ({
    config: null,
    serverTimeOffset: 0,
    isSoundEnabled: false,
    isExploreMode: false,
    isRevealed: false,
    reducedMotion: false, // Initially false, can be overridden by system preference
    quality: 'high',
    setConfig: (config, serverTimeStr) => {
        const serverTime = new Date(serverTimeStr).getTime();
        const localTime = Date.now();
        set({
            config,
            serverTimeOffset: serverTime - localTime,
            quality: config.graphics_quality,
        });
    },
    setSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
    setExploreMode: (enabled) => set({ isExploreMode: enabled }),
    revealChapterFive: () => set({ isRevealed: true }),
    setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
    setQuality: (quality) => set({ quality }),
}));
