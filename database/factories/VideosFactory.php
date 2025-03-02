<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Videos>
 */
class VideosFactory extends Factory
{
    protected $model = \App\Models\Videos::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
            return [
                'video_file' => 'videos/' . $this->faker->uuid . '.mp4',
                'title' => $this->faker->sentence,
                'description' => $this->faker->paragraph,
                'link' => $this->faker->url,
                'source' => $this->faker->randomElement(['YouTube', 'Vimeo', 'Dailymotion']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
    
    }
}
