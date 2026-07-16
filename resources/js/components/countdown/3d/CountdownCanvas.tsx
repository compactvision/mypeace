import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useCountdownStore } from '../../../store/useCountdownStore';
import { RiverScene } from './RiverScene';

export function CountdownCanvas() {
    const { config, reducedMotion, quality } = useCountdownStore();

    // In reduced motion, we completely disable the WebGL 3D scene
    // to strictly respect user's accessibility choice and save power.
    if (reducedMotion || !config?.is_3d_scene_enabled) {
        return null;
    }

    // Determine pixel ratio based on quality setting
    const dpr: [number, number] =
        quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [1, 1];

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#030308]">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_42%,rgba(126,179,255,0.09),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(255,126,179,0.09),transparent_42%)]" />
            <Canvas
                className="relative z-[1]"
                shadows={quality === 'high'}
                dpr={dpr}
                camera={{ position: [0, 0, 12], fov: 45 }}
                gl={{
                    antialias: quality !== 'low',
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
            >
                <Suspense fallback={null}>
                    <RiverScene />
                    <Preload all />
                </Suspense>
            </Canvas>
            <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(3,3,8,0.3)_0%,transparent_22%,transparent_68%,rgba(3,3,8,0.82)_100%)] shadow-[inset_0_0_120px_rgba(0,0,0,0.7)] sm:shadow-[inset_0_0_180px_rgba(0,0,0,0.72)]" />
        </div>
    );
}
