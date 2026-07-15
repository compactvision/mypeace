import { motion } from 'framer-motion';
import { ImageOff, Info } from 'lucide-react';
import React, { useState } from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { Memory, SectionProps } from '@/types/experience';

const CATEGORIES = [
    { id: 'all', label: 'Tout' },
    { id: 'fleuve', label: 'Fleuve' },
    { id: 'maluku', label: 'Maluku' },
    { id: 'chez_moi', label: 'Chez moi' },
    { id: 'sorties', label: 'Sorties' },
    { id: 'beaux_yeux', label: 'Ses yeux' },
    { id: 'looks', label: 'Looks' },
    { id: 'secret', label: 'Secret' },
];

export default function MemoriesGallery({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const memories: Memory[] = content?.memories || [];
    const [activeCat, setActiveCat] = useState('all');
    const [behind, setBehind] = useState<Memory | null>(null);

    const filtered = memories
        ? activeCat === 'all'
            ? memories
            : memories.filter((m) => m.category === activeCat)
        : [];

    return (
        <SectionLayout
            title="Our Memories"
            subtitle="Galerie privée"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            maxWidth="max-w-2xl"
        >
            {/* Category filter */}
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-all ${
                            activeCat === cat.id
                                ? 'glass-pink text-powder'
                                : 'glass text-silver/50 hover:text-cream'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                    <ImageOff className="mx-auto mb-2 h-8 w-8 text-silver/20" />
                    <p className="text-sm text-silver/40">
                        Aucun souvenir dans cette catégorie pour le moment.
                    </p>
                    <p className="mt-1 text-xs text-silver/30">
                        Jean-Michel peut en ajouter depuis l'administration.
                    </p>
                </div>
            ) : (
                <div className="columns-2 gap-3 space-y-3">
                    {filtered.map((mem, i) => (
                        <motion.div
                            key={mem.id || i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="mb-3 break-inside-avoid"
                        >
                            <div className="glass overflow-hidden rounded-2xl">
                                {mem.photo_url ? (
                                    <img
                                        src={mem.photo_url}
                                        alt={mem.title}
                                        className="w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-40 flex-col items-center justify-center gap-1 bg-night-deep/50">
                                        <ImageOff className="h-5 w-5 text-silver/20" />
                                        <span className="text-[10px] text-silver/20">
                                            [PHOTO À AJOUTER]
                                        </span>
                                    </div>
                                )}
                                <div className="p-3">
                                    <p className="font-body text-sm text-cream">
                                        {mem.title}
                                    </p>
                                    {mem.memory_date && (
                                        <p className="mt-0.5 text-[10px] text-silver/40">
                                            {new Date(
                                                mem.memory_date,
                                            ).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    )}
                                    {mem.location && (
                                        <p className="text-[10px] text-silver/40">
                                            {mem.location}
                                        </p>
                                    )}
                                    {mem.behind_story && (
                                        <button
                                            onClick={() => setBehind(mem)}
                                            className="mt-2 flex items-center gap-1 text-[11px] text-powder/60 transition-colors hover:text-powder"
                                        >
                                            <Info className="h-3 w-3" />
                                            Behind this memory
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Behind story modal */}
            {behind && (
                <div
                    onClick={() => setBehind(null)}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-night-black/80 p-4 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass-pink w-full max-w-sm rounded-3xl p-6"
                    >
                        <h3 className="mb-2 font-heading text-lg text-cream">
                            {behind.title}
                        </h3>
                        <p className="font-handwriting text-lg leading-snug text-powder/80">
                            {behind.behind_story}
                        </p>
                        <button
                            onClick={() => setBehind(null)}
                            className="glass mt-4 w-full rounded-xl py-2.5 text-sm text-silver transition-colors hover:text-cream"
                        >
                            Fermer
                        </button>
                    </motion.div>
                </div>
            )}
        </SectionLayout>
    );
}
