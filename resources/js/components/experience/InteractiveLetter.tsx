import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Feather, SkipForward } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps } from '@/types/experience';

const LETTER_PARAGRAPHS = [
    { text: 'Ma vie,', type: 'handwriting' },
    {
        text: 'Cela fait maintenant cinq mois que notre histoire a commencé, et j’ai parfois l’impression que le temps passe trop vite.',
    },
    {
        text: 'Depuis ce moment au bord du fleuve, tu as pris une place importante dans ma vie.',
    },
    {
        text: 'Tu arrives encore à me surprendre. Chaque fois que je te vois, je découvre quelque chose de nouveau, et je tombe encore plus amoureux de toi.',
    },
    {
        text: 'J’aime tes beaux yeux, ton énergie, ta personnalité, ta manière d’être toi-même et la paix que tu m’apportes.',
    },
    {
        text: 'Je ne prétends pas que tout sera toujours parfait. Mais je veux que tu saches une chose : je t’aime et je serai toujours là pour toi.',
    },
    {
        text: 'Ce site est mon cadeau. Ce n’est pas seulement une page avec des photos. C’est un morceau de notre histoire, un endroit où j’ai voulu conserver ce que nous avons déjà vécu.',
    },
    { text: 'Merci pour ces cinq mois, My Peace.', type: 'handwriting' },
    { text: 'Et surtout, merci d’être toi.', type: 'handwriting' },
    { text: 'Only You.', type: 'signature' },
];

function characterDelay(character: string): number {
    if (/[.!?…]/.test(character)) {
        return 280;
    }

    if (/[,;:]/.test(character)) {
        return 130;
    }

    return character === ' ' ? 22 : 38;
}

export default function InteractiveLetter({
    onBack,
    soundEnabled,
    onToggleSound,
    content,
}: SectionProps) {
    const settings = content?.settings?.[0];
    const reduceMotion = useReducedMotion();
    const [paragraphIndex, setParagraphIndex] = useState(0);
    const [characterIndex, setCharacterIndex] = useState(0);
    const [finished, setFinished] = useState(false);
    const currentParagraphRef = useRef<HTMLParagraphElement>(null);
    const showCompleteLetter = finished || Boolean(reduceMotion);
    const letterParagraphs = useMemo(() => {
        const customBody = settings?.letter_body
            ?.split('\n')
            .map((text) => text.trim())
            .filter(Boolean);
        const body = customBody?.length
            ? customBody.map((text, index) => ({
                  text,
                  type: index === 0 ? 'handwriting' : undefined,
              }))
            : LETTER_PARAGRAPHS.slice(0, -1);

        return [
            ...body,
            {
                text: settings?.letter_signature || 'Only You.',
                type: 'signature',
            },
        ];
    }, [settings?.letter_body, settings?.letter_signature]);

    useEffect(() => {
        if (showCompleteLetter) {
            return;
        }

        const paragraph = letterParagraphs[paragraphIndex];
        const characters = Array.from(paragraph.text);

        if (characterIndex < characters.length) {
            const timeout = window.setTimeout(
                () => setCharacterIndex((current) => current + 1),
                characterDelay(characters[characterIndex]),
            );

            return () => window.clearTimeout(timeout);
        }

        if (paragraphIndex < letterParagraphs.length - 1) {
            const timeout = window.setTimeout(() => {
                setParagraphIndex((current) => current + 1);
                setCharacterIndex(0);
            }, 650);

            return () => window.clearTimeout(timeout);
        }

        const timeout = window.setTimeout(() => setFinished(true), 500);

        return () => window.clearTimeout(timeout);
    }, [characterIndex, letterParagraphs, paragraphIndex, showCompleteLetter]);

    useEffect(() => {
        if (paragraphIndex < 2 || showCompleteLetter) {
            return;
        }

        const timeout = window.setTimeout(() => {
            currentParagraphRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 120);

        return () => window.clearTimeout(timeout);
    }, [paragraphIndex, showCompleteLetter]);

    return (
        <SectionLayout
            title={settings?.letter_title || 'To My Peace, from Only You'}
            subtitle={
                settings?.letter_subtitle || 'Une lettre, fragment par fragment'
            }
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            maxWidth="max-w-xl"
        >
            <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
                {/* Decorative water effect */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-pink/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

                {!showCompleteLetter && (
                    <div className="relative mb-6 flex items-center justify-between gap-3 border-b border-pink/10 pb-4">
                        <div className="flex items-center gap-2 text-xs text-powder/65">
                            <motion.span
                                animate={{ rotate: [-5, 5, -5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Feather className="size-4" />
                            </motion.span>
                            La lettre s’écrit pour toi…
                        </div>
                        <button
                            type="button"
                            onClick={() => setFinished(true)}
                            className="flex items-center gap-1.5 rounded-full border border-pink/15 px-3 py-1.5 text-[10px] text-silver/55 transition hover:border-pink/30 hover:text-powder"
                        >
                            <SkipForward className="size-3" /> Tout afficher
                        </button>
                    </div>
                )}

                <div className="relative min-h-48 space-y-5">
                    {letterParagraphs.map((para, index) => {
                        if (!showCompleteLetter && index > paragraphIndex) {
                            return null;
                        }

                        const isCurrent =
                            !showCompleteLetter && index === paragraphIndex;
                        const visibleText =
                            showCompleteLetter || index < paragraphIndex
                                ? para.text
                                : Array.from(para.text)
                                      .slice(0, characterIndex)
                                      .join('');

                        return (
                            <motion.p
                                key={index}
                                ref={
                                    isCurrent ? currentParagraphRef : undefined
                                }
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                                className={
                                    para.type === 'handwriting'
                                        ? 'font-handwriting text-2xl leading-snug text-powder'
                                        : para.type === 'signature'
                                          ? 'text-gradient-pink mt-6 text-right font-handwriting text-3xl'
                                          : 'font-handwriting text-xl leading-relaxed text-cream/85 md:text-2xl'
                                }
                            >
                                {visibleText}
                                {isCurrent && (
                                    <motion.span
                                        aria-hidden="true"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                        }}
                                        className="ml-0.5 inline-block h-[1em] w-px translate-y-0.5 bg-pink"
                                    />
                                )}
                            </motion.p>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {showCompleteLetter && (
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-6 text-center font-handwriting text-base text-xs text-silver/30"
                    >
                        {settings?.letter_footer ||
                            'Si si, ma vie. Chaque mot est sincère.'}
                    </motion.p>
                )}
            </AnimatePresence>
        </SectionLayout>
    );
}
