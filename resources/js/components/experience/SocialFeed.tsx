import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ImageOff, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps, SocialPost } from '@/types/experience';

const FALLBACK_POSTS = [
    {
        caption: 'My Peace being effortlessly beautiful.',
        post_date: '2026-03-10',
        category: 'lifestyle',
        jean_michel_thought:
            'Ce jour-là, je n’arrêtais pas de la regarder. Elle ne s’en rendait même pas compte.',
    },
    {
        caption: 'Encore un jour où je suis retombé amoureux.',
        post_date: '2026-04-05',
        category: 'vlog',
        jean_michel_thought:
            'Chaque jour avec elle est un nouveau coup de foudre. Si si.',
    },
    {
        caption:
            'POV : elle ne sait pas encore à quel point ses yeux sont magnifiques.',
        post_date: '2026-05-02',
        category: 'moment',
        jean_michel_thought:
            'Ses yeux. Je pourrais passer ma vie à les regarder.',
    },
    {
        caption: 'arky N dans son élément. Main character energy.',
        post_date: '2026-05-20',
        category: 'creator',
        jean_michel_thought:
            'Quand elle crée, elle brille différemment. J’aime cette version d’elle.',
    },
    {
        caption: 'Si si, ma femme est trop belle.',
        post_date: '2026-06-15',
        category: 'lifestyle',
        jean_michel_thought: 'Ma femme. Ma vie. Mon cœur.',
    },
];

export default function SocialFeed({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const posts: SocialPost[] = content?.social_posts?.length
        ? content.social_posts
        : FALLBACK_POSTS;
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    return (
        <SectionLayout
            title="arky N"
            subtitle="Social Universe"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            {/* Profile */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass mb-6 rounded-2xl p-5 text-center"
            >
                <div className="glass-pink glow-pink mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full">
                    <span className="text-gradient-pink font-heading text-2xl">
                        C
                    </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <h2 className="font-heading text-lg text-cream">arky N</h2>
                    <span className="glass-pink rounded-full px-2 py-0.5 text-[10px] text-powder">
                        My Peace
                    </span>
                </div>
                <p className="mt-1 text-xs text-silver/50">
                    Main character · Lifestyle · Creator
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div>
                        <p className="font-heading text-base text-pink">1</p>
                        <p className="text-[10px] text-silver/40">
                            Follower conquis
                        </p>
                    </div>
                    <div>
                        <p className="font-heading text-base text-pink">∞</p>
                        <p className="text-[10px] text-silver/40">Likes</p>
                    </div>
                    <div>
                        <p className="font-heading text-base text-pink">5</p>
                        <p className="text-[10px] text-silver/40">Mois</p>
                    </div>
                </div>
                <p className="mt-3 text-[11px] text-silver/40">
                    Manager du cœur: Only You
                </p>
            </motion.div>

            {/* Feed */}
            {posts ? (
                <div className="space-y-5">
                    {posts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: 0.05 * i }}
                            className="glass overflow-hidden rounded-2xl"
                        >
                            {/* Post header */}
                            <div className="flex items-center gap-2 p-3">
                                <div className="glass-pink flex h-8 w-8 items-center justify-center rounded-full">
                                    <span className="font-heading text-xs text-pink">
                                        C
                                    </span>
                                </div>
                                <div>
                                    <p className="font-body text-sm text-cream">
                                        arky N
                                    </p>
                                    <p className="text-[10px] text-silver/40">
                                        {post.post_date
                                            ? new Date(
                                                  post.post_date,
                                              ).toLocaleDateString('fr-FR', {
                                                  day: 'numeric',
                                                  month: 'short',
                                              })
                                            : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Photo */}
                            {post.photo_url ? (
                                <img
                                    src={post.photo_url}
                                    alt=""
                                    className="h-64 w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-48 flex-col items-center justify-center gap-2 bg-night-deep/50">
                                    <ImageOff className="h-6 w-6 text-silver/20" />
                                    <span className="text-xs text-silver/20">
                                        [PHOTO À AJOUTER]
                                    </span>
                                </div>
                            )}

                            {/* Caption + reactions */}
                            <div className="p-4">
                                <div className="mb-2 flex items-center gap-4">
                                    <motion.button
                                        whileTap={{ scale: 1.3 }}
                                        className="flex items-center gap-1 text-silver/50 transition-colors hover:text-pink"
                                    >
                                        <Heart className="h-4 w-4" />
                                        <span className="text-xs">∞</span>
                                    </motion.button>
                                    <Sparkles className="h-4 w-4 text-silver/50" />
                                </div>
                                <p className="text-sm leading-relaxed text-cream/90">
                                    {post.caption}
                                </p>

                                {/* Jean-Michel's thought */}
                                {post.jean_michel_thought && (
                                    <button
                                        onClick={() =>
                                            setExpanded((p) => ({
                                                ...p,
                                                [i]: !p[i],
                                            }))
                                        }
                                        className="mt-3 flex items-center gap-1 text-xs text-powder/60 transition-colors hover:text-powder"
                                    >
                                        <span>
                                            Voir ce que Jean-Michel pense de ce
                                            moment
                                        </span>
                                        <ChevronDown
                                            className={`h-3 w-3 transition-transform ${expanded[i] ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                )}
                                <AnimatePresence>
                                    {expanded[i] &&
                                        post.jean_michel_thought && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="mt-2 border-l border-pink/30 pl-3 font-handwriting text-base text-powder/70">
                                                    {post.jean_michel_thought}
                                                </p>
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center py-20">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink/30 border-t-pink" />
                </div>
            )}
        </SectionLayout>
    );
}
