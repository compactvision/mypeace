import { motion } from 'framer-motion';
import React from 'react';
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

export default function InteractiveLetter({
    onBack,
    soundEnabled,
    onToggleSound,
}: SectionProps) {
    return (
        <SectionLayout
            title="To My Peace, from Only You"
            subtitle="Une lettre, fragment par fragment"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            maxWidth="max-w-xl"
        >
            <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
                {/* Decorative water effect */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-pink/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

                <div className="relative space-y-5">
                    {LETTER_PARAGRAPHS.map((para, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.8 }}
                            className={
                                para.type === 'handwriting'
                                    ? 'font-handwriting text-2xl leading-snug text-powder'
                                    : para.type === 'signature'
                                      ? 'text-gradient-pink mt-6 text-right font-handwriting text-3xl'
                                      : 'font-body text-base leading-relaxed text-cream/80'
                            }
                        >
                            {para.text}
                        </motion.p>
                    ))}
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center font-handwriting text-base text-xs text-silver/30"
            >
                Si si, ma vie. Chaque mot est sincère.
            </motion.p>
        </SectionLayout>
    );
}
