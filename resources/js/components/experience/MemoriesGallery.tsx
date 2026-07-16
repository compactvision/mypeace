import { AnimatePresence, motion } from 'framer-motion';
import { Film, ImageOff, Info, MapPin, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ExperienceImage from '@/components/experience/ExperienceImage';
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

const PHOTO_TILTS = [-1.8, 1.2, -0.7, 1.7, -1.1, 0.8];

function formatMemoryDate(date?: string): string | null {
    if (!date) {
        return null;
    }

    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MemoriesGallery({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const memories: Memory[] = content?.memories || [];
    const settings = content?.settings?.[0];
    const [activeCat, setActiveCat] = useState('all');
    const [behind, setBehind] = useState<Memory | null>(null);
    const [flipped, setFlipped] = useState(false);
    const flipTimer = useRef<number | null>(null);

    const filtered = memories
        ? activeCat === 'all'
            ? memories
            : memories.filter((m) => m.category === activeCat)
        : [];
    const videoMemory = filtered.find((memory) => memory.video_url);
    const photoMemories = videoMemory
        ? filtered.filter((memory) => memory !== videoMemory)
        : filtered;
    const showVideoSlot = activeCat === 'all' || Boolean(videoMemory);

    useEffect(() => {
        if (!behind) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setBehind(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);

            if (flipTimer.current) {
                window.clearTimeout(flipTimer.current);
            }
        };
    }, [behind]);

    const openMemory = (memory: Memory) => {
        if (flipTimer.current) {
            window.clearTimeout(flipTimer.current);
        }

        setFlipped(false);
        setBehind(memory);
        flipTimer.current = window.setTimeout(() => setFlipped(true), 700);
    };

    const closeMemory = () => {
        if (flipTimer.current) {
            window.clearTimeout(flipTimer.current);
        }

        setBehind(null);
    };

    return (
        <SectionLayout
            title={settings?.gallery_title || 'Our Memories'}
            subtitle={settings?.gallery_subtitle || 'Galerie privée'}
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

            {filtered.length === 0 && activeCat !== 'all' ? (
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
                <div>
                    {showVideoSlot && (
                        <motion.article
                            initial={{ opacity: 0, y: 26, rotate: -1 }}
                            animate={{ opacity: 1, y: 0, rotate: -0.4 }}
                            transition={{ duration: 0.65 }}
                            className="relative mb-10 rounded-[4px] bg-[#f5eee4] p-3 pb-5 shadow-[0_24px_50px_rgba(0,0,0,0.45)] sm:p-4 sm:pb-6"
                        >
                            <div className="overflow-hidden bg-night-black shadow-inner">
                                {videoMemory?.video_url ? (
                                    <video
                                        src={videoMemory.video_url}
                                        poster={videoMemory.photo_url}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="aspect-video w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-night-deep via-night to-pink/15 px-6 text-center">
                                        <div className="flex size-14 items-center justify-center rounded-full border border-pink/25 bg-pink/10 text-powder">
                                            <Film className="size-6" />
                                        </div>
                                        <div>
                                            <p className="font-heading text-lg text-cream">
                                                Notre souvenir en mouvement
                                            </p>
                                            <p className="mt-1 text-xs text-silver/55">
                                                Bientôt, un instant prendra vie
                                                ici.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-2 pt-4 text-night-deep sm:px-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-handwriting text-xl font-semibold sm:text-2xl">
                                            {videoMemory?.title ||
                                                'Notre souvenir en vidéo'}
                                        </p>
                                        {videoMemory && (
                                            <p className="mt-1 text-[10px] text-night/50">
                                                {[
                                                    formatMemoryDate(
                                                        videoMemory.memory_date,
                                                    ),
                                                    videoMemory.location,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </p>
                                        )}
                                    </div>
                                    <span className="rounded-full border border-night/10 px-2 py-1 text-[9px] font-semibold tracking-wider text-night/50 uppercase">
                                        Vidéo
                                    </span>
                                </div>
                                {videoMemory?.behind_story && (
                                    <button
                                        type="button"
                                        onClick={() => openMemory(videoMemory)}
                                        className="mt-3 flex items-center gap-1 text-[10px] font-semibold tracking-wide text-night/55 uppercase transition-colors hover:text-pink"
                                    >
                                        <Info className="size-3" />
                                        Behind this memory
                                    </button>
                                )}
                            </div>
                        </motion.article>
                    )}

                    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9">
                        {photoMemories.map((mem, i) => (
                            <motion.article
                                key={mem.id || i}
                                role={mem.behind_story ? 'button' : undefined}
                                tabIndex={mem.behind_story ? 0 : undefined}
                                aria-label={
                                    mem.behind_story
                                        ? `Découvrir l'histoire du souvenir ${mem.title}`
                                        : undefined
                                }
                                onClick={() => {
                                    if (mem.behind_story) {
                                        openMemory(mem);
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        mem.behind_story &&
                                        (event.key === 'Enter' ||
                                            event.key === ' ')
                                    ) {
                                        event.preventDefault();
                                        openMemory(mem);
                                    }
                                }}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: -6,
                                    rotate: 0,
                                    scale: 1.025,
                                }}
                                viewport={{ once: true, margin: '-30px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.05,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{
                                    rotate: PHOTO_TILTS[i % PHOTO_TILTS.length],
                                }}
                                className={`group relative rounded-[3px] bg-[#f5eee4] p-2 pb-3 shadow-[0_18px_35px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.25)] sm:p-3 sm:pb-4 ${mem.behind_story ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-4 focus-visible:ring-offset-night-deep focus-visible:outline-none' : ''}`}
                            >
                                <div className="absolute inset-x-3 top-0 h-px bg-white/80" />
                                <div className="overflow-hidden bg-[#d9d1c7] shadow-inner">
                                    {mem.photo_url ? (
                                        <ExperienceImage
                                            src={mem.photo_url}
                                            alt={mem.title}
                                            className="aspect-[4/5] w-full object-cover"
                                            eager={i < 4}
                                        />
                                    ) : (
                                        <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1 bg-[#d9d1c7]">
                                            <ImageOff className="h-5 w-5 text-night/25" />
                                            <span className="text-[10px] text-night/30">
                                                [PHOTO À AJOUTER]
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="px-1 pt-3 text-night-deep sm:px-2 sm:pt-4">
                                    <p className="font-handwriting text-base leading-none font-semibold sm:text-xl">
                                        {mem.title}
                                    </p>
                                    <div className="mt-1.5 min-h-7 text-[9px] leading-relaxed text-night/55 sm:text-[10px]">
                                        {formatMemoryDate(mem.memory_date) && (
                                            <p>
                                                {formatMemoryDate(
                                                    mem.memory_date,
                                                )}
                                            </p>
                                        )}
                                        {mem.location && (
                                            <p className="flex items-center gap-1 truncate">
                                                <MapPin className="size-2.5 shrink-0" />
                                                {mem.location}
                                            </p>
                                        )}
                                    </div>
                                    {mem.behind_story && (
                                        <div
                                            aria-hidden="true"
                                            className="mt-2 flex w-full items-center justify-center gap-1 border-t border-night/10 pt-2 text-[9px] font-semibold tracking-wide text-night/60 uppercase transition-colors group-hover:text-pink sm:text-[10px]"
                                        >
                                            <Info className="size-3" />
                                            Behind this memory
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {behind && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Histoire du souvenir ${behind.title}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeMemory();
                            }
                        }}
                        className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-night-black/90 p-4 backdrop-blur-xl [perspective:1600px]"
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.55,
                                y: 80,
                                rotate: -7,
                            }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.7, y: 40 }}
                            transition={{
                                type: 'spring',
                                stiffness: 150,
                                damping: 20,
                            }}
                            className="relative h-[min(72vh,620px)] w-[min(88vw,430px)]"
                        >
                            <motion.div
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{
                                    duration: 1.15,
                                    ease: [0.65, 0, 0.35, 1],
                                }}
                                className="relative h-full w-full [transform-style:preserve-3d]"
                            >
                                <div className="absolute inset-0 flex flex-col rounded-[5px] bg-[#f5eee4] p-3 pb-5 shadow-[0_35px_90px_rgba(0,0,0,0.65)] [backface-visibility:hidden] sm:p-4 sm:pb-6">
                                    <div className="min-h-0 flex-1 overflow-hidden bg-[#d9d1c7] [&>div]:h-full">
                                        {behind.photo_url ? (
                                            <ExperienceImage
                                                src={behind.photo_url}
                                                alt={behind.title}
                                                className="h-full w-full object-cover"
                                                eager
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-2 text-night/30">
                                                <ImageOff className="size-8" />
                                                <span className="text-xs">
                                                    Photo à ajouter
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-2 pt-4 text-night-deep">
                                        <p className="font-handwriting text-2xl font-semibold">
                                            {behind.title}
                                        </p>
                                        <p className="mt-1 text-[11px] text-night/50">
                                            {[
                                                formatMemoryDate(
                                                    behind.memory_date,
                                                ),
                                                behind.location,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden rounded-[5px] bg-[#f5eee4] p-7 text-night-deep shadow-[0_35px_90px_rgba(0,0,0,0.65)] [backface-visibility:hidden] sm:p-10">
                                    <div className="absolute top-5 right-5 text-5xl text-pink/15">
                                        ♥
                                    </div>
                                    <p className="text-[10px] font-semibold tracking-[0.28em] text-pink uppercase">
                                        Behind this memory
                                    </p>
                                    <h3 className="mt-4 font-heading text-3xl leading-tight">
                                        {behind.title}
                                    </h3>
                                    <div className="my-5 h-px w-16 bg-pink/35" />
                                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                        <p className="font-handwriting text-xl leading-relaxed text-night/80 sm:text-2xl">
                                            {behind.behind_story}
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-night/10 pt-4 text-[10px] text-night/45">
                                        <span>
                                            {formatMemoryDate(
                                                behind.memory_date,
                                            )}
                                        </span>
                                        <span className="font-handwriting text-base text-pink/70">
                                            My Peace ♥
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                        <button
                            type="button"
                            onClick={closeMemory}
                            className="glass absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full text-cream transition hover:scale-105 hover:text-powder"
                            aria-label="Fermer le souvenir"
                        >
                            <X className="size-5" />
                        </button>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8 }}
                            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-[10px] tracking-[0.18em] text-silver/45 uppercase"
                        >
                            Appuie en dehors pour fermer
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionLayout>
    );
}
