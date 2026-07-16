import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps } from '@/types/experience';

const FALLBACK_REASONS = [
    'Tes beaux yeux',
    'Ta manière de toujours me surprendre',
    'Ta créativité',
    'Ton ambition',
    'Ton énergie',
    'Ta personnalité',
    'Ta façon de rendre les moments simples intéressants',
    'Ton style',
    'Ton sourire',
    'Ta présence',
    'La paix que tu m’apportes',
    'La manière dont je retombe amoureux chaque fois que je te vois',
    'Tes petites habitudes',
    'Ta passion pour ce que tu fais',
    'La femme que tu es',
];

export default function LoveReasons({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const reasons = content?.love_reasons?.length
        ? content.love_reasons.map((reason) => reason.content)
        : FALLBACK_REASONS;
    const settings = content?.settings?.[0];
    const [current, setCurrent] = useState<{
        text: string;
        index: number;
    } | null>(() => ({ text: reasons[0], index: 0 }));
    const [revealed, setRevealed] = useState<number[]>([]);

    const pickRandom = useCallback(
        (pool: string[], alreadyRevealed: number[]) => {
            const remaining = pool.filter(
                (_, i) => !alreadyRevealed.includes(i),
            );

            if (remaining.length === 0) {
                setRevealed([]);
                const idx = Math.floor(Math.random() * pool.length);
                setCurrent({ text: pool[idx], index: idx });

                return;
            }

            const pick =
                remaining[Math.floor(Math.random() * remaining.length)];
            const originalIdx = pool.indexOf(pick);
            setCurrent({ text: pick, index: originalIdx });
        },
        [],
    );

    const handleNext = () => {
        const newRevealed = current ? [...revealed, current.index] : revealed;
        setRevealed(newRevealed);
        pickRandom(reasons, newRevealed);
    };

    // Generate star positions
    const stars = Array.from(
        { length: Math.min(reasons.length, 15) },
        (_, i) => ({
            id: i,
            top: 15 + Math.sin(i * 1.5) * 30 + 30,
            left: 10 + Math.cos(i * 2.1) * 35 + 40,
            delay: i * 0.1,
        }),
    );

    return (
        <SectionLayout
            title={settings?.reasons_title || 'Why I Love You'}
            subtitle={
                settings?.reasons_subtitle || 'Chaque étoile cache une raison'
            }
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            {/* Constellation */}
            <div className="relative mb-6 h-72">
                {stars.map((s) => (
                    <motion.button
                        key={s.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: s.delay, duration: 0.5 }}
                        onClick={() =>
                            reasons &&
                            setCurrent({ text: reasons[s.id], index: s.id })
                        }
                        className="absolute"
                        style={{ top: `${s.top}%`, left: `${s.left}%` }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2 + s.id * 0.2,
                                repeat: Infinity,
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-pink/60" />
                        </motion.div>
                    </motion.button>
                ))}

                {/* Current reason card */}
                <AnimatePresence mode="wait">
                    {current && (
                        <motion.div
                            key={current.index}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="glass-pink glow-pink max-w-xs rounded-3xl p-6 text-center">
                                <Heart className="mx-auto mb-3 h-6 w-6 fill-pink text-pink" />
                                <p className="font-handwriting text-xl leading-snug text-powder">
                                    {current.text}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Next button */}
            <button
                onClick={handleNext}
                disabled={!reasons}
                className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-body text-sm text-powder transition-all hover:bg-pink/10 active:scale-95 disabled:opacity-40"
            >
                <RefreshCw className="h-4 w-4" />
                Donne-moi une autre raison
            </button>

            <p className="mt-3 text-center text-xs text-silver/30">
                {revealed.length} raison{revealed.length > 1 ? 's' : ''}{' '}
                découverte{revealed.length > 1 ? 's' : ''}
            </p>
        </SectionLayout>
    );
}
