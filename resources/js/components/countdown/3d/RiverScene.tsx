import { Suspense } from 'react';
import { SceneLighting } from './SceneLighting';
import { ParticleField } from './ParticleField';
import { WaterSurface } from './WaterSurface';
import { TimePortal } from './TimePortal';
import { CountdownBlocks } from './CountdownBlocks';
import { CameraController } from './CameraController';
import { useCountdownStore } from '../../../store/useCountdownStore';
import { Sparkles, Stars } from '@react-three/drei';

export function RiverScene() {
    const { isRevealed, quality } = useCountdownStore();

    return (
        <>
            <CameraController />
            <SceneLighting />
            
            {/* Background elements */}
            <color attach="background" args={['#030308']} />
            <fog attach="fog" args={['#030308', 10, 40]} />
            
            {!isRevealed && (
                <>
                    <TimePortal />
                    <CountdownBlocks />
                </>
            )}

            <WaterSurface />
            <ParticleField />
            
            {quality !== 'low' && (
                <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            )}
        </>
    );
}
