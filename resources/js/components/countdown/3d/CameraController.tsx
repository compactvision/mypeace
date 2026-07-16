import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCountdownStore } from '../../../store/useCountdownStore';
import gsap from 'gsap';

export function CameraController() {
    const { camera, pointer } = useThree();
    const { isExploreMode, isRevealed, reducedMotion } = useCountdownStore();
    const targetPosition = useRef(new THREE.Vector3(0, 0, 10));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        if (isRevealed) {
            // Finale sequence: fly through the portal
            gsap.to(camera.position, {
                z: -20,
                duration: 4,
                ease: "power2.inOut"
            });
            return;
        }

        if (isExploreMode) {
            // Move closer and peek
            gsap.to(targetPosition.current, {
                x: 0,
                y: 1,
                z: 4,
                duration: 2,
                ease: "power2.inOut"
            });
            gsap.to(targetLookAt.current, {
                y: -1,
                duration: 2,
                ease: "power2.inOut"
            });
        } else {
            // Normal position
            gsap.to(targetPosition.current, {
                x: 0,
                y: 0,
                z: 12,
                duration: 2,
                ease: "power2.out"
            });
            gsap.to(targetLookAt.current, {
                y: 0,
                duration: 2,
                ease: "power2.out"
            });
        }
    }, [isExploreMode, isRevealed, camera]);

    useFrame(() => {
        if (isRevealed) return; // GSAP handles the reveal animation fully

        // Subtle parallax with mouse
        if (!reducedMotion && !isExploreMode) {
            const parallaxX = pointer.x * 1.5;
            const parallaxY = pointer.y * 1.5;
            
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition.current.x + parallaxX, 0.05);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosition.current.y + parallaxY, 0.05);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition.current.z, 0.05);
        } else {
            camera.position.lerp(targetPosition.current, 0.05);
        }
        
        camera.lookAt(targetLookAt.current);
    });

    return null;
}
