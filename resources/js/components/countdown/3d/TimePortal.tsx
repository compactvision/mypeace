import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCountdownStore } from '../../../store/useCountdownStore';
import { useCountdown } from '../../../hooks/useCountdown';

export function TimePortal() {
    const groupRef = useRef<THREE.Group>(null);
    const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const { progress } = useCountdown();
    const { quality, reducedMotion } = useCountdownStore();

    // Progress is 0 to 100
    const normalizedProgress = progress / 100;
    
    useFrame((state) => {
        if (!groupRef.current || reducedMotion) return;
        
        // Rotate portal rings slowly
        groupRef.current.rotation.z += 0.002;
        
        // Pulse effect based on progress
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
        const scale = 1 + (normalizedProgress * 0.5) * pulse;
        groupRef.current.scale.set(scale, scale, scale);

        if (ringMaterialRef.current) {
            // Brighten as it gets closer
            const intensity = 0.5 + normalizedProgress * 2;
            ringMaterialRef.current.color.setHSL(0.85, 0.8, intensity); // Pinkish glow
        }
    });

    // Determine number of rings based on quality
    const ringCount = quality === 'high' ? 5 : quality === 'medium' ? 3 : 1;

    return (
        <group position={[0, 0, -15]} ref={groupRef}>
            {Array.from({ length: ringCount }).map((_, i) => (
                <mesh key={i} position={[0, 0, -i * 2]}>
                    <ringGeometry args={[10 + i, 10.2 + i, 64]} />
                    <meshBasicMaterial 
                        ref={i === 0 ? ringMaterialRef : null}
                        color="#ff7eb3" 
                        transparent 
                        opacity={(1 - i * 0.15) * (0.2 + normalizedProgress * 0.8)} 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
            ))}
            
            {/* Core light */}
            <pointLight 
                color="#ff7eb3" 
                intensity={1 + normalizedProgress * 5} 
                distance={50} 
            />
        </group>
    );
}
