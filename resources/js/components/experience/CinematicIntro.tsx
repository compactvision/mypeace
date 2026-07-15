import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Headphones } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const LINES = [
    { text: 'Certaines histoires commencent avec un message.', delay: 0.8 },
    { text: 'La nôtre a commencé au bord du fleuve.', delay: 3.2 },
    {
        text: 'Le 21 février 2026, quelque chose de nouveau a commencé.',
        delay: 5.6,
    },
    { text: 'Cinq mois plus tard…', delay: 8.0 },
];

type Props = {
    onEnter: () => void;
    soundEnabled: boolean;
    onToggleSound: () => void;
};

export default function CinematicIntro({
    onEnter,
    soundEnabled,
    onToggleSound,
}: Props) {
    const [step, setStep] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (step < LINES.length) {
            const t = setTimeout(
                () => setStep(step + 1),
                LINES[step].delay - (step > 0 ? LINES[step - 1].delay : 0),
            );

            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => setShowButton(true), 800);

            return () => clearTimeout(t);
        }
    }, [step]);

    const handleEnter = () => {
        setTransitioning(true);
        setTimeout(() => onEnter(), 1200);
    };

    return (
        <div className="night-deep grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            {/* Water light effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-float absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-pink/5 blur-3xl" />
                <div
                    className="animate-float absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-indigo-500/5 blur-3xl"
                    style={{ animationDelay: '2s' }}
                />
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border border-pink/5"
                        style={{
                            width: '300px',
                            height: '300px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: `ripple 5s ease-out ${i * 1.5}s infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Transition wave */}
            <AnimatePresence>
                {transitioning && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 40 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className="fixed top-1/2 left-1/2 z-50 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink/80 to-pink-vibrant/80"
                    />
                )}
            </AnimatePresence>

            {/* Sound toggle */}
            <button
                onClick={onToggleSound}
                className="touch-target glass fixed top-5 right-5 z-40 flex items-center justify-center rounded-full text-silver transition-colors hover:text-powder"
                aria-label="Son"
            >
                {soundEnabled ? (
                    <Volume2 className="h-5 w-5" />
                ) : (
                    <VolumeX className="h-5 w-5" />
                )}
            </button>

            <div className="relative z-10 w-full max-w-lg text-center">
                <AnimatePresence mode="wait">
                    {step < LINES.length ? (
                        <motion.p
                            key={step}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 1 }}
                            className="font-heading text-lg leading-relaxed text-cream/90 italic md:text-xl"
                        >
                            {LINES[step].text}
                        </motion.p>
                    ) : null}
                </AnimatePresence>

                {/* Title reveal */}
                <AnimatePresence>
                    {step >= LINES.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2 }}
                            className="space-y-2"
                        >
                            <h1 className="text-gradient-pink font-heading text-4xl tracking-wide md:text-5xl">
                                ONLY YOU × MY PEACE
                            </h1>
                            <p className="text-sm tracking-[0.4em] text-silver uppercase">
                                Chapter Five
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enter button */}
                <AnimatePresence>
                    {showButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="mt-12 space-y-4"
                        >
                            <button
                                onClick={handleEnter}
                                className="glass-pink glow-pink rounded-full px-8 py-4 font-body text-sm tracking-wide text-powder transition-all hover:bg-pink/15 active:scale-95"
                            >
                                Entrer dans notre univers
                            </button>
                            <div className="flex items-center justify-center gap-2 text-xs text-silver/40">
                                <Headphones className="h-3.5 w-3.5" />
                                <span>
                                    Pour une meilleure expérience, utilise tes
                                    écouteurs.
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
