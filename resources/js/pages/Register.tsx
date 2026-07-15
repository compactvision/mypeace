import { Link, useForm } from '@inertiajs/react';
import { UserPlus, Mail, Lock, Loader2, User } from 'lucide-react';
import type { FormEvent } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/register', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    const fields = [
        {
            key: 'name',
            label: 'Nom',
            type: 'text',
            icon: User,
            autoComplete: 'name',
        },
        {
            key: 'email',
            label: 'E-mail',
            type: 'email',
            icon: Mail,
            autoComplete: 'email',
        },
        {
            key: 'password',
            label: 'Mot de passe',
            type: 'password',
            icon: Lock,
            autoComplete: 'new-password',
        },
        {
            key: 'password_confirmation',
            label: 'Confirmer le mot de passe',
            type: 'password',
            icon: Lock,
            autoComplete: 'new-password',
        },
    ] as const;

    return (
        <AuthLayout
            icon={UserPlus}
            title="Créer un compte"
            subtitle="Un accès sécurisé, géré par Laravel"
            footer={
                <>
                    Déjà inscrit ?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Se connecter
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} className="space-y-4">
                {fields.map(
                    ({ key, label, type, icon: Icon, autoComplete }) => (
                        <div className="space-y-2" key={key}>
                            <Label htmlFor={key}>{label}</Label>
                            <div className="relative">
                                <Icon
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id={key}
                                    type={type}
                                    autoComplete={autoComplete}
                                    value={form.data[key]}
                                    onChange={(event) =>
                                        form.setData(key, event.target.value)
                                    }
                                    className="h-12 pl-10"
                                    required
                                />
                            </div>
                            {form.errors[key] && (
                                <p className="text-xs text-destructive">
                                    {form.errors[key]}
                                </p>
                            )}
                        </div>
                    ),
                )}
                <Button
                    type="submit"
                    className="h-12 w-full font-medium"
                    disabled={form.processing}
                >
                    {form.processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création…
                        </>
                    ) : (
                        'Créer mon compte'
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
