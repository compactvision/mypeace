import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps } from '@/types/experience';

const OPTIONS = [
    {
        label: 'Tu choisis notre prochain restaurant.',
        color: 'from-pink to-pink-vibrant',
    },
    {
        label: 'Only You te doit un burger.',
        color: 'from-amber-500 to-orange-600',
    },
    {
        label: 'Une carbonara spéciale My Peace.',
        color: 'from-rose-400 to-pink-500',
    },
    {
        label: 'Tu viens de gagner une soirée R&B.',
        color: 'from-indigo-500 to-purple-600',
    },
    {
        label: 'Regarde dans la galerie, un nouveau secret est débloqué.',
        color: 'from-pink to-rose-500',
    },
    {
        label: 'Jean-Michel doit te rappeler cinq choses qu’il aime chez toi.',
        color: 'from-pink to-red-deep',
    },
    { label: 'Un bisou virtuel.', color: 'from-powder to-pink' },
    { label: 'Un défi de couple.', color: 'from-purple-500 to-pink' },
];

export default function SurpriseWheel({
    onBack,
    soundEnabled,
    onToggleSound,
}: SectionProps) {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<(typeof OPTIONS)[number] | null>(null);

    const handleSpin = () => {
        if (spinning) {
            return;
        }

        setSpinning(true);
        setResult(null);
        const winningIdx = Math.floor(Math.random() * OPTIONS.length);
        const anglePerSlice = 360 / OPTIONS.length;
        const targetAngle =
            360 * 5 + (360 - winningIdx * anglePerSlice - anglePerSlice / 2);
        setRotation(targetAngle);
        setTimeout(() => {
            setSpinning(false);
            setResult(OPTIONS[winningIdx]);
        }, 3500);
    };

    return (
        <SectionLayout
            title="Wheel of Surprises"
            subtitle="Tourne pour une surprise"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            {/* Wheel */}
            <div className="relative mx-auto mb-8 h-64 w-64">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1">
                    <div className="h-0 w-0 border-t-[16px] border-r-[10px] border-l-[10px] border-t-pink border-r-transparent border-l-transparent drop-shadow-lg" />
                </div>

                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 3.5, ease: [0.17, 0.67, 0.32, 1] }}
                    className="glow-pink relative h-full w-full overflow-hidden rounded-full border-4 border-pink/20"
                >
                    {OPTIONS.map((opt, i) => {
                        const angle = 360 / OPTIONS.length;

                        return (
                            <div
                                key={i}
                                className="absolute top-0 left-1/2 origin-bottom"
                                style={{
                                    width: '50%',
                                    height: '50%',
                                    transform: `rotate(${i * angle}deg)`,
                                    transformOrigin: 'bottom left',
                                }}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-80`}
                                    style={{
                                        clipPath: `polygon(0 0, ${100 * Math.tan((angle * Math.PI) / 180)}% 0, 0 100%)`,
                                    }}
                                />
                            </div>
                        );
                    })}
                    {/* Center */}
                    <div className="absolute top-1/2 left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-night-deep">
                        <Sparkles className="h-4 w-4 text-pink" />
                    </div>
                </motion.div>
            </div>

            <button
                onClick={handleSpin}
                disabled={spinning}
                className="glow-pink w-full rounded-2xl bg-gradient-to-r from-pink to-pink-vibrant py-3.5 font-body text-sm text-white transition-all active:scale-95 disabled:opacity-50"
            >
                {spinning ? 'La roue tourne…' : 'Tourner la roue'}
            </button>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-pink glow-pink mt-6 rounded-2xl p-5 text-center"
                    >
                        <Sparkles className="mx-auto mb-2 h-5 w-5 text-pink" />
                        <p className="font-handwriting text-xl leading-snug text-powder">
                            {result.label}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionLayout>
    );
}
