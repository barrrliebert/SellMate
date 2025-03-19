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
        return $this->model->all();
    }

    public function findById($id)
    {
        return $this->model->findOrFail($id);
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

          if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
        // Hapus thumbnail lama jika ada
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }
        
        // Simpan thumbnail baru
        $data['thumbnail'] = $this->storeThumbnail($data['thumbnail']);
    } else {
        // Hapus kunci thumbnail dari data update agar tidak mengubah nilai yang ada
        unset($data['thumbnail']);
    }
    
    $article->update($data);
    return $article;

    }

    public function delete($id)
    {
        $article = $this->findById($id);


        if ($article->thumbnail) {
            Storage::delete($article->thumbnail);
        }

        return $article->delete();
    }

    private function storeThumbnail($file)
    {
        return $file->store('thumbnails', 'public');
    }
}