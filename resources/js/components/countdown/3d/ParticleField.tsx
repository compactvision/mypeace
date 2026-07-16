import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCountdownStore } from '../../../store/useCountdownStore';

export function ParticleField() {
    const { quality, reducedMotion } = useCountdownStore();

    const count = quality === 'high' ? 1000 : quality === 'medium' ? 400 : 100;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random positions and velocities
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = Math.random() * 20 - 5;
            const z = (Math.random() - 0.5) * 40 - 10;
            const speed = Math.random() * 0.02 + 0.01;
            temp.push({ x, y, z, speed });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current || reducedMotion) return;

        const mesh = meshRef.current;

        particles.forEach((particle, i) => {
            // Drift slowly
            particle.y += particle.speed;
            if (particle.y > 15) {
                particle.y = -5;
            }

            // Subtle wave
            const wave = Math.sin(state.clock.elapsedTime + i) * 0.5;

            dummy.position.set(particle.x + wave, particle.y, particle.z);
            dummy.scale.setScalar(
                Math.sin(state.clock.elapsedTime * particle.speed * 10) * 0.5 +
                    0.5,
            );
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffb6c1" transparent opacity={0.6} />
        </instancedMesh>
    );
}
