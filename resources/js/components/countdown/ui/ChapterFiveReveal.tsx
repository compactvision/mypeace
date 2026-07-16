import { useCountdownStore } from '../../../store/useCountdownStore';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function ChapterFiveReveal() {
    const { isRevealed, config } = useCountdownStore();

    useEffect(() => {
        if (isRevealed) {
            // Trigger light confetti
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff7eb3', '#ffffff', '#7eb3ff']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff7eb3', '#ffffff', '#7eb3ff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [isRevealed]);

    if (!isRevealed || !config) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 2 }} // wait for 3D camera to zoom
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff7eb3]/20 via-transparent to-[#7eb3ff]/20 pointer-events-none" />
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 3 }}
                    className="text-center z-10"
                >
                    <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest drop-shadow-lg mb-6">
                        CHAPTER FIVE
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 italic font-light mb-2">
                        {config.end_message}
                    </p>
                    <p className="text-white/60 text-sm tracking-widest uppercase mb-12">
                        {config.signature}
                    </p>

                    <button 
                        onClick={() => router.visit('/')}
                        className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white text-white px-8 py-4 rounded-full tracking-widest uppercase text-sm transition-all duration-500 shadow-[0_0_20px_rgba(255,126,179,0.3)] hover:shadow-[0_0_30px_rgba(255,126,179,0.6)]"
                    >
                        Unlock our story
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
