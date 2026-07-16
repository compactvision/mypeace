import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift } from 'lucide-react';
import React, { useState } from 'react';
import { experienceApi } from '@/api/experienceApi';
import type { SectionProps } from '@/types/experience';

const REVEAL_LINES = [
    'Cinq mois, ce n’est peut-être que le début.',
    'Mais c’est déjà assez pour savoir que chaque moment avec toi mérite d’être conservé.',
    'Tu me surprends encore.',
    'Tu m’apportes de la paix.',
    'Et chaque fois que je te vois, je tombe encore plus amoureux de toi.',
    'Je t’aime, Cassy.',
    'Et je serai toujours là pour toi.',
];

type Phase = 'intro' | 'lines' | 'question' | 'answered' | 'gift';

function configuredLines(value: string | undefined, fallback: string[]) {
    const lines = value
        ?.split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    return lines?.length ? lines : fallback;
}

export default function FinalReveal({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const settings = content?.settings?.[0];
    const [phase, setPhase] = useState<Phase>('intro');
    const [lineIndex, setLineIndex] = useState(0);
    const [answer, setAnswer] = useState<string | null>(null);
    const revealLines = configuredLines(
        settings?.final_reveal_lines,
        REVEAL_LINES,
    );
    const giftLines = configuredLines(settings?.final_gift_lines, [
        'Cinq mois avec My Peace.',
        'Et je choisirais encore Only You.',
    ]);
    const primaryAnswer = settings?.final_primary_answer || 'Si si, ma vie ❤️';
    const secondaryAnswer =
        settings?.final_secondary_answer || 'Oui, mais tu me dois un burger 🍔';

    const startReveal = () => setPhase('lines');

    const nextLine = () => {
        if (lineIndex < revealLines.length - 1) {
            setLineIndex(lineIndex + 1);
        } else {
            setPhase('question');
        }
    };

    const handleAnswer = async (choice: string) => {
        setAnswer(choice);
        setPhase('answered');

        try {
            await experienceApi.saveFinalAnswer(choice);
        } catch {
            /* Silent */
        }

        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#EC4899', '#F4C2D7', '#D4AF37', '#B8C0CC'],
            });
        }, 200);
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#EC4899', '#F4C2D7'],
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#EC4899', '#F4C2D7'],
            });
        }, 500);
        setTimeout(() => setPhase('gift'), 2500);
    };

    return (
        <div className="night-black grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="blur-4xl animate-float absolute top-1/4 left-1/4 h-48 w-48 rounded-full bg-pink/8" />
                <div
                    className="blur-4xl animate-float absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-indigo-500/8"
                    style={{ animationDelay: '2s' }}
                />
            </div>

            {/* Sound toggle */}
            {onToggleSound && (
                <button
                    onClick={onToggleSound}
                    className="touch-target glass fixed top-5 right-5 z-40 flex items-center justify-center rounded-full text-silver transition-colors hover:text-powder"
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </button>
            )}
            {onBack && phase === 'gift' && (
                <button
                    onClick={onBack}
                    className="touch-target glass fixed top-5 left-5 z-40 flex items-center justify-center rounded-full px-3 text-xs text-silver transition-colors hover:text-powder"
                >
                    ← Hub
                </button>
            )}

            <div className="relative z-10 w-full max-w-md text-center">
                {/* Intro */}
                {phase === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mb-6"
                        >
                            <Heart className="glow-pink mx-auto h-12 w-12 fill-pink text-pink" />
                        </motion.div>
                        <h1 className="text-gradient-pink mb-6 font-heading text-2xl whitespace-pre-line">
                            {settings?.final_intro_title ||
                                'Happy five months,\nMy Peace.'}
                        </h1>
                        <p className="mb-8 text-sm text-silver/50">
                            {settings?.final_intro_subtitle || 'From Only You.'}
                        </p>
                        <button
                            onClick={startReveal}
                            className="glass-pink glow-pink rounded-full px-6 py-3 text-sm text-powder transition-all hover:bg-pink/15 active:scale-95"
                        >
                            {settings?.final_continue_label || 'Continuer'}
                        </button>
                    </motion.div>
                )}

                {/* Reveal lines */}
                {phase === 'lines' && (
                    <div
                        onClick={nextLine}
                        className="flex min-h-[200px] cursor-pointer items-center justify-center"
                    >
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={lineIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8 }}
                                className={`font-heading text-lg leading-relaxed italic ${
                                    lineIndex >= 4
                                        ? 'text-gradient-pink'
                                        : 'text-cream/90'
                                }`}
                            >
                                {revealLines[lineIndex]}
                            </motion.p>
                        </AnimatePresence>
                        <motion.p
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute bottom-8 text-xs text-silver/30"
                        >
                            {settings?.final_tap_hint ||
                                'Touche pour continuer'}
                        </motion.p>
                    </div>
                )}

                {/* Question */}
                {phase === 'question' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="mb-8 font-heading text-xl leading-relaxed text-cream">
                            {settings?.final_question ||
                                'Veux-tu continuer à écrire les prochains chapitres avec moi ?'}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleAnswer(primaryAnswer)}
                                className="glow-pink w-full rounded-2xl bg-gradient-to-r from-pink to-pink-vibrant py-4 font-body text-sm text-white transition-all active:scale-95"
                            >
                                {primaryAnswer}
                            </button>
                            <button
                                onClick={() => handleAnswer(secondaryAnswer)}
                                className="glass w-full rounded-2xl py-4 font-body text-sm text-powder transition-all hover:bg-pink/10 active:scale-95"
                            >
                                {secondaryAnswer}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Answered */}
                {phase === 'answered' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: 2 }}
                        >
                            <Heart className="glow-pink mx-auto h-16 w-16 fill-pink text-pink" />
                        </motion.div>
                        <p className="mt-4 font-handwriting text-2xl text-powder">
                            {answer}
                        </p>
                    </motion.div>
                )}

                {/* Gift reveal */}
                {phase === 'gift' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Gift className="mx-auto mb-4 h-12 w-12 text-gold" />
                        <h2 className="text-gradient-gold mb-3 font-heading text-2xl">
                            {settings?.final_gift_title ||
                                'Ton cadeau, c’est cet univers.'}
                        </h2>
                        <p className="mb-6 text-sm leading-relaxed text-cream/70">
                            {settings?.final_gift_message ||
                                'Un endroit créé pour toi, pour nous, et pour les souvenirs que je ne veux jamais perdre.'}
                        </p>
                        <div className="glass-pink rounded-2xl p-5">
                            {giftLines.map((line) => (
                                <p
                                    key={line}
                                    className="font-handwriting text-xl leading-snug text-powder"
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
