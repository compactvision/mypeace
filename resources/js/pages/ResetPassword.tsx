import { useForm } from '@inertiajs/react';
import { Lock, Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = { token: string; email: string };

export default function ResetPassword({ token, email }: Props) {
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/reset-password', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            icon={Lock}
            title="Nouveau mot de passe"
            subtitle="Choisis un mot de passe solide"
        >
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
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
                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={(event) =>
                            form.setData('password', event.target.value)
                        }
                        required
                    />
                    {form.errors.password && (
                        <p className="text-xs text-destructive">
                            {form.errors.password}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirmation</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        onChange={(event) =>
                            form.setData(
                                'password_confirmation',
                                event.target.value,
                            )
                        }
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="h-12 w-full"
                    disabled={form.processing}
                >
                    {form.processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mise à jour…
                        </>
                    ) : (
                        'Mettre à jour'
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
