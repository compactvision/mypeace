import { Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useCountdownStore } from '../../../store/useCountdownStore';

interface CountdownUnitProps {
    value: number;
    label: string;
    position: [number, number, number];
    compact?: boolean;
    unitScale?: number;
}

type SegmentName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

const DIGIT_SEGMENTS: Record<string, SegmentName[]> = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'd', 'e', 'g'],
    '3': ['a', 'b', 'c', 'd', 'g'],
    '4': ['b', 'c', 'f', 'g'],
    '5': ['a', 'c', 'd', 'f', 'g'],
    '6': ['a', 'c', 'd', 'e', 'f', 'g'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'c', 'd', 'f', 'g'],
};

const SEGMENT_TRANSFORMS: Record<
    SegmentName,
    { position: [number, number, number]; rotation?: [number, number, number] }
> = {
    a: { position: [0, 0.92, 0] },
    b: { position: [0.52, 0.48, 0], rotation: [0, 0, Math.PI / 2] },
    c: { position: [0.52, -0.48, 0], rotation: [0, 0, Math.PI / 2] },
    d: { position: [0, -0.92, 0] },
    e: { position: [-0.52, -0.48, 0], rotation: [0, 0, Math.PI / 2] },
    f: { position: [-0.52, 0.48, 0], rotation: [0, 0, Math.PI / 2] },
    g: { position: [0, 0, 0] },
};

function Digit({
    digit,
    x,
    highQuality,
}: {
    digit: string;
    x: number;
    highQuality: boolean;
}) {
    return (
        <group position={[x, 0, 0]}>
            {DIGIT_SEGMENTS[digit]?.map((segment) => {
                const transform = SEGMENT_TRANSFORMS[segment];

                return (
                    <mesh
                        key={segment}
                        position={transform.position}
                        rotation={transform.rotation}
                        castShadow={highQuality}
                    >
                        <boxGeometry
                            args={[0.82, 0.16, highQuality ? 0.28 : 0.18]}
                        />
                        <meshPhysicalMaterial
                            color="#dbe5f1"
                            emissive="#7eb3ff"
                            emissiveIntensity={highQuality ? 0.12 : 0.05}
                            metalness={0.82}
                            roughness={highQuality ? 0.16 : 0.28}
                            clearcoat={highQuality ? 1 : 0.35}
                            clearcoatRoughness={0.12}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

export function CountdownUnit({
    value,
    label,
    position,
    compact = false,
    unitScale = 1,
}: CountdownUnitProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prevValue = useRef(value);
    const { quality, reducedMotion } = useCountdownStore();
    const displayValue = value.toString().padStart(2, '0');

    useFrame(() => {
        if (reducedMotion || !groupRef.current || prevValue.current === value) {
            return;
        }

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            Math.PI * 2,
            0.1,
        );

        if (groupRef.current.rotation.x > Math.PI * 1.9) {
            groupRef.current.rotation.x = 0;
            prevValue.current = value;
        }
    });

    const isHighQuality = quality === 'high';
    const digitSpacing = 1.25;
    const startX = -((displayValue.length - 1) * digitSpacing) / 2;

    return (
        <group position={position} scale={unitScale}>
            <group ref={groupRef}>
                <Float
                    speed={reducedMotion ? 0 : 2}
                    rotationIntensity={reducedMotion ? 0 : 0.2}
                    floatIntensity={reducedMotion ? 0 : 0.5}
                    floatingRange={[-0.1, 0.1]}
                >
                    {displayValue.split('').map((digit, index) => (
                        <Digit
                            key={`${index}-${digit}`}
                            digit={digit}
                            x={startX + index * digitSpacing}
                            highQuality={isHighQuality}
                        />
                    ))}

                    <pointLight
                        position={[0, 1, 0.5]}
                        intensity={0.5}
                        color={label === 'Jours' ? '#ff7eb3' : '#7eb3ff'}
                        distance={3}
                    />
                </Float>
            </group>

            <Html
                center
                position={[0, -1.4, 0.2]}
                distanceFactor={compact ? 7 : 8}
            >
                <span className="pointer-events-none rounded-full border border-white/14 bg-[#05050d]/85 px-2.5 py-1 text-[10px] font-semibold tracking-[0.25em] whitespace-nowrap text-white/80 uppercase shadow-[0_0_20px_rgba(126,179,255,0.16)] backdrop-blur-md select-none sm:text-[11px]">
                    {label}
                </span>
            </Html>
        </group>
    );
}
