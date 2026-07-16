import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import CinematicIntro from '@/components/experience/CinematicIntro';
import FinalReveal from '@/components/experience/FinalReveal';
import FiveMonthsTimeline from '@/components/experience/FiveMonthsTimeline';
import InteractiveLetter from '@/components/experience/InteractiveLetter';
import LockScreen from '@/components/experience/LockScreen';
import LoveReasons from '@/components/experience/LoveReasons';
import MemoriesGallery from '@/components/experience/MemoriesGallery';
import MyPeaceHub from '@/components/experience/MyPeaceHub';
import PrivateKitchen from '@/components/experience/PrivateKitchen';
import RnbPlaylist from '@/components/experience/RnbPlaylist';
import SocialFeed from '@/components/experience/SocialFeed';
import SurpriseWheel from '@/components/experience/SurpriseWheel';
import { useExperiencePreload } from '@/hooks/useExperiencePreload';
import type { CoupleSettings, ExperienceCatalogue } from '@/types/experience';

function createFallbackAmbience(): () => void {
    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const oscillators = [110, 164.81, 220].map((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.028 : 0.012;
        oscillator.connect(gain);
        gain.connect(filter);
        oscillator.start();

        return oscillator;
    });

    filter.type = 'lowpass';
    filter.frequency.value = 720;
    master.gain.value = 0.7;
    filter.connect(master);
    master.connect(context.destination);
    void context.resume();

    return () => {
        oscillators.forEach((oscillator) => oscillator.stop());
        void context.close();
    };
}

type Props = {
    catalogue: ExperienceCatalogue;
};

export default function Experience({ catalogue }: Props) {
    const [unlocked, setUnlocked] = useState(false);
    const [introSeen, setIntroSeen] = useState(false);
    const [section, setSection] = useState<string>('hub');
    const [foundKeys, setFoundKeys] = useState<string[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const settings: CoupleSettings | null = catalogue.settings?.[0] || null;
    const content = catalogue;
    const audioRef = useRef<HTMLAudioElement>(null);
    const stopFallbackRef = useRef<(() => void) | null>(null);

    useExperiencePreload(catalogue);

    useEffect(() => {
        return () => stopFallbackRef.current?.();
    }, []);

    const toggleSound = useCallback(() => {
        if (soundEnabled) {
            audioRef.current?.pause();
            stopFallbackRef.current?.();
            stopFallbackRef.current = null;
            setSoundEnabled(false);

            return;
        }

        const audio = audioRef.current;

        if (audio?.src) {
            void audio
                .play()
                .then(() => setSoundEnabled(true))
                .catch(() => {
                    stopFallbackRef.current = createFallbackAmbience();
                    setSoundEnabled(true);
                });

            return;
        }

        stopFallbackRef.current = createFallbackAmbience();
        setSoundEnabled(true);
    }, [soundEnabled]);
    const addKey = (key: string) =>
        setFoundKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    const goBack = () => setSection('hub');

    const sharedProps = {
        onBack: goBack,
        onNavigate: setSection,
        foundKeys,
        addKey,
        soundEnabled,
        onToggleSound: toggleSound,
        settings,
        content,
    };

    if (!unlocked) {
        return (
            <LockScreen
                settings={settings}
                onUnlock={() => setUnlocked(true)}
            />
        );
    }

    const sections: Record<string, ReactNode> = {
        hub: <MyPeaceHub {...sharedProps} />,
        timeline: <FiveMonthsTimeline {...sharedProps} />,
        social: <SocialFeed {...sharedProps} />,
        kitchen: <PrivateKitchen {...sharedProps} />,
        reasons: <LoveReasons {...sharedProps} />,
        letter: <InteractiveLetter {...sharedProps} />,
        reveal: <FinalReveal {...sharedProps} />,
        gallery: <MemoriesGallery {...sharedProps} />,
        playlist: <RnbPlaylist {...sharedProps} />,
        wheel: <SurpriseWheel {...sharedProps} />,
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={settings?.background_audio_url || undefined}
                preload="metadata"
                loop
                playsInline
            />
            {!introSeen ? (
                <CinematicIntro
                    onEnter={() => setIntroSeen(true)}
                    soundEnabled={soundEnabled}
                    onToggleSound={toggleSound}
                    settings={settings}
                />
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={section}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {sections[section] || sections.hub}
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    );
}
