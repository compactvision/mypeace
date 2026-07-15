import { motion } from 'framer-motion';
import { Music, Disc3, ExternalLink } from 'lucide-react';
import React from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps } from '@/types/experience';

const TRACKS = [
    {
        title: 'PARTYNEXTDOOR',
        artist: 'Featured',
        desc: 'L’artiste qui colle à notre ambiance.',
        featured: true,
    },
    {
        title: 'Midnight vibes',
        artist: 'R&B',
        desc: 'Pour les soirées à ne rien faire, juste nous deux.',
    },
    {
        title: 'Golden hour',
        artist: 'R&B',
        desc: 'Comme la lumière au bord du fleuve.',
    },
    {
        title: 'Still falling',
        artist: 'R&B',
        desc: 'Parce que oui, je tombe encore.',
    },
    { title: 'My Peace', artist: 'R&B', desc: 'Toi. Juste toi.' },
];

export default function RnbPlaylist({
    onBack,
    soundEnabled,
    onToggleSound,
}: SectionProps) {
    return (
        <SectionLayout
            title="Our Midnight Playlist"
            subtitle="R&B · PARTYNEXTDOOR"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            {/* Vinyl */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="relative mx-auto mb-8 h-32 w-32"
            >
                <div className="glow-pink flex h-full w-full items-center justify-center rounded-full border-4 border-pink/20 bg-gradient-to-br from-night to-night-deep">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink/20">
                        <div className="h-3 w-3 rounded-full bg-pink" />
                    </div>
                </div>
                <Disc3 className="absolute -top-2 -right-2 h-6 w-6 text-pink/40" />
            </motion.div>

            {/* Tracks */}
            <div className="space-y-3">
                {TRACKS.map((track, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className={`glass flex items-center gap-3 rounded-2xl p-4 ${track.featured ? 'glass-pink glow-pink' : ''}`}
                    >
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${track.featured ? 'bg-pink/20' : 'glass'}`}
                        >
                            <Music
                                className={`h-4 w-4 ${track.featured ? 'text-pink' : 'text-silver/50'}`}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="truncate font-body text-sm text-cream">
                                    {track.title}
                                </h3>
                                {track.featured && (
                                    <span className="rounded-full bg-pink/20 px-1.5 py-0.5 text-[9px] text-powder">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <p className="truncate text-xs text-silver/40">
                                {track.desc}
                            </p>
                        </div>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-silver/30" />
                    </motion.div>
                ))}
            </div>

            <p className="mt-6 text-center text-xs text-silver/30">
                La musique ne se lance jamais automatiquement. Touche le bouton
                son pour activer l'ambiance.
            </p>
        </SectionLayout>
    );
}
