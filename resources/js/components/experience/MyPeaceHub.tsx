import { motion } from 'framer-motion';
import {
    Clock,
    Heart,
    UtensilsCrossed,
    Music,
    Gift,
    Sparkles,
    MessageSquare,
    Image,
    Volume2,
    VolumeX,
    Star,
} from 'lucide-react';
import React from 'react';
import type { CoupleSettings } from '@/types/experience';

const SECTIONS = [
    {
        id: 'timeline',
        label: 'Timeline',
        icon: Clock,
        desc: 'Five months, five chapters',
    },
    { id: 'social', label: 'arky N', icon: Star, desc: 'Her social universe' },
    {
        id: 'kitchen',
        label: 'Private Kitchen',
        icon: UtensilsCrossed,
        desc: 'The day I cooked for you',
    },
    {
        id: 'reasons',
        label: 'Love Reasons',
        icon: Heart,
        desc: 'Why I love you',
    },
    { id: 'gallery', label: 'Gallery', icon: Image, desc: 'Our memories' },
    {
        id: 'playlist',
        label: 'Playlist',
        icon: Music,
        desc: 'Our midnight R&B',
    },
    {
        id: 'wheel',
        label: 'Surprise Wheel',
        icon: Sparkles,
        desc: 'Spin for a surprise',
    },
    {
        id: 'letter',
        label: 'The Letter',
        icon: MessageSquare,
        desc: 'To My Peace, from Only You',
    },
    {
        id: 'reveal',
        label: 'Final Reveal',
        icon: Gift,
        desc: 'The last chapter',
    },
];

const STATS = [
    { value: '1', label: 'Cœur capturé' },
    { value: '5', label: 'Mois de souvenirs' },
    { value: '∞', label: 'Pensées' },
    { value: '100%', label: 'Irremplaçable' },
];

type Props = {
    onNavigate: (section: string) => void;
    foundKeys: string[];
    soundEnabled: boolean;
    onToggleSound: () => void;
    settings: CoupleSettings | null;
};

export default function MyPeaceHub({
    onNavigate,
    foundKeys,
    soundEnabled,
    onToggleSound,
    settings,
}: Props) {
    const partnerTwo = settings?.partner_two_name || 'Cassy';
    const influencer = settings?.influencer_name || 'arky N';
    const primaryMessage =
        settings?.primary_message || 'The girl who keeps surprising me.';

    return (
        <div className="water-bg grain relative min-h-screen pb-12">
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

            <div className="mx-auto max-w-md px-5 pt-16">
                {/* Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 text-center"
                >
                    {/* Avatar placeholder */}
                    <div className="relative mx-auto mb-4 h-28 w-28">
                        <div className="glass-pink glow-pink flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                            <span className="text-gradient-pink font-heading text-3xl">
                                {partnerTwo[0]}
                            </span>
                        </div>
                        <div className="glow-pink absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink">
                            <Heart className="h-3.5 w-3.5 fill-white text-white" />
                        </div>
                    </div>

                    <h1 className="font-heading text-2xl text-cream">
                        {partnerTwo}
                    </h1>
                    <p className="text-sm text-silver/60">@{influencer}</p>

                    <div className="glass-pink mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
                        <Sparkles className="h-3 w-3 text-pink" />
                        <span className="text-xs text-powder">
                            Jean-Michel's favorite creator
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-silver/50">
                        My Peace since 21.02.2026
                    </p>
                    <p className="mt-1 font-handwriting text-lg text-powder/70">
                        {primaryMessage}
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6 grid grid-cols-4 gap-2"
                >
                    {STATS.map((s) => (
                        <div
                            key={s.label}
                            className="glass rounded-xl p-2.5 text-center"
                        >
                            <div className="text-gradient-pink font-heading text-lg">
                                {s.value}
                            </div>
                            <div className="mt-0.5 text-[10px] leading-tight text-silver/40">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Love status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="glass mb-6 flex items-center justify-between rounded-2xl p-4"
                >
                    <div>
                        <p className="text-xs tracking-wider text-silver/40 uppercase">
                            Love status
                        </p>
                        <p className="font-body text-sm text-powder">
                            still falling harder
                        </p>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Heart className="h-6 w-6 fill-pink text-pink" />
                    </motion.div>
                </motion.div>

                {/* Secrets progress */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-6"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs tracking-wider text-silver/50 uppercase">
                            Secrets trouvés
                        </span>
                        <span className="font-body text-sm text-powder">
                            {foundKeys.length}/5
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-night-deep">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-pink to-pink-vibrant"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(foundKeys.length / 5) * 100}%`,
                            }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>
                </motion.div>

                {/* Navigation cards */}
                <div className="grid grid-cols-2 gap-3">
                    {SECTIONS.map((s, i) => {
                        const Icon = s.icon;

                        return (
                            <motion.button
                                key={s.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                                onClick={() => onNavigate(s.id)}
                                className="glass group rounded-2xl p-4 text-left transition-all hover:border-pink/20 hover:bg-pink/8 active:scale-95"
                            >
                                <div className="glass-pink group-hover:glow-pink mb-2 flex h-9 w-9 items-center justify-center rounded-xl transition-all">
                                    <Icon className="h-4 w-4 text-pink" />
                                </div>
                                <h3 className="font-body text-sm text-cream">
                                    {s.label}
                                </h3>
                                <p className="mt-0.5 text-[11px] text-silver/40">
                                    {s.desc}
                                </p>
                            </motion.button>
                        );
                    })}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-center font-handwriting text-base text-xs text-silver/30"
                >
                    Only You × My Peace — Chapter Five
                </motion.p>
            </div>
        </div>
    );
}
