import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import React from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps, TimelineEntry } from '@/types/experience';

const FALLBACK_CHAPTERS = [
    {
        chapter: 1,
        month_label: 'Février',
        title: 'The Beginning',
        content:
            'Rencontre lors d’un chill au bord du fleuve. Premiers échanges, premières impressions. Le début d’une nouvelle histoire.',
        event_date: '2026-02-21',
        quote: 'Je ne savais pas encore que ce moment au bord du fleuve allait changer autant de choses.',
    },
    {
        chapter: 2,
        month_label: 'Mars',
        title: 'Closer',
        content:
            'Le 5 mars, notre histoire a pris une nouvelle dimension. Premier rapprochement physique et émotionnel important. Premiers moments de forte complicité.',
        event_date: '2026-03-05',
        quote: 'Le 5 mars, quelque chose entre nous a profondément changé.',
    },
    {
        chapter: 3,
        month_label: 'Avril',
        title: 'Comfort',
        content:
            'Habitudes de couple, discussions, moments simples. Premiers réflexes de complicité. « Ma vie », « ma femme », « si si ».',
        event_date: '2026-04-01',
        quote: 'Sans m’en rendre compte, tu étais déjà devenue une partie de mes journées.',
    },
    {
        chapter: 4,
        month_label: 'Mai — Juin',
        title: 'Memories in Motion',
        content:
            'Sorties au bord du fleuve, découverte de Maluku, beaux paysages, rires, vlogs, moments spontanés.',
        event_date: '2026-05-15',
        quote: 'Avec toi, même une journée simple devient un souvenir que je veux garder.',
    },
    {
        chapter: 5,
        month_label: 'Juillet',
        title: 'Still Falling',
        content:
            'Cinq mois de relation. Préparation de ce site. Reconnaissance, déclaration, promesse d’être présent.',
        event_date: '2026-07-21',
        quote: 'Cinq mois plus tard, je ne me suis pas habitué à toi. Je tombe encore plus amoureux chaque fois que je te vois.',
    },
];

export default function FiveMonthsTimeline({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const entries: TimelineEntry[] = content?.timeline?.length
        ? content.timeline
        : FALLBACK_CHAPTERS;

    return (
        <SectionLayout
            title="Five Months, Five Chapters"
            subtitle="Du 21 février au 21 juillet 2026"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-pink/40 via-pink/20 to-transparent" />

                {entries.map((entry, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative mb-12 last:mb-0"
                    >
                        {/* Dot */}
                        <div className="glow-pink absolute top-1 -left-[26px] h-3 w-3 rounded-full bg-pink ring-4 ring-night-deep" />

                        {/* Chapter number */}
                        <div className="mb-2 flex items-baseline gap-3">
                            <span className="font-heading text-4xl leading-none text-pink/20">
                                {String(entry.chapter).padStart(2, '0')}
                            </span>
                            <div>
                                <p className="text-xs tracking-wider text-silver/40 uppercase">
                                    {entry.month_label}
                                </p>
                                <h2 className="font-heading text-xl text-cream">
                                    {entry.title}
                                </h2>
                            </div>
                        </div>

                        {/* Photo */}
                        {entry.photo_url ? (
                            <div className="glass my-3 overflow-hidden rounded-2xl">
                                <img
                                    src={entry.photo_url}
                                    alt={entry.title}
                                    className="h-48 w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div className="glass my-3 flex h-32 flex-col items-center justify-center gap-1.5 rounded-2xl">
                                <ImageOff className="h-5 w-5 text-silver/20" />
                                <span className="text-xs text-silver/20">
                                    [PHOTO À AJOUTER]
                                </span>
                            </div>
                        )}

                        <p className="mb-3 text-sm leading-relaxed text-silver/70">
                            {entry.content}
                        </p>

                        <p className="font-handwriting text-lg leading-snug text-powder/70">
                            « {entry.quote} »
                        </p>

                        {entry.event_date && (
                            <p className="mt-2 text-xs text-silver/30">
                                {new Date(entry.event_date).toLocaleDateString(
                                    'fr-FR',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    },
                                )}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </SectionLayout>
    );
}
