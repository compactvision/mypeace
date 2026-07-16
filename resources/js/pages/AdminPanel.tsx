import { Link, router, useForm } from '@inertiajs/react';
import {
    CalendarHeart,
    Clock,
    Gift,
    Heart,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Music2,
    Plus,
    Save,
    Settings2,
    Sparkles,
    Trash2,
    Upload,
    Video,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast, Toaster } from 'sonner';

type ContentType =
    | 'settings'
    | 'memories'
    | 'love_reasons'
    | 'timeline'
    | 'social_posts'
    | 'playlist';

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
type AdminContent = {
    id: number;
    type: ContentType;
    payload: Record<string, string | number | boolean>;
    display_order: number;
    is_active: boolean;
};
type CountdownConfig = Record<string, string | boolean>;
type Props = {
    stats: Stats;
    recentAnswers: FinalAnswer[];
    recentDates: NextDate[];
    contents: AdminContent[];
    countdown: CountdownConfig | null;
};
type FieldDefinition = {
    key: string;
    label: string;
    type?:
        | 'text'
        | 'textarea'
        | 'date'
        | 'datetime-local'
        | 'number'
        | 'url'
        | 'checkbox';
    placeholder?: string;
};

function validationMessage(errors: Record<string, string>): string {
    const messages = Object.values(errors);

    return messages.length === 1
        ? messages[0]
        : `${messages.length} champs doivent être corrigés.`;
}

const CONTENT_CONFIG: Record<
    ContentType,
    {
        label: string;
        singular: string;
        icon: typeof Heart;
        fields: FieldDefinition[];
    }
> = {
    settings: {
        label: 'Réglages généraux',
        singular: 'réglages',
        icon: Settings2,
        fields: [
            { key: 'partner_two_name', label: 'Nom de My Peace' },
            { key: 'influencer_name', label: 'Nom public / créatrice' },
            {
                key: 'primary_message',
                label: 'Message principal',
                type: 'textarea',
            },
            { key: 'access_code', label: "Code d'accès (4 chiffres)" },
            { key: 'lock_title', label: "Titre de l'écran verrouillé" },
            { key: 'lock_byline', label: 'Signature du verrouillage' },
            { key: 'special_date', label: 'Date spéciale', type: 'date' },
            { key: 'intro_title', label: "Titre de l'introduction" },
            { key: 'intro_subtitle', label: "Sous-titre de l'introduction" },
            {
                key: 'intro_lines',
                label: "Textes de l'introduction (une phrase par ligne)",
                type: 'textarea',
            },
            {
                key: 'background_audio_url',
                label: 'Lien direct vers une musique (MP3, OGG…)',
                type: 'url',
            },
            { key: 'timeline_title', label: 'Titre de la timeline' },
            { key: 'timeline_subtitle', label: 'Sous-titre de la timeline' },
            { key: 'reasons_title', label: 'Titre des raisons' },
            { key: 'reasons_subtitle', label: 'Sous-titre des raisons' },
            { key: 'gallery_title', label: 'Titre de la galerie' },
            { key: 'gallery_subtitle', label: 'Sous-titre de la galerie' },
            { key: 'social_title', label: 'Titre des publications' },
            { key: 'social_subtitle', label: 'Sous-titre des publications' },
            { key: 'playlist_title', label: 'Titre de la playlist' },
            { key: 'playlist_subtitle', label: 'Sous-titre de la playlist' },
        ],
    },
    memories: {
        label: 'Galerie & souvenirs',
        singular: 'souvenir',
        icon: ImageIcon,
        fields: [
            { key: 'title', label: 'Titre' },
            {
                key: 'category',
                label: 'Catégorie',
                placeholder: 'fleuve, sorties, looks…',
            },
            { key: 'memory_date', label: 'Date', type: 'date' },
            { key: 'location', label: 'Lieu' },
            {
                key: 'behind_story',
                label: 'Histoire derrière la photo',
                type: 'textarea',
            },
            { key: 'photo_url', label: "Lien externe de l'image", type: 'url' },
        ],
    },
    love_reasons: {
        label: "Raisons d'amour",
        singular: 'raison',
        icon: Heart,
        fields: [{ key: 'content', label: 'Raison', type: 'textarea' }],
    },
    timeline: {
        label: 'Timeline',
        singular: 'chapitre',
        icon: Clock,
        fields: [
            { key: 'chapter', label: 'Numéro du chapitre', type: 'number' },
            { key: 'month_label', label: 'Mois / période' },
            { key: 'title', label: 'Titre' },
            { key: 'event_date', label: "Date de l'événement", type: 'date' },
            { key: 'content', label: 'Récit', type: 'textarea' },
            { key: 'quote', label: 'Citation', type: 'textarea' },
            { key: 'photo_url', label: "Lien externe de l'image", type: 'url' },
        ],
    },
    social_posts: {
        label: 'Publications',
        singular: 'publication',
        icon: Sparkles,
        fields: [
            { key: 'caption', label: 'Légende', type: 'textarea' },
            { key: 'post_date', label: 'Date', type: 'date' },
            { key: 'category', label: 'Catégorie' },
            {
                key: 'jean_michel_thought',
                label: 'Pensée secrète',
                type: 'textarea',
            },
            { key: 'photo_url', label: "Lien externe de l'image", type: 'url' },
        ],
    },
    playlist: {
        label: 'Playlist',
        singular: 'morceau',
        icon: Music2,
        fields: [
            { key: 'title', label: 'Titre' },
            { key: 'artist', label: 'Artiste' },
            { key: 'desc', label: 'Description', type: 'textarea' },
            { key: 'external_url', label: "Lien d'écoute", type: 'url' },
            { key: 'featured', label: 'Mettre en avant', type: 'checkbox' },
        ],
    },
};

