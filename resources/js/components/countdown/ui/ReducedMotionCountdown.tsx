import { useCountdown } from '../../../hooks/useCountdown';
import { useCountdownStore } from '../../../store/useCountdownStore';

export function ReducedMotionCountdown() {
    const { reducedMotion, isRevealed, config } = useCountdownStore();
    const { timeLeft, progress } = useCountdown();

    if (
        (!reducedMotion && config?.is_3d_scene_enabled !== false) ||
        isRevealed ||
        !config
    ) {
        return null;
    }

    const units = [
        { value: timeLeft.days, label: 'Jours' },
        { value: timeLeft.hours, label: 'Heures' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Secondes' },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-[#030308] px-6 pt-24 pb-52 sm:pt-28 sm:pb-48">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(126,179,255,0.1),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(255,126,179,0.09),transparent_40%)]" />

            <div className="relative z-10 grid w-full max-w-sm grid-cols-2 gap-x-8 gap-y-7 sm:flex sm:max-w-3xl sm:justify-center sm:gap-10 md:gap-14">
                {units.map((unit) => (
                    <div
                        key={unit.label}
                        className="flex min-w-0 flex-col items-center"
                    >
                        <span className="text-4xl font-light tracking-tighter text-white tabular-nums drop-shadow-[0_0_22px_rgba(126,179,255,0.22)] sm:text-6xl md:text-7xl">
                            {unit.value.toString().padStart(2, '0')}
                        </span>
                        <span className="mt-2 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[9px] tracking-[0.24em] text-white/55 uppercase sm:text-xs">
                            {unit.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="relative z-0 mx-auto mt-8 size-36 sm:mt-10 sm:size-52">
                <div className="absolute inset-0 rounded-full border border-[#ff7eb3]/18 shadow-[0_0_60px_rgba(255,126,179,0.08)]" />
                <div
                    className="absolute inset-0 rounded-full border-t border-r border-[#ff7eb3]/80"
                    style={{ transform: `rotate(${progress * 3.6}deg)` }}
                />
                <div
                    className="absolute inset-4 rounded-full bg-[#ff7eb3] blur-3xl"
                    style={{ opacity: 0.08 + (progress / 100) * 0.24 }}
                />
                <div className="absolute inset-[28%] rounded-full border border-[#7eb3ff]/20 bg-[#7eb3ff]/5" />
            </div>
        </div>
    );
}
