import { AnimatePresence, motion } from 'framer-motion';
import { AudioLines, Sparkles, VolumeX } from 'lucide-react';
import { useCountdown } from '../../../hooks/useCountdown';
import { useCountdownStore } from '../../../store/useCountdownStore';

export function CountdownOverlay() {
    const {
        config,
        isExploreMode,
        setExploreMode,
        isSoundEnabled,
        setSoundEnabled,
        reducedMotion,
        setReducedMotion,
        isRevealed,
    } = useCountdownStore();

    const { isCompleted } = useCountdown();

    if (!config || isRevealed) {
        return null;
    }

    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between overflow-hidden px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isExploreMode ? 0 : 1, y: 0 }}
                transition={{ duration: 1 }}
                className="pointer-events-auto flex items-start justify-between gap-3"
            >
                <div className="max-w-[58%] min-w-0 sm:max-w-none">
                    <div className="mb-2 flex items-center gap-2 text-[9px] font-medium tracking-[0.32em] text-[#ff9dc5] uppercase sm:text-[10px]">
                        <span className="h-px w-5 bg-gradient-to-r from-[#ff7eb3] to-transparent" />
                        Chapter 05
                    </div>
                    <h1 className="font-serif text-lg leading-[1.08] tracking-[0.12em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-xl md:text-2xl">
                        {config.title}
                    </h1>
                    <p className="mt-2 text-[11px] tracking-wide text-white/48 sm:text-sm">
                        {config.subtitle}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        aria-label={
                            reducedMotion
                                ? 'Activer la scène 3D'
                                : 'Réduire les animations'
                        }
                        title={
                            reducedMotion
                                ? 'Activer la scène 3D'
                                : 'Réduire les animations'
                        }
                        onClick={() => setReducedMotion(!reducedMotion)}
                        className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.055] px-3 text-white/65 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all hover:border-[#ff7eb3]/45 hover:bg-white/10 hover:text-white active:scale-95 sm:px-4"
                    >
                        <Sparkles className="size-4" strokeWidth={1.6} />
                        <span className="hidden text-[10px] tracking-[0.18em] uppercase sm:inline">
                            {reducedMotion ? 'Activer 3D' : 'Mode calme'}
                        </span>
                    </button>

                    {config.is_sound_enabled && (
                        <button
                            type="button"
                            aria-label={
                                isSoundEnabled
                                    ? "Couper le son d'ambiance"
                                    : "Activer le son d'ambiance"
                            }
                            title={
                                isSoundEnabled
                                    ? "Couper le son d'ambiance"
                                    : "Activer le son d'ambiance"
                            }
                            onClick={() => setSoundEnabled(!isSoundEnabled)}
                            className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.055] px-3 text-white/65 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all hover:border-[#7eb3ff]/45 hover:bg-white/10 hover:text-white active:scale-95 sm:px-4"
                        >
                            {isSoundEnabled ? (
                                <AudioLines
                                    className="size-4"
                                    strokeWidth={1.6}
                                />
                            ) : (
                                <VolumeX className="size-4" strokeWidth={1.6} />
                            )}
                            <span className="hidden text-[10px] tracking-[0.18em] uppercase sm:inline">
                                {isSoundEnabled ? 'Son actif' : 'Ambiance'}
                            </span>
                        </button>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="pointer-events-auto mx-auto flex w-full max-w-xl flex-col items-center gap-4 sm:gap-5"
            >
                <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070710]/58 px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-8 sm:py-6">
                    <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7eb3]/60 to-transparent" />
                    <AnimatePresence mode="wait">
                        {!isExploreMode ? (
                            <motion.p
                                key="main-msg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center font-serif text-base leading-relaxed text-white/82 italic sm:text-xl"
                            >
                                {config.main_message}
                            </motion.p>
                        ) : (
                            <motion.p
                                key="hidden-msg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center font-serif text-base leading-relaxed text-[#ff9dc5] italic drop-shadow-md sm:text-xl"
                            >
                                {config.hidden_message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {!isCompleted &&
                    !reducedMotion &&
                    config.is_3d_scene_enabled && (
                        <button
                            type="button"
                            onPointerDown={() => setExploreMode(true)}
                            onPointerUp={() => setExploreMode(false)}
                            onPointerLeave={() => setExploreMode(false)}
                            onPointerCancel={() => setExploreMode(false)}
                            className="group flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/18 bg-white/[0.065] px-6 text-[10px] tracking-[0.22em] text-white/75 uppercase shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all hover:border-[#ff7eb3]/50 hover:bg-white/10 hover:text-white active:scale-[0.98] sm:px-8 sm:text-xs"
                        >
                            <span className="size-1.5 rounded-full bg-[#ff7eb3] shadow-[0_0_12px_#ff7eb3] transition-transform group-hover:scale-125" />
                            Maintenir pour explorer
                        </button>
                    )}
            </motion.div>
        </div>
    );
}
