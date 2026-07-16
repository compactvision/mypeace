import { useEffect } from 'react';
import { useCountdownStore } from '../../../store/useCountdownStore';

function createRiverNoise(context: AudioContext) {
    const duration = 5;
    const buffer = context.createBuffer(
        1,
        context.sampleRate * duration,
        context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    let previous = 0;

    for (let index = 0; index < samples.length; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = (previous + 0.025 * white) / 1.025;
        samples[index] = previous * 3.2;
    }

    const source = context.createBufferSource();
    const lowPass = context.createBiquadFilter();
    const highPass = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = buffer;
    source.loop = true;
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 2400;
    highPass.type = 'highpass';
    highPass.frequency.value = 120;
    gain.gain.value = 0.16;

    source.connect(lowPass);
    lowPass.connect(highPass);
    highPass.connect(gain);
    gain.connect(context.destination);
    source.start();

    return source;
}

export function SoundController() {
    const isSoundEnabled = useCountdownStore((state) => state.isSoundEnabled);

    useEffect(() => {
        if (!isSoundEnabled) {
            return;
        }

        const AudioContextClass = window.AudioContext;
        const context = new AudioContextClass();
        const source = createRiverNoise(context);

        void context.resume().catch(() => {
            useCountdownStore.getState().setSoundEnabled(false);
        });

        return () => {
            source.stop();
            void context.close();
        };
    }, [isSoundEnabled]);

    return null;
}
