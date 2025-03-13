<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UpdateSlugsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update video slugs
        Video::all()->each(function($video) {
            if (empty($video->slug)) {
                $video->slug = Str::slug($video->title);
                $video->save();
            }
        });

        // Update article slugs
        Article::all()->each(function($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
                $article->save();
            }
        });

        $this->command->info('All slugs updated successfully!');
    }
} 