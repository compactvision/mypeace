import { useState, useEffect, useCallback } from 'react';
import { useCountdownStore } from '../store/useCountdownStore';

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function useCountdown() {
    const { config, serverTimeOffset, isRevealed, revealChapterFive } = useCountdownStore();
    
    // Total duration for progress (from now minus 5 months, approx 150 days)
    // We'll calculate progress dynamically based on a fixed start date just for visual effect
    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<CountdownTime>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeLeft = useCallback(() => {
        if (!config || !config.target_date) return;

        // Corrected current time using the server offset
        const now = Date.now() + serverTimeOffset;
        const target = new Date(config.target_date).getTime();
        const difference = target - now;

        if (difference <= 0 || isRevealed || config.manual_unlock) {
            setIsCompleted(true);
            if (!isRevealed) {
                // If it naturally hit zero, trigger reveal
                revealChapterFive();
            }
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setProgress(100);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });

        // Calculate visual progress (e.g., last 150 days)
        const totalDuration = 150 * 24 * 60 * 60 * 1000; 
        const elapsed = totalDuration - difference;
        const currentProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
        setProgress(currentProgress);

    }, [config, serverTimeOffset, isRevealed, revealChapterFive]);

    useEffect(() => {
        calculateTimeLeft(); // initial calc
        const timer = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return { timeLeft, isCompleted, progress };
}
