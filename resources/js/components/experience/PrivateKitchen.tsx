import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Check, Heart } from 'lucide-react';
import React, { useState } from 'react';
import { experienceApi } from '@/api/experienceApi';
import SectionLayout from '@/components/experience/SectionLayout';
import type { SectionProps } from '@/types/experience';

const MENU = [
    { label: 'Entrée', value: 'Nos premiers sourires de la journée' },
    { label: 'Plat principal', value: 'Préparé spécialement pour My Peace' },
    { label: 'Dessert', value: 'Le souvenir qu’il en reste' },
    { label: 'Boisson officielle', value: 'Ceres Tropical' },
    { label: 'Option préférée', value: 'Burger' },
    { label: 'Plat iconique', value: 'Carbonara' },
];

const CHOICES = {
    food: ['Carbonara', 'Burger'],
    drink: ['Ceres Tropical', 'Autre boisson'],
    location_type: ['À la maison', 'Au restaurant'],
    atmosphere: ['Ambiance calme', 'Soirée'],
    music_choice: ['R&B', 'Playlist surprise'],
    dessert_choice: ['Dessert', 'Snack'],
};

export default function PrivateKitchen({
    onBack,
    soundEnabled,
    onToggleSound,
}: SectionProps) {
    const [composing, setComposing] = useState(false);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);
    const [receiptVisible, setReceiptVisible] = useState(false);

    React.useEffect(() => {
        const t = setTimeout(() => setReceiptVisible(true), 400);

        return () => clearTimeout(t);
    }, []);

    const handleSelect = (key: string, value: string) => {
        setSelections((p) => ({ ...p, [key]: value }));
    };

    const handleSave = async () => {
        try {
            await experienceApi.saveNextDate(selections);
            setSaved(true);
        } catch {
            setSaved(false);
        }
    };

    const allSelected = Object.keys(CHOICES).every((k) => selections[k]);

    return (
        <SectionLayout
            title="Only You's Private Kitchen"
            subtitle="The day I cooked for you"
            onBack={onBack}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
        >
            {/* Receipt */}
            <AnimatePresence>
                {receiptVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -30, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="glass relative mb-6 overflow-hidden rounded-2xl p-5"
                    >
                        <div className="absolute top-0 right-0 left-0 flex h-6 items-end justify-around pb-1">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 w-1 rounded-b-full bg-night-deep/60"
                                />
                            ))}
                        </div>

                        <div className="pt-6 text-center">
                            <Receipt className="mx-auto mb-2 h-6 w-6 text-pink" />
                            <h3 className="font-heading text-lg text-cream">
                                Only You's Private Kitchen
                            </h3>
                            <p className="text-xs text-silver/40">
                                Table For Two
                            </p>
                        </div>

                        <div className="mt-4 space-y-2 border-t border-dashed border-silver/20 pt-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-silver/50">Client</span>
                                <span className="text-powder">My Peace</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-silver/50">Chef</span>
                                <span className="text-powder">Only You</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-silver/50">Date</span>
                                <span className="text-powder">
                                    Configurable
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 border-t border-dashed border-silver/20 pt-4">
                            {MENU.map((item) => (
                                <div key={item.label}>
                                    <p className="text-[10px] tracking-wider text-silver/40 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-sm text-cream/80">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border-t border-dashed border-silver/20 pt-4 text-center">
                            <p className="text-xs text-silver/50">Total</p>
                            <p className="font-handwriting text-xl text-powder">
                                Un sourire
                            </p>
                            <p className="mt-1 text-[10px] text-silver/30">
                                Paiement: déjà réglé avec mon cœur
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Compose module */}
            {!composing ? (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setComposing(true)}
                    className="glass-pink w-full rounded-2xl p-4 text-center transition-all hover:bg-pink/10 active:scale-95"
                >
                    <p className="font-body text-sm text-powder">
                        Compose notre prochain menu
                    </p>
                    <p className="mt-1 text-xs text-silver/40">
                        Choisis tes préférences
                    </p>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {Object.entries(CHOICES).map(([key, options]) => (
                        <div key={key}>
                            <p className="mb-2 text-xs tracking-wider text-silver/50 uppercase">
                                {key.replace(/_/g, ' ')}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(key, opt)}
                                        className={`rounded-xl px-3 py-2.5 text-sm transition-all active:scale-95 ${
                                            selections[key] === opt
                                                ? 'glass-pink glow-pink text-powder'
                                                : 'glass text-silver/60 hover:text-cream'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleSave}
                        disabled={!allSelected || saved}
                        className="glow-pink w-full rounded-2xl bg-gradient-to-r from-pink to-pink-vibrant py-3.5 font-body text-sm text-white transition-all active:scale-95 disabled:opacity-40"
                    >
                        {saved ? (
                            <span className="flex items-center justify-center gap-2">
                                <Check className="h-4 w-4" /> Next Date Recipe
                                enregistré
                            </span>
                        ) : (
                            'Générer notre Next Date Recipe'
                        )}
                    </button>

                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-2xl p-5 text-center"
                        >
                            <Heart className="mx-auto mb-2 h-6 w-6 fill-pink text-pink" />
                            <p className="font-heading text-lg text-cream">
                                Next Date Recipe
                            </p>
                            <div className="mt-3 space-y-1">
                                {Object.entries(selections).map(([k, v]) => (
                                    <div
                                        key={k}
                                        className="flex justify-between text-xs"
                                    >
                                        <span className="text-silver/50">
                                            {k.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-powder">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 font-handwriting text-base text-powder/70">
                                Jean-Michel a bien reçu ta sélection. Si si, ma
                                vie. ❤️
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </SectionLayout>
    );
}
