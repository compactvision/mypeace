<?php

namespace Database\Seeders;

use App\Models\ExperienceContent;
use Illuminate\Database\Seeder;

class ExperienceContentSeeder extends Seeder
{
    public function run(): void
    {
        ExperienceContent::query()->delete();

        $this->seed('settings', [[
            'partner_two_name' => 'Cassy',
            'influencer_name' => 'arky N',
            'primary_message' => 'The girl who keeps surprising me.',
            'access_code' => '2102',
            'lock_title' => 'Created for My Peace',
            'lock_byline' => 'By Only You',
            'special_date' => '2026-07-21',
            'intro_title' => 'ONLY YOU × MY PEACE',
            'intro_subtitle' => 'Chapter Five',
            'intro_lines' => "Certaines histoires commencent par des messages…\nLa nôtre a commencé au bord du fleuve.\nCe jour-là, sans le savoir, nous écrivions déjà notre premier chapitre.\nEt depuis, chaque instant avec toi donne un peu plus de sens au mot « nous ».",
            'letter_title' => 'To My Peace, from Only You',
            'letter_subtitle' => 'Une lettre, fragment par fragment',
            'letter_body' => "Ma vie,\nCela fait maintenant cinq mois que notre histoire a commencé, et j’ai parfois l’impression que le temps passe trop vite.\nDepuis ce moment au bord du fleuve, tu as pris une place importante dans ma vie.\nTu arrives encore à me surprendre. Chaque fois que je te vois, je découvre quelque chose de nouveau, et je tombe encore plus amoureux de toi.\nJ’aime tes beaux yeux, ton énergie, ta personnalité, ta manière d’être toi-même et la paix que tu m’apportes.\nJe ne prétends pas que tout sera toujours parfait. Mais je veux que tu saches une chose : je t’aime et je serai toujours là pour toi.\nCe site est mon cadeau. Ce n’est pas seulement une page avec des photos. C’est un morceau de notre histoire, un endroit où j’ai voulu conserver ce que nous avons déjà vécu.\nMerci pour ces cinq mois, My Peace.\nEt surtout, merci d’être toi.",
            'letter_signature' => 'Only You.',
            'letter_footer' => 'Si si, ma vie. Chaque mot est sincère.',
            'final_intro_title' => "Happy five months,\nMy Peace.",
            'final_intro_subtitle' => 'From Only You.',
            'final_continue_label' => 'Continuer',
            'final_reveal_lines' => "Cinq mois, ce n’est peut-être que le début.\nMais c’est déjà assez pour savoir que chaque moment avec toi mérite d’être conservé.\nTu me surprends encore.\nTu m’apportes de la paix.\nEt chaque fois que je te vois, je tombe encore plus amoureux de toi.\nJe t’aime, Cassy.\nEt je serai toujours là pour toi.",
            'final_tap_hint' => 'Touche pour continuer',
            'final_question' => 'Veux-tu continuer à écrire les prochains chapitres avec moi ?',
            'final_primary_answer' => 'Si si, ma vie ❤️',
            'final_secondary_answer' => 'Oui, mais tu me dois un burger 🍔',
            'final_gift_title' => 'Ton cadeau, c’est cet univers.',
            'final_gift_message' => 'Un endroit créé pour toi, pour nous, et pour les souvenirs que je ne veux jamais perdre.',
            'final_gift_lines' => "Cinq mois avec My Peace.\nEt je choisirais encore Only You.",
        ]]);

        $this->seed('love_reasons', collect([
            'Tes beaux yeux', 'Ta manière de toujours me surprendre', 'Ta créativité',
            'Ton ambition', 'Ton énergie', 'Ta personnalité', 'Ton style', 'Ton sourire',
            'La paix que tu m’apportes', 'Ta façon de rendre les moments simples inoubliables',
            'La manière dont je retombe amoureux chaque fois que je te vois',
            'Tes petites habitudes', 'Ta passion pour ce que tu fais', 'La femme que tu es',
            'Ce sentiment d’être exactement là où je dois être quand je suis avec toi',
        ])->map(fn (string $content): array => ['content' => $content])->all());

        $this->seed('timeline', [
            ['chapter' => 1, 'month_label' => 'Février', 'title' => 'The Beginning', 'content' => 'Une rencontre au bord du fleuve. Quelques regards, une conversation qui refuse de finir, et le commencement d’une histoire que personne n’avait planifiée.', 'event_date' => '2026-02-21', 'quote' => 'Je ne savais pas encore que ce moment allait changer autant de choses.'],
            ['chapter' => 2, 'month_label' => 'Mars', 'title' => 'Closer', 'content' => 'Le 5 mars, notre histoire prend une autre dimension. La distance disparaît, la complicité s’installe et nos silences commencent déjà à se comprendre.', 'event_date' => '2026-03-05', 'quote' => 'Ce jour-là, quelque chose entre nous a profondément changé.'],
            ['chapter' => 3, 'month_label' => 'Avril', 'title' => 'Comfort', 'content' => 'Des habitudes de couple, de longues discussions et ces moments simples qui deviennent nos préférés. « Ma vie », « ma femme », « si si » entrent dans notre langage.', 'event_date' => '2026-04-01', 'quote' => 'Sans m’en rendre compte, tu étais déjà devenue une partie de mes journées.'],
            ['chapter' => 4, 'month_label' => 'Mai — Juin', 'title' => 'Memories in Motion', 'content' => 'Le fleuve, Maluku, les paysages, les rires et les vlogs. Nous apprenons que l’aventure n’est pas un lieu : c’est la personne avec qui on la vit.', 'event_date' => '2026-05-15', 'quote' => 'Avec toi, même une journée simple devient un souvenir que je veux garder.'],
            ['chapter' => 5, 'month_label' => 'Juillet', 'title' => 'Still Falling', 'content' => 'Cinq mois, ce site, beaucoup de reconnaissance et une promesse simple : continuer à choisir notre histoire, chapitre après chapitre.', 'event_date' => '2026-07-21', 'quote' => 'Je ne me suis pas habitué à toi. Je tombe encore plus amoureux chaque fois que je te vois.'],
        ]);

        $this->seed('social_posts', [
            ['caption' => 'My Peace being effortlessly beautiful.', 'post_date' => '2026-03-10', 'category' => 'lifestyle', 'jean_michel_thought' => 'Ce jour-là, je n’arrêtais pas de la regarder. Elle ne s’en rendait même pas compte.'],
            ['caption' => 'Encore un jour où je suis retombé amoureux.', 'post_date' => '2026-04-05', 'category' => 'vlog', 'jean_michel_thought' => 'Chaque jour avec elle est un nouveau coup de foudre. Si si.'],
            ['caption' => 'POV : elle ne sait pas encore à quel point ses yeux sont magnifiques.', 'post_date' => '2026-05-02', 'category' => 'moment', 'jean_michel_thought' => 'Ses yeux. Je pourrais passer ma vie à les regarder.'],
            ['caption' => 'arky N dans son élément. Main character energy.', 'post_date' => '2026-05-20', 'category' => 'creator', 'jean_michel_thought' => 'Quand elle crée, elle brille différemment. J’aime cette version d’elle.'],
            ['caption' => 'Si si, ma femme est trop belle.', 'post_date' => '2026-06-15', 'category' => 'lifestyle', 'jean_michel_thought' => 'Ma femme. Ma vie. Mon cœur.'],
        ]);

        $this->seed('memories', [
            ['title' => 'Là où tout a commencé', 'category' => 'fleuve', 'memory_date' => '2026-02-21', 'location' => 'Bord du fleuve, Kinshasa', 'behind_story' => 'Le décor était magnifique, mais ce que je regardais vraiment, c’était toi.'],
            ['title' => 'Première escapade', 'category' => 'maluku', 'memory_date' => '2026-05-10', 'location' => 'Maluku', 'behind_story' => 'Une route, beaucoup de musique et cette impression que le monde pouvait attendre.'],
            ['title' => 'Nos moments simples', 'category' => 'chez_moi', 'memory_date' => '2026-04-18', 'location' => 'Chez nous', 'behind_story' => 'Pas besoin d’un grand programme. Ta présence suffisait à faire de cette soirée un souvenir.'],
            ['title' => 'Main character', 'category' => 'looks', 'memory_date' => '2026-06-08', 'location' => 'Kinshasa', 'behind_story' => 'Tu étais prête en cinq minutes. Moi, pas prêt du tout à te voir aussi belle.'],
            ['title' => 'Ces yeux', 'category' => 'beaux_yeux', 'memory_date' => '2026-05-02', 'location' => 'Quelque part entre deux éclats de rire', 'behind_story' => 'Une photo prise vite, un regard que je pourrais contempler longtemps.'],
            ['title' => 'Le souvenir secret', 'category' => 'secret', 'memory_date' => '2026-07-01', 'location' => 'Notre endroit', 'behind_story' => 'Celui-ci ne s’explique pas. Il se vit, puis il se garde précieusement.'],
        ]);

        $this->seed('playlist', [
            ['title' => 'PARTYNEXTDOOR', 'artist' => 'Featured', 'desc' => 'L’artiste qui colle à notre ambiance.', 'featured' => true],
            ['title' => 'Midnight vibes', 'artist' => 'R&B', 'desc' => 'Pour les soirées à ne rien faire, juste nous deux.'],
            ['title' => 'Golden hour', 'artist' => 'R&B', 'desc' => 'Comme la lumière au bord du fleuve.'],
            ['title' => 'Still falling', 'artist' => 'R&B', 'desc' => 'Parce que oui, je tombe encore.'],
            ['title' => 'My Peace', 'artist' => 'R&B', 'desc' => 'Toi. Juste toi.'],
        ]);
    }

    /** @param array<int, array<string, mixed>> $items */
    private function seed(string $type, array $items): void
    {
        foreach ($items as $index => $payload) {
            ExperienceContent::query()->create([
                'type' => $type,
                'payload' => $payload,
                'display_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