const EMPTY_VALUES: Record<
    ContentType,
    Record<string, string | number | boolean>
> = {
    settings: { partner_two_name: '', access_code: '2102' },
    memories: { title: '', category: '', memory_date: '' },
    love_reasons: { content: '' },
    timeline: {
        chapter: 1,
        month_label: '',
        title: '',
        content: '',
        event_date: '',
    },
    social_posts: { caption: '', category: '', post_date: '' },
    playlist: { title: '', artist: '', featured: false },
};

function Field({
    definition,
    value,
    onChange,
}: {
    definition: FieldDefinition;
    value: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
}) {
    const className =
        'w-full rounded-xl border border-border bg-night-deep/70 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10';

    if (definition.type === 'checkbox') {
        return (
            <label className="flex items-center gap-3 rounded-xl border border-border bg-night-deep/40 p-3 text-sm">
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(event.target.checked)}
                    className="size-4 accent-pink"
                />
                {definition.label}
            </label>
        );
    }

    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
                {definition.label}
            </span>
            {definition.type === 'textarea' ? (
                <textarea
                    rows={3}
                    value={String(value ?? '')}
                    placeholder={definition.placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    className={className}
                />
            ) : (
                <input
                    type={definition.type || 'text'}
                    value={String(value ?? '')}
                    placeholder={definition.placeholder}
                    onChange={(event) =>
                        onChange(
                            definition.type === 'number'
                                ? Number(event.target.value)
                                : event.target.value,
                        )
                    }
                    className={className}
                />
            )}
        </label>
    );
}

