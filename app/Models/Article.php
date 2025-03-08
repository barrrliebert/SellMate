<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;


    protected $fillable = [
        'file_article',
        'thumbnail',
        'title',
        'description',
        'author',
        'synopsis',
        'link_article'
    ];
}
