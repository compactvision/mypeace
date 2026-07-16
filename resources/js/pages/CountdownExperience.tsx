import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ChapterFiveReveal } from '../components/countdown/ui/ChapterFiveReveal';
import { CountdownOverlay } from '../components/countdown/ui/CountdownOverlay';
import { ReducedMotionCountdown } from '../components/countdown/ui/ReducedMotionCountdown';
import { SoundController } from '../components/countdown/ui/SoundController';
import { useCountdown } from '../hooks/useCountdown';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { useCountdownStore } from '../store/useCountdownStore';

const CountdownCanvas = lazy(() =>
    import('../components/countdown/3d/CountdownCanvas').then((module) => ({
        default: module.CountdownCanvas,
    })),
);

export default function CountdownExperiencePage() {
    const { config, setConfig } = useCountdownStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const { isCompleted } = useCountdown();

    // Initialize performance detection
    useDevicePerformance();

    useEffect(() => {
        let isMounted = true;

        const loadConfig = () => {
            fetch('/api/countdown/config')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Countdown configuration unavailable');
                    }

                    return response.json();
                })
                .then((data) => {
                    if (!isMounted) {
return;
}

                    if (data.config) {
                        const targetReached =
                            new Date(data.config.target_date).getTime() <=
                            new Date(data.server_time).getTime();

                        if (
                            !data.config.is_countdown_enabled ||
                            data.config.manual_unlock ||
                            targetReached
                        ) {
                            window.location.replace('/');

                            return;
                        }

                        setConfig(data.config, data.server_time);
                        setIsLoading(false);
                    } else {
                        setError(true);
                    }
                })
                .catch((err) => {
                    if (!isMounted) {
return;
}

                    console.error('Failed to load countdown config', err);
                    setError(true);
                    setIsLoading(false);
                });
        };

        loadConfig();
        const refreshTimer = window.setInterval(loadConfig, 15_000);

        return () => {
            isMounted = false;
            window.clearInterval(refreshTimer);
        };
    }, [setConfig]);

    useEffect(() => {
        if (config && isCompleted) {
            window.location.replace('/');
        }
    }, [config, isCompleted]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030308]">
                <p className="text-white">Chapter Five will arrive soon.</p>
            </div>
        );
    }

    return (
        <>
            <Head title={config?.title || 'Chapter Five'} />

            <main className="relative h-screen w-full overflow-hidden bg-[#030308] select-none">
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-[#030308]"
                        >
                            <p className="animate-pulse text-sm tracking-widest text-white/60 uppercase">
                                Preparing Chapter Five...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isLoading && (
                    <>
                        <Suspense
                            fallback={
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(126,179,255,0.1),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(255,126,179,0.09),transparent_40%)]" />
                            }
                        >
                            <CountdownCanvas />
                        </Suspense>
                        <ReducedMotionCountdown />
                        <CountdownOverlay />
                        <ChapterFiveReveal />
                        <SoundController />
                    </>
                )}
            </main>
        </>
    );
}
