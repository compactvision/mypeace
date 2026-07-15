import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { experienceApi } from '@/api/experienceApi';
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
import type { CoupleSettings, ExperienceCatalogue } from '@/types/experience';

// No Chill – PARTYNEXTDOOR (YouTube audio-only embed)
const NO_CHILL_YT_ID = 'UhqhRODWPMw';

export default function Experience() {
    const [unlocked, setUnlocked] = useState(false);
    const [introSeen, setIntroSeen] = useState(false);
    const [section, setSection] = useState<string>('hub');
    const [foundKeys, setFoundKeys] = useState<string[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [settings, setSettings] = useState<CoupleSettings | null>(null);
    const [content, setContent] = useState<ExperienceCatalogue>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        experienceApi
            .catalogue()
            .then((catalogue) => {
                setContent(catalogue);
                setSettings(catalogue.settings?.[0] || null);
            })
            .catch(() => setContent({}))
            .finally(() => setLoading(false));
    }, []);

    // Play / pause YouTube iframe based on soundEnabled
    useEffect(() => {
        if (!introSeen) {
            return;
        }

        const iframe = document.getElementById(
            'bg-music-yt',
        ) as HTMLIFrameElement | null;

        if (!iframe) {
            return;
        }

        const msg = soundEnabled
            ? '{"event":"command","func":"playVideo","args":""}'
            : '{"event":"command","func":"pauseVideo","args":""}';
        iframe.contentWindow?.postMessage(msg, '*');
    }, [soundEnabled, introSeen]);

    const toggleSound = () => setSoundEnabled((s) => !s);
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

    if (loading) {
        return (
            <div className="water-bg flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink/30 border-t-pink" />
            </div>
        );
    }

    if (!unlocked) {
        return (
            <LockScreen
                settings={settings}
                onUnlock={() => setUnlocked(true)}
            />
        );
    }

    if (!introSeen) {
        return (
            <CinematicIntro
                onEnter={() => setIntroSeen(true)}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
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
            {/* Hidden YouTube iframe for background music – No Chill · PARTYNEXTDOOR */}
            <iframe
                id="bg-music-yt"
                title="background music"
                style={{
                    position: 'fixed',
                    width: 0,
                    height: 0,
                    border: 'none',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
                src={`https://www.youtube.com/embed/${NO_CHILL_YT_ID}?enablejsapi=1&autoplay=0&loop=1&playlist=${NO_CHILL_YT_ID}&controls=0`}
                allow="autoplay"
            />
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
        </>
    );
}
