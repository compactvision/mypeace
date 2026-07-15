import type { ExperienceCatalogue } from '@/types/experience';

class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        const validationMessage = body.errors
            ? Object.values(body.errors).flat().join(' ')
            : null;

        throw new ApiError(
            validationMessage || body.message || 'Une erreur est survenue.',
            response.status,
        );
    }

    return body.data as T;
}

export const experienceApi = {
    catalogue: () => request<ExperienceCatalogue>('/api/experience/content'),
    saveNextDate: (payload: Record<string, string>) =>
        request<{ id: number }>('/api/experience/responses/next-date', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
    saveFinalAnswer: (answer: string) =>
        request<{ id: number }>('/api/experience/responses/final-answer', {
            method: 'POST',
            body: JSON.stringify({ answer }),
        }),
};
