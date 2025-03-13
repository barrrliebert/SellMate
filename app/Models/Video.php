<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_file',
        'title',
        'slug',
        'description',
        'source',
        'views',
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($video) {
            if (!$video->slug) {
                $video->slug = Str::slug($video->title);
            }
        });

        static::updating(function ($video) {
            if ($video->isDirty('title') && !$video->isDirty('slug')) {
                $video->slug = Str::slug($video->title);
            }
        });
    }
}
