import { useState, useEffect } from 'react';
import { useCountdownStore } from '../store/useCountdownStore';

export function useDevicePerformance() {
    const setQuality = useCountdownStore((state) => state.setQuality);
    const initialQuality = useCountdownStore((state) => state.quality);
    
    useEffect(() => {
        // Detect initial capabilities
        const cores = navigator.hardwareConcurrency || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const pixelRatio = window.devicePixelRatio || 1;
        
        let targetQuality = initialQuality;
        
        if (isMobile) {
            if (cores < 4 || pixelRatio < 2) {
                targetQuality = 'low';
            } else if (cores < 6) {
                targetQuality = 'medium';
            }
        }
        
        if (targetQuality !== initialQuality) {
            setQuality(targetQuality);
        }
        
        // Listen to reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e: MediaQueryListEvent) => {
            useCountdownStore.getState().setReducedMotion(e.matches);
        };
        
        // Initial setup
        useCountdownStore.getState().setReducedMotion(mediaQuery.matches);
        
        mediaQuery.addEventListener('change', handleMotionChange);
        return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }, [initialQuality, setQuality]);
}
