import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import React from 'react';
import type { SectionLayoutProps } from '@/types/experience';

export default function SectionLayout({
    title,
    subtitle,
    onBack,
    soundEnabled,
    onToggleSound,
    children,
    maxWidth = 'max-w-2xl',
}: SectionLayoutProps) {
    return (
        <div className="water-bg grain relative min-h-screen pb-16">
            <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between p-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="touch-target glass flex items-center justify-center rounded-full text-silver transition-colors hover:text-powder"
                        aria-label="Retour"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                )}
                {onToggleSound && (
                    <button
                        onClick={onToggleSound}
                        className="touch-target glass ml-auto flex items-center justify-center rounded-full text-silver transition-colors hover:text-powder"
                        aria-label={
                            soundEnabled
                                ? 'Désactiver le son'
                                : 'Activer le son'
                        }
                    >
                        {soundEnabled ? (
                            <Volume2 className="h-5 w-5" />
                        ) : (
                            <VolumeX className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            <div className={`px-4 pt-20 ${maxWidth} mx-auto`}>
                {title && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-gradient-pink font-heading text-3xl leading-tight md:text-4xl">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 text-sm tracking-wide text-silver/70">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                )}
                {children}
            </div>
        </div>
    );
}
