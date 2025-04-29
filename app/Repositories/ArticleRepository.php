<?php

namespace App\Repositories;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleRepository
{
    protected $model;

    public function __construct(Article $model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        $articles = $this->model->all();
        
        // Fix thumbnail URLs for all articles
        foreach ($articles as $article) {
            if ($article->thumbnail && !str_starts_with($article->thumbnail, 'http')) {
                $article->thumbnail = asset('storage/' . $article->thumbnail);
            }
        }
        
        return $articles;
    }

    public function findById($id)
    {
        $article = $this->model->findOrFail($id);
        
        // Fix thumbnail URL
        if ($article->thumbnail && !str_starts_with($article->thumbnail, 'http')) {
            $article->thumbnail = asset('storage/' . $article->thumbnail);
        }
        
        return $article;
    }

    public function create(array $data)
    {
        if (isset($data['thumbnail'])) {
            $data['thumbnail'] = $this->storeThumbnail($data['thumbnail']);
        }

        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $article = $this->findById($id);

        if (isset($data['thumbnail'])) {
            if ($article->thumbnail) {
                // Dapatkan path relatif dari URL lengkap
                $oldPath = str_replace(asset('storage/'), '', $article->getRawOriginal('thumbnail'));
                Storage::disk('public')->delete($oldPath);
            }
            $data['thumbnail'] = $this->storeThumbnail($data['thumbnail']);
        }

        $article->update($data);
        return $article;
    }

    public function delete($id)
    {
        $article = $this->findById($id);

        if ($article->thumbnail) {
            // Dapatkan path relatif dari URL lengkap
            $path = str_replace(asset('storage/'), '', $article->getRawOriginal('thumbnail'));
            Storage::disk('public')->delete($path);
        }

        return $article->delete();
    }

    public function findBySlug($slug)
    {
        $article = $this->model->where('slug', $slug)->firstOrFail();
        
        // Fix thumbnail URL
        if ($article->thumbnail && !str_starts_with($article->thumbnail, 'http')) {
            $article->thumbnail = asset('storage/' . $article->thumbnail);
        }
        
        return $article;
    }

    public function updateBySlug($slug, array $data)
    {
        $article = $this->findBySlug($slug);

        if (isset($data['thumbnail']) && $data['thumbnail'] !== null) {
            if ($article->thumbnail) {
                // Dapatkan path relatif dari URL lengkap
                $oldPath = str_replace(asset('storage/'), '', $article->getRawOriginal('thumbnail'));
                Storage::disk('public')->delete($oldPath);
            }
            $data['thumbnail'] = $this->storeThumbnail($data['thumbnail']);
        }

        $article->update($data);
        return $article;
    }

    public function deleteBySlug($slug)
    {
        $article = $this->findBySlug($slug);

        if ($article->thumbnail) {
            // Dapatkan path relatif dari URL lengkap
            $path = str_replace(asset('storage/'), '', $article->getRawOriginal('thumbnail'));
            Storage::disk('public')->delete($path);
        }

        return $article->delete();
    }

    private function storeThumbnail($file)
    {
        // Simpan ke storage/app/public/thumbnails
        return $file->store('thumbnails', 'public');
    }
}