import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useCountdownStore } from '../../../store/useCountdownStore';

export function WaterSurface() {
    const { quality } = useCountdownStore();
    const isHighQuality = quality === 'high';

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100]} />
            {isHighQuality ? (
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={80}
                    roughness={0.8}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050510"
                    metalness={0.5}
                    mirror={0.5}
                />
            ) : (
                <meshStandardMaterial color="#050510" roughness={0.2} metalness={0.8} />
            )}
        </mesh>
    );
}
