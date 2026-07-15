import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
    const form = useForm({ email: '' });
    const status = (usePage().props.flash as { status?: string } | undefined)
        ?.status;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/forgot-password');
    };

    return (
        <AuthLayout
            icon={Mail}
            title="Mot de passe oublié"
            subtitle="Nous t’enverrons un lien sécurisé"
            footer={
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    <ArrowLeft className="mr-1 inline h-3 w-3" />
                    Retour à la connexion
                </Link>
            }
        >
            {status ? (
                <p className="rounded-xl bg-primary/10 p-4 text-center text-sm text-foreground">
                    {status}
                </p>
            ) : (
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse e-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            required
                        />
                        {form.errors.email && (
                            <p className="text-xs text-destructive">
                                {form.errors.email}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="h-12 w-full"
                        disabled={form.processing}
                    >
                        {form.processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi…
                            </>
                        ) : (
                            'Envoyer le lien'
                        )}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
