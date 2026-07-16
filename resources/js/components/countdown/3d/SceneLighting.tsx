import { Environment, Lightformer } from '@react-three/drei';

export function SceneLighting() {
    return (
        <>
            <ambientLight intensity={0.2} color="#0a0a2a" />
            <directionalLight position={[10, 10, 5]} intensity={0.5} color="#cbd5e1" />
            <spotLight position={[-10, 20, 10]} angle={0.3} penumbra={1} intensity={1} color="#ff7eb3" />
            
            {/* Creates beautiful reflections on the water and chrome texts without external HDRs */}
            <Environment resolution={256} environmentIntensity={0.5}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <Lightformer form="rect" intensity={2} position={[0, 10, -10]} scale={[20, 10, 1]} color="#ff7eb3" />
                    <Lightformer form="rect" intensity={2} position={[-10, 10, 10]} scale={[20, 10, 1]} color="#7eb3ff" />
                    <Lightformer form="circle" intensity={4} position={[10, 10, 10]} scale={[10, 10, 1]} color="#ffffff" />
                </group>
            </Environment>
        </>
    );
}
