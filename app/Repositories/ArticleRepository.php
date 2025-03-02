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
        if (isset($data['file_article'])) {
            $data['file_article'] = $this->storeFile($data['file_article']);
        }

        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $article = $this->findById($id);

        if (isset($data['file_article'])) {
            // delete old file
            if ($article->file_article) {
                Storage::delete($article->file_article);
            }
            $data['file_article'] = $this->storeFile($data['file_article']);
        }

        $article->update($data);
        return $article;
    }

    public function delete($id)
    {
        $article = $this->findById($id);

        //  delete file if exists
        if ($article->file_article) {
            Storage::delete($article->file_article);
        }

        return $article->delete();
    }

    private function storeFile($file)
    {
        return $file->store('articles', 'public'); // Simpan di storage/app/public/articles
    }
}