function ContentForm({
    item,
    type,
    onCancel,
}: {
    item?: AdminContent;
    type: ContentType;
    onCancel?: () => void;
}) {
    const config = CONTENT_CONFIG[type];
    const [audioSelectionError, setAudioSelectionError] = useState<
        string | null
    >(null);
    const [videoSelectionError, setVideoSelectionError] = useState<
        string | null
    >(null);
    const form = useForm<
        Record<string, string | number | boolean | File | null>
    >({
        type,
        ...EMPTY_VALUES[type],
        ...(item?.payload || {}),
        display_order: item?.display_order || 0,
        is_active: item?.is_active ?? true,
        photo: null,
        audio: null,
        video: null,
        remove_video: false,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const selectionError = audioSelectionError || videoSelectionError;

        if (selectionError) {
            toast.error(selectionError);

            return;
        }

        form.post(`/admin/content${item ? `/${item.id}` : ''}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset('photo', 'audio', 'video', 'remove_video');
                onCancel?.();
            },
        });
    };

    const photoUrl = String(form.data.photo_url || '');
    const audioUrl = String(form.data.background_audio_url || '');
    const videoUrl = String(form.data.video_url || '');
    const selectedPhoto =
        form.data.photo instanceof File ? form.data.photo : null;
    const selectedPhotoUrl = useMemo(
        () => (selectedPhoto ? URL.createObjectURL(selectedPhoto) : null),
        [selectedPhoto],
    );
    const photoPreviewUrl = selectedPhotoUrl || photoUrl;

    useEffect(() => {
        return () => {
            if (selectedPhotoUrl) {
                URL.revokeObjectURL(selectedPhotoUrl);
            }
        };
    }, [selectedPhotoUrl]);

    return (
        <form
            onSubmit={submit}
            className="glass space-y-4 rounded-2xl p-4 sm:p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-heading text-lg text-cream">
                        {item
                            ? `${config.singular} #${item.id}`
                            : `Nouveau ${config.singular}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {item
                            ? 'Modifiez puis enregistrez.'
                            : 'Complétez les informations.'}
                    </p>
                </div>
                {item && type !== 'settings' && (
                    <button
                        type="button"
                        onClick={() => {
                            if (
                                window.confirm(
                                    'Supprimer définitivement ce contenu ?',
                                )
                            ) {
                                router.delete(`/admin/content/${item.id}`, {
                                    preserveScroll: true,
                                });
                            }
                        }}
                        className="touch-target flex items-center justify-center rounded-xl text-destructive hover:bg-destructive/10"
                        aria-label="Supprimer"
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </div>

            {(photoPreviewUrl ||
                ['memories', 'timeline', 'social_posts'].includes(type)) && (
                <div className="grid gap-3 sm:grid-cols-[140px_1fr] sm:items-center">
                    {photoPreviewUrl ? (
                        <img
                            src={photoPreviewUrl}
                            alt="Aperçu"
                            className="h-28 w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border bg-night-deep/40">
                            <ImageIcon className="size-6 text-muted-foreground/40" />
                        </div>
                    )}
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-xs text-primary hover:bg-primary/10">
                        <Upload className="size-4" />
                        {form.data.photo instanceof File
                            ? form.data.photo.name
                            : 'Choisir une image'}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                                form.setData(
                                    'photo',
                                    event.target.files?.[0] || null,
                                )
                            }
                        />
                    </label>
                    {selectedPhoto ? (
                        <button
                            type="button"
                            onClick={() => form.setData('photo', null)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 px-4 py-2.5 text-xs text-destructive transition hover:bg-destructive/10 sm:col-start-2"
                        >
                            <Trash2 className="size-4" /> Annuler la photo
                            sélectionnée
                        </button>
                    ) : (
                        item &&
                        photoUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            'Supprimer définitivement cette photo ?',
                                        )
                                    ) {
                                        router.delete(
                                            `/admin/content/${item.id}/media/photo`,
                                            {
                                                preserveScroll: true,
                                                onSuccess: () =>
                                                    form.setData(
                                                        'photo_url',
                                                        '',
                                                    ),
                                            },
                                        );
                                    }
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 px-4 py-2.5 text-xs text-destructive transition hover:bg-destructive/10 sm:col-start-2"
                            >
                                <Trash2 className="size-4" /> Supprimer la photo
                            </button>
                        )
                    )}
                </div>
            )}

            {type === 'settings' && (
                <div className="space-y-2 rounded-xl border border-primary/15 bg-primary/5 p-3">
                    <p className="text-xs font-medium text-powder">
                        Musique de fond
                    </p>
                    {audioUrl && (
                        <audio
                            src={audioUrl}
                            controls
                            className="h-10 w-full"
                        />
                    )}
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 px-4 py-3 text-xs text-primary hover:bg-primary/10">
                        <Music2 className="size-4" />
                        {form.data.audio instanceof File
                            ? form.data.audio.name
                            : 'Importer MP3, WAV, M4A ou OGG (12 Mo max.)'}
                        <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0] || null;

                                if (file && file.size > 12 * 1024 * 1024) {
                                    const message =
                                        'La musique ne doit pas dépasser 12 Mo.';
                                    setAudioSelectionError(message);
                                    toast.error(message);
                                    form.setData('audio', null);
                                    event.target.value = '';

                                    return;
                                }

                                setAudioSelectionError(null);
                                form.clearErrors('audio');
                                form.setData('audio', file);
                            }}
                        />
                    </label>
                    {audioSelectionError && (
                        <p className="text-xs text-destructive">
                            {audioSelectionError}
                        </p>
                    )}
                </div>
            )}

            {type === 'memories' && (
                <div className="space-y-3 rounded-xl border border-pink/20 bg-pink/5 p-3">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-medium text-powder">
                            <Video className="size-4" /> Souvenir vidéo unique
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Une seule vidéo peut être affichée dans toute la
                            galerie.
                        </p>
                    </div>
                    {videoUrl && !form.data.remove_video && (
                        <video
                            src={videoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="max-h-56 w-full rounded-xl bg-night-black object-contain"
                        />
                    )}
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 px-4 py-3 text-xs text-primary hover:bg-primary/10">
                        <Upload className="size-4" />
                        {form.data.video instanceof File
                            ? form.data.video.name
                            : 'Importer MP4, WebM ou MOV (40 Mo max.)'}
                        <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0] || null;

                                if (file && file.size > 40 * 1024 * 1024) {
                                    const message =
                                        'La vidéo ne doit pas dépasser 40 Mo.';
                                    setVideoSelectionError(message);
                                    toast.error(message);
                                    form.setData('video', null);
                                    event.target.value = '';

                                    return;
                                }

                                setVideoSelectionError(null);
                                form.clearErrors('video');
                                form.setData('remove_video', false);
                                form.setData('video', file);
                            }}
                        />
                    </label>
                    {form.data.video instanceof File ? (
                        <button
                            type="button"
                            onClick={() => form.setData('video', null)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 px-4 py-2.5 text-xs text-destructive transition hover:bg-destructive/10"
                        >
                            <Trash2 className="size-4" /> Annuler la vidéo
                            sélectionnée
                        </button>
                    ) : (
                        item &&
                        videoUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            'Supprimer définitivement cette vidéo ?',
                                        )
                                    ) {
                                        router.delete(
                                            `/admin/content/${item.id}/media/video`,
                                            {
                                                preserveScroll: true,
                                                onSuccess: () =>
                                                    form.setData(
                                                        'video_url',
                                                        '',
                                                    ),
                                            },
                                        );
                                    }
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 px-4 py-2.5 text-xs text-destructive transition hover:bg-destructive/10"
                            >
                                <Trash2 className="size-4" /> Supprimer la vidéo
                            </button>
                        )
                    )}
                    {videoSelectionError && (
                        <p className="text-xs text-destructive">
                            {videoSelectionError}
                        </p>
                    )}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {config.fields.map((definition) => (
                    <div
                        key={definition.key}
                        className={
                            definition.type === 'textarea'
                                ? 'sm:col-span-2'
                                : ''
                        }
                    >
                        <Field
                            definition={definition}
                            value={
                                form.data[definition.key] as
                                    string | number | boolean
                            }
                            onChange={(value) =>
                                form.setData(definition.key, value)
                            }
                        />
                    </div>
                ))}
            </div>

            {type !== 'settings' && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        definition={{
                            key: 'display_order',
                            label: "Ordre d'affichage",
                            type: 'number',
                        }}
                        value={form.data.display_order as number}
                        onChange={(value) =>
                            form.setData('display_order', value)
                        }
                    />
                    <Field
                        definition={{
                            key: 'is_active',
                            label: 'Afficher ce contenu',
                            type: 'checkbox',
                        }}
                        value={form.data.is_active as boolean}
                        onChange={(value) => form.setData('is_active', value)}
                    />
                </div>
            )}

            {Object.keys(form.errors).length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    {Object.values(form.errors).map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    disabled={form.processing}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                >
                    <Save className="size-4" />
                    {form.processing ? 'Enregistrement…' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}

function CountdownForm({ countdown }: { countdown: CountdownConfig | null }) {
    const form = useForm({
        target_date: String(countdown?.target_date || ''),
        timezone: String(countdown?.timezone || 'Africa/Kinshasa'),
        title: String(countdown?.title || ''),
        subtitle: String(countdown?.subtitle || ''),
        main_message: String(countdown?.main_message || ''),
        alt_message: String(countdown?.alt_message || ''),
        hidden_message: String(countdown?.hidden_message || ''),
        end_message: String(countdown?.end_message || ''),
        signature: String(countdown?.signature || ''),
        post_expiration_text: String(countdown?.post_expiration_text || ''),
        graphics_quality: String(countdown?.graphics_quality || 'high'),
        is_countdown_enabled: Boolean(countdown?.is_countdown_enabled ?? true),
        is_3d_scene_enabled: Boolean(countdown?.is_3d_scene_enabled ?? true),
        is_sound_enabled: Boolean(countdown?.is_sound_enabled ?? false),
        manual_unlock: Boolean(countdown?.manual_unlock ?? false),
    });

    const textFields: FieldDefinition[] = [
        {
            key: 'target_date',
            label: 'Date et heure cible',
            type: 'datetime-local',
        },
        { key: 'timezone', label: 'Fuseau horaire' },
        { key: 'title', label: 'Titre' },
        { key: 'subtitle', label: 'Sous-titre' },
        { key: 'main_message', label: 'Message principal', type: 'textarea' },
        { key: 'alt_message', label: 'Message alternatif', type: 'textarea' },
        { key: 'hidden_message', label: 'Message caché', type: 'textarea' },
        { key: 'end_message', label: 'Message final', type: 'textarea' },
        { key: 'signature', label: 'Signature' },
        {
            key: 'post_expiration_text',
            label: "Texte après l'expiration",
            type: 'textarea',
        },
    ];

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.put('/admin/countdown', {
                    preserveScroll: true,
                });
            }}
            className="glass space-y-5 rounded-2xl p-4 sm:p-6"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {textFields.map((definition) => (
                    <div
                        key={definition.key}
                        className={
                            definition.type === 'textarea'
                                ? 'sm:col-span-2'
                                : ''
                        }
                    >
                        <Field
                            definition={definition}
                            value={
                                form.data[
                                    definition.key as keyof typeof form.data
                                ] as string
                            }
                            onChange={(value) =>
                                form.setData(
                                    definition.key as keyof typeof form.data,
                                    value as never,
                                )
                            }
                        />
                    </div>
                ))}
                <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                        Qualité graphique
                    </span>
                    <select
                        value={form.data.graphics_quality}
                        onChange={(event) =>
                            form.setData('graphics_quality', event.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-night-deep/70 px-3 py-2.5 text-sm"
                    >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                    </select>
                </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {[
                    ['is_countdown_enabled', 'Activer le compte à rebours'],
                    ['is_3d_scene_enabled', 'Activer la scène 3D'],
                    ['is_sound_enabled', 'Afficher le contrôle sonore'],
                    ['manual_unlock', 'Déverrouiller manuellement'],
                ].map(([key, label]) => (
                    <Field
                        key={key}
                        definition={{ key, label, type: 'checkbox' }}
                        value={
                            form.data[key as keyof typeof form.data] as boolean
                        }
                        onChange={(value) =>
                            form.setData(
                                key as keyof typeof form.data,
                                value as never,
                            )
                        }
                    />
                ))}
            </div>
            {Object.keys(form.errors).length > 0 && (
                <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                    {Object.values(form.errors).map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                </div>
            )}
            <button
                type="submit"
                disabled={form.processing}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
                <Save className="size-4" /> Enregistrer le compte à rebours
            </button>
        </form>
    );
}

export default function AdminPanel({
    stats,
    recentAnswers,
    recentDates,
    contents,
    countdown,
}: Props) {
    const [active, setActive] = useState<
        ContentType | 'dashboard' | 'countdown'
    >('dashboard');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const removeSuccessListener = router.on('success', (event) => {
            const flash = event.detail.page.props.flash as
                { status?: string } | undefined;

            if (flash?.status) {
                toast.success(flash.status);
            }
        });
        const removeErrorListener = router.on('error', (event) => {
            toast.error(validationMessage(event.detail.errors));
        });
        const removeNetworkErrorListener = router.on('networkError', () => {
            toast.error(
                'Connexion impossible. Vérifiez votre réseau puis réessayez.',
            );
        });
        const removeHttpExceptionListener = router.on('httpException', () => {
            toast.error(
                "L'opération a échoué. Veuillez réessayer dans un instant.",
            );
        });

        return () => {
            removeSuccessListener();
            removeErrorListener();
            removeNetworkErrorListener();
            removeHttpExceptionListener();
        };
    }, []);
    const grouped = useMemo(
        () =>
            Object.fromEntries(
                Object.keys(CONTENT_CONFIG).map((type) => [
                    type,
                    contents.filter((item) => item.type === type),
                ]),
            ) as Record<ContentType, AdminContent[]>,
        [contents],
    );

    const navigation = [
        {
            id: 'dashboard' as const,
            label: 'Vue générale',
            icon: LayoutDashboard,
        },
        ...Object.entries(CONTENT_CONFIG).map(([id, config]) => ({
            id: id as ContentType,
            label: config.label,
            icon: config.icon,
        })),
        {
            id: 'countdown' as const,
            label: 'Compte à rebours',
            icon: CalendarHeart,
        },
    ];
    const statCards = [
        { label: 'Souvenirs', count: stats.memories, icon: ImageIcon },
        { label: 'Raisons', count: stats.loveReasons, icon: Heart },
        { label: 'Chapitres', count: stats.timeline, icon: Clock },
        { label: 'Publications', count: stats.socialPosts, icon: Sparkles },
        { label: 'Réponses finales', count: stats.finalAnswers, icon: Gift },
        { label: 'Rendez-vous', count: stats.nextDates, icon: CalendarHeart },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Toaster
                position="top-right"
                theme="dark"
                richColors
                closeButton
                toastOptions={{ duration: 6000 }}
            />
            <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/brand/my-peace-logo.png"
                            alt=""
                            className="size-11 object-contain"
                            aria-hidden="true"
                        />
                        <div>
                            <h1 className="font-heading text-xl">
                                My Peace Studio
                            </h1>
                            <p className="text-[11px] text-muted-foreground">
                                Contrôle complet de l’expérience
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="rounded-xl border border-border px-3 py-2 text-xs text-primary hover:bg-primary/5"
                        >
                            Voir le site
                        </Link>
                        <button
                            onClick={() => router.post('/logout')}
                            className="touch-target flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Déconnexion"
                        >
                            <LogOut className="size-4" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
                <aside className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActive(item.id);
                                    setAdding(false);
                                }}
                                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition lg:w-full ${active === item.id ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                                <Icon className="size-4" /> {item.label}
                                {item.id in grouped && (
                                    <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px]">
                                        {grouped[item.id as ContentType].length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </aside>

                <main className="min-w-0">
                    {active === 'dashboard' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="font-heading text-2xl">
                                    Vue générale
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Choisissez une section pour modifier
                                    immédiatement son contenu.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {statCards.map((card) => {
                                    const Icon = card.icon;

                                    return (
                                        <div
                                            key={card.label}
                                            className="glass rounded-2xl p-4"
                                        >
                                            <Icon className="mb-3 size-5 text-primary" />
                                            <p className="font-heading text-2xl">
                                                {card.count}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {card.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="glass rounded-2xl p-4">
                                    <h3 className="mb-3 text-sm font-medium">
                                        Dernières réponses
                                    </h3>
                                    {recentAnswers.length ? (
                                        recentAnswers.map((answer) => (
                                            <p
                                                key={answer.id}
                                                className="mb-2 rounded-lg bg-white/[0.03] p-2 text-xs text-muted-foreground"
                                            >
                                                {answer.answer}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Aucune réponse.
                                        </p>
                                    )}
                                </div>
                                <div className="glass rounded-2xl p-4">
                                    <h3 className="mb-3 text-sm font-medium">
                                        Prochains rendez-vous
                                    </h3>
                                    {recentDates.length ? (
                                        recentDates.map((date) => (
                                            <p
                                                key={date.id}
                                                className="mb-2 rounded-lg bg-white/[0.03] p-2 text-xs text-muted-foreground"
                                            >
                                                {date.food} · {date.drink} ·{' '}
                                                {date.location_type}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Aucun choix.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {active === 'countdown' && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-heading text-2xl">
                                    Compte à rebours
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Dates, messages, rendu 3D et déverrouillage.
                                </p>
                            </div>
                            <CountdownForm countdown={countdown} />
                        </div>
                    )}

                    {active !== 'dashboard' && active !== 'countdown' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-heading text-2xl">
                                        {CONTENT_CONFIG[active].label}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {grouped[active].length} élément(s)
                                        configuré(s).
                                    </p>
                                </div>
                                {active !== 'settings' && !adding && (
                                    <button
                                        onClick={() => setAdding(true)}
                                        className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground"
                                    >
                                        <Plus className="size-4" /> Ajouter
                                    </button>
                                )}
                            </div>
                            {adding && (
                                <ContentForm
                                    type={active}
                                    onCancel={() => setAdding(false)}
                                />
                            )}
                            {grouped[active].map((item) => (
                                <ContentForm
                                    key={item.id}
                                    item={item}
                                    type={active}
                                />
                            ))}
                            {!adding &&
                                grouped[active].length === 0 &&
                                (active === 'settings' ? (
                                    <ContentForm type="settings" />
                                ) : (
                                    <button
                                        onClick={() => setAdding(true)}
                                        className="glass flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-dashed text-muted-foreground hover:text-primary"
                                    >
                                        <Plus className="size-6" />
                                        <span className="text-sm">
                                            Ajouter le premier{' '}
                                            {CONTENT_CONFIG[active].singular}
                                        </span>
                                    </button>
                                ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
