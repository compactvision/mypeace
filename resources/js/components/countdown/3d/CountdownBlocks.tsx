import { useThree } from '@react-three/fiber';
import { useCountdown } from '../../../hooks/useCountdown';
import { CountdownUnit } from './CountdownUnit';

export function CountdownBlocks() {
    const { timeLeft } = useCountdown();
    const { viewport } = useThree();
    const isMobile = viewport.width < 7;
    const mobileX = viewport.width * 0.255;
    const mobileScale = Math.min(0.78, viewport.width / 5.9);

    // Responsive positioning
    const layout = isMobile
        ? {
              days: [-mobileX, 1.5, 0],
              hours: [mobileX, 1.5, 0],
              minutes: [-mobileX, -1.35, 0],
              seconds: [mobileX, -1.35, 0],
          }
        : {
              days: [-6, 0, 0],
              hours: [-2, 0, 0],
              minutes: [2, 0, 0],
              seconds: [6, 0, 0],
          };

    return (
        <group position={[0, isMobile ? 0.35 : 0, 0]}>
            <CountdownUnit
                value={timeLeft.days}
                label="Jours"
                position={layout.days as [number, number, number]}
                compact={isMobile}
                unitScale={isMobile ? mobileScale : 1}
            />
            <CountdownUnit
                value={timeLeft.hours}
                label="Heures"
                position={layout.hours as [number, number, number]}
                compact={isMobile}
                unitScale={isMobile ? mobileScale : 1}
            />
            <CountdownUnit
                value={timeLeft.minutes}
                label="Minutes"
                position={layout.minutes as [number, number, number]}
                compact={isMobile}
                unitScale={isMobile ? mobileScale : 1}
            />
            <CountdownUnit
                value={timeLeft.seconds}
                label="Secondes"
                position={layout.seconds as [number, number, number]}
                compact={isMobile}
                unitScale={isMobile ? mobileScale : 1}
            />
        </group>
    );
}
