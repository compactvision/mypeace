import { Link, router } from '@inertiajs/react';
import {
    Image,
    Heart,
    Clock,
    CalendarHeart,
    Gift,
    UtensilsCrossed,
    Sparkles,
    LogOut,
} from 'lucide-react';

type Stats = {
    memories: number;
    loveReasons: number;
    timeline: number;
    socialPosts: number;
    finalAnswers: number;
    nextDates: number;
};
type FinalAnswer = { id: number; answer: string; created_at: string };
type NextDate = {
    id: number;
    food: string;
    drink: string;
    location_type: string;
    created_at: string;
};
type Props = {
    stats: Stats;
    recentAnswers: FinalAnswer[];
    recentDates: NextDate[];
};

export default function AdminPanel({
    stats,
    recentAnswers,
    recentDates,
}: Props) {
    const sections = [
        { label: 'Memories', icon: Image, count: stats.memories },
        { label: 'Love Reasons', icon: Heart, count: stats.loveReasons },
        { label: 'Timeline', icon: Clock, count: stats.timeline },
        { label: 'Social Posts', icon: Sparkles, count: stats.socialPosts },
        { label: 'Réponses finales', icon: Gift, count: stats.finalAnswers },
        {
            label: 'Prochains rendez-vous',
            icon: CalendarHeart,
            count: stats.nextDates,
        },
    ];

    return (
        <div className="mx-auto min-h-screen max-w-4xl bg-background p-6 text-foreground">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground">
                        Only You × My Peace
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="text-sm text-primary hover:underline"
                    >
                        ← Voir l'expérience
                    </Link>
                    <button
                        onClick={() => router.post('/logout')}
                        className="touch-target glass flex items-center gap-2 rounded-xl px-3 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4" />
                        Quitter
                    </button>
                </div>
            </div>

            {/* Stats grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {sections.map((s) => {
                    const Icon = s.icon;

                    return (
                        <div key={s.label} className="glass rounded-2xl p-4">
                            <Icon className="mb-2 h-5 w-5 text-primary" />
                            <p className="font-heading text-2xl">{s.count}</p>
                            <p className="text-xs text-muted-foreground">
                                {s.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Recent activity */}
            <div className="grid gap-4 md:grid-cols-3">
                {recentAnswers.length > 0 && (
                    <div className="glass rounded-2xl p-4">
                        <h3 className="mb-3 flex items-center gap-2 font-body text-sm">
                            <Gift className="h-4 w-4 text-primary" /> Final
                            Answers
                        </h3>
                        {recentAnswers.map((a, i) => (
                            <p
                                key={i}
                                className="mb-2 text-xs text-muted-foreground"
                            >
                                {a.answer}
                            </p>
                        ))}
                    </div>
                )}
                {recentDates.length > 0 && (
                    <div className="glass rounded-2xl p-4">
                        <h3 className="mb-3 flex items-center gap-2 font-body text-sm">
                            <UtensilsCrossed className="h-4 w-4 text-primary" />{' '}
                            Next Date Choices
                        </h3>
                        {recentDates.map((d, i) => (
                            <p
                                key={i}
                                className="mb-2 text-xs text-muted-foreground"
                            >
                                {d.food} · {d.drink} · {d.location_type}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass mt-8 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">
                    Les contenus sont maintenant gérés localement dans Laravel.
                    Le catalogue se trouve dans la table
                    <code className="mx-1 text-powder">
                        experience_contents
                    </code>{' '}
                    et les choix reçus dans
                    <code className="mx-1 text-powder">
                        experience_responses
                    </code>
                    .
                </p>
            </div>
        </div>
    );
}
