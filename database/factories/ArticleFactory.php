<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    protected $model = \App\Models\Article::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'file_article' => 'articles/' . $this->faker->word() . '.pdf', // Simulasi path file
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'author' => $this->faker->name(),
            'synopsis' => $this->faker->text(200),
            'link_article' => $this->faker->url(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
