import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lock } from 'lucide-react';
import React, { useState } from 'react';
import type { CoupleSettings } from '@/types/experience';

const ERROR_MESSAGES = [
    'Presque, My Peace…',
    'Only You t’a laissé un indice quelque part.',
    'Essaie une date importante pour nous.',
];

type Props = { settings: CoupleSettings | null; onUnlock: () => void };

export default function LockScreen({ settings, onUnlock }: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [unlocking, setUnlocking] = useState(false);
    const [locked, setLocked] = useState(false);

    const accessCode = settings?.access_code || '2102';

    const handleDigit = (digit: string) => {
        if (locked || unlocking) {
            return;
        }

        if (code.length >= 4) {
            return;
        }

        const newCode = code + digit;
        setCode(newCode);
        setError('');

        if (newCode.length === 4) {
            setTimeout(() => checkCode(newCode), 250);
        }
    };

    const checkCode = (entered: string) => {
        if (entered === accessCode) {
            setUnlocking(true);
            setTimeout(() => onUnlock(), 1400);
        } else {
            const next = attempts + 1;
            setAttempts(next);
            setError(ERROR_MESSAGES[(next - 1) % ERROR_MESSAGES.length]);
            setCode('');

            if (next >= 3) {
                setLocked(true);
                setTimeout(() => setLocked(false), 5000);
            }
        }
    };

    const handleDelete = () => {
        if (locked) {
            return;
        }

        setCode(code.slice(0, -1));
        setError('');
    };

    return (
        <div className="water-bg grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            {/* Ripples */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border border-pink/10"
                        style={{
                            width: '200px',
                            height: '200px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: `ripple 4s ease-out ${i * 1.3}s infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Unlock wave */}
            <AnimatePresence>
                {unlocking && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 30 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="fixed top-1/2 left-1/2 z-50 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink to-pink-vibrant"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full max-w-xs text-center"
            >
                <div className="mb-3 flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-silver/50" />
                    <span className="text-xs tracking-[0.3em] text-silver/50 uppercase">
                        Private experience
                    </span>
                </div>

                <h1 className="text-gradient-pink mb-1 font-heading text-2xl leading-snug">
                    Created for My Peace
                </h1>
                <p className="mb-4 font-handwriting text-2xl text-powder/80">
                    By Only You
                </p>

                <p className="mb-10 text-xs tracking-wider text-silver/40">
                    21 juillet 2026
                </p>

                {/* Code dots */}
                <div className="mb-6 flex justify-center gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            animate={
                                error && i < 4 ? { x: [0, -8, 8, -8, 0] } : {}
                            }
                            transition={{ duration: 0.4 }}
                            className={`h-3.5 w-3.5 rounded-full border ${
                                code.length > i
                                    ? 'glow-pink border-pink bg-pink'
                                    : 'border-silver/30'
                            }`}
                        />
                    ))}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mb-4 font-handwriting text-lg text-sm text-powder/60"
                        >
                            {error}
                        </motion.p>
                    )}
                    {locked && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mb-4 text-xs text-silver/40"
                        >
                            Quelques secondes, My Peace…
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Number pad */}
                <div className="mx-auto grid max-w-[240px] grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                        <button
                            key={d}
                            onClick={() => handleDigit(String(d))}
                            disabled={locked}
                            className="touch-target glass flex items-center justify-center rounded-2xl font-heading text-xl text-cream transition-all hover:bg-pink/10 hover:text-pink active:scale-95 disabled:opacity-30"
                        >
                            {d}
                        </button>
                    ))}
                    <div />
                    <button
                        onClick={() => handleDigit('0')}
                        disabled={locked}
                        className="touch-target glass flex items-center justify-center rounded-2xl font-heading text-xl text-cream transition-all hover:bg-pink/10 hover:text-pink active:scale-95 disabled:opacity-30"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={locked}
                        className="touch-target glass flex items-center justify-center rounded-2xl text-silver transition-all hover:text-powder active:scale-95 disabled:opacity-30"
                    >
                        <Delete className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
