import type { ReactNode } from 'react';

export type CoupleSettings = {
    id?: number;
    partner_two_name: string;
    influencer_name: string;
    primary_message: string;
    access_code: string;
    lock_title?: string;
    lock_byline?: string;
    special_date?: string;
    intro_title?: string;
    intro_subtitle?: string;
    intro_lines?: string;
    background_audio_url?: string;
    timeline_title?: string;
    timeline_subtitle?: string;
    reasons_title?: string;
    reasons_subtitle?: string;
    gallery_title?: string;
    gallery_subtitle?: string;
    social_title?: string;
    social_subtitle?: string;
    playlist_title?: string;
    playlist_subtitle?: string;
};

export type Memory = {
    id?: number;
    title: string;
    category: string;
    memory_date?: string;
    location?: string;
    photo_url?: string;
    video_url?: string;
    behind_story?: string;
};

export type LoveReason = { id?: number; content: string };
export type TimelineEntry = {
    id?: number;
    chapter: number;
    month_label: string;
    title: string;
    content: string;
    event_date?: string;
    quote: string;
    photo_url?: string;
};
export type SocialPost = {
    id?: number;
    caption: string;
    post_date?: string;
    category: string;
    photo_url?: string;
    jean_michel_thought?: string;
};
export type PlaylistTrack = {
    id?: number;
    title: string;
    artist: string;
    desc?: string;
    external_url?: string;
    featured?: boolean;
};

export type ExperienceCatalogue = {
    settings?: CoupleSettings[];
    memories?: Memory[];
    love_reasons?: LoveReason[];
    timeline?: TimelineEntry[];
    social_posts?: SocialPost[];
    playlist?: PlaylistTrack[];
};

export type SectionProps = {
    onBack?: () => void;
    soundEnabled: boolean;
    onToggleSound?: () => void;
    content?: ExperienceCatalogue;
};

export type SectionLayoutProps = SectionProps & {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    maxWidth?: string;
};
