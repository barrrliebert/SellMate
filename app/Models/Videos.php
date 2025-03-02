<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Videos extends Model
{
    use HasFactory;

  protected $fillable = [
        'video_file',
        'title',
        'description',
        'source',
        'link'
    ];

    public function getVideoPathAttribute()
    {
        return asset('storage/' . $this->file_video);
    }
}
