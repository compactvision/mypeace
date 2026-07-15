# My Peace

Expérience privée construite avec Laravel 13, Inertia 3, React 19 et Tailwind CSS 4. Le projet ne dépend plus de Base44 ni de React Router : Laravel est la source de vérité pour les routes, l’authentification et les données.

## Démarrage

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
composer run dev
```

Le compte local créé par le seeder est `test@example.com` avec le mot de passe `password`. Le code de l’expérience est `2102`.

## Architecture

- `routes/web.php` : pages et authentification Inertia.
- `routes/api.php` : API JSON de l’expérience.
- `app/Services/ExperienceContentService.php` : lecture et assemblage du catalogue.
- `app/Http/Controllers/Api` : contrôleurs JSON minces.
- `app/Http/Requests` : validation des réponses visiteur.
- `resources/js/api/experienceApi.ts` : unique passerelle frontend vers l’API.
- `database/seeders/ExperienceContentSeeder.php` : contenu de démonstration idempotent.

## API locale

- `GET /api/experience/content`
- `POST /api/experience/responses/next-date`
- `POST /api/experience/responses/final-answer`

Les contenus éditoriaux sont stockés dans `experience_contents`; les réponses visiteur dans `experience_responses`.

## Vérification

```bash
npm run lint:check
npm run format:check
npm run types:check
php artisan test
vendor/bin/pint --test
npm run build
```
