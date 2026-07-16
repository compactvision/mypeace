import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    footer?: ReactNode;
    children: ReactNode;
};

export default function AuthLayout({
    icon: Icon,
    title,
    subtitle,
    footer,
    children,
}: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="mb-10 text-center">
                    <div className="relative mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-night-deep/80 shadow-[0_0_35px_rgba(236,72,153,0.16)]">
                        <img
                            src="/brand/my-peace-logo.png"
                            alt="My Peace"
                            className="h-16 w-16 object-contain"
                        />
                        <Icon
                            className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-primary p-1.5 text-primary-foreground shadow-lg"
                            aria-hidden="true"
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    {children}
                </div>
                {footer && (
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {footer}
                    </p>
                )}
            </div>
        </div>
    );
}
