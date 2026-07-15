import { Link, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/login', { onFinish: () => form.reset('password') });
    };

    return (
        <AuthLayout
            icon={LogIn}
            title="Bienvenue"
            subtitle="Connecte-toi à l’espace d’administration"
            footer={
                <>
                    Pas encore de compte ?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Créer un compte
                    </Link>
                </>
            }
        >
            {form.errors.email && (
                <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {form.errors.email}
                </div>
            )}
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                        <Mail
                            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            className="h-12 pl-10"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:underline"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock
                            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                            className="h-12 pl-10"
                            required
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className="h-12 w-full font-medium"
                    disabled={form.processing}
                >
                    {form.processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion…
                        </>
                    ) : (
                        'Se connecter'
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
