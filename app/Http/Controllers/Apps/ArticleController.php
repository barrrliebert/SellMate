<?php

namespace App\Http\Controllers\Apps;

use App\Http\Requests\ArticleRequest;
use App\Repositories\ArticleRepository;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Controllers\Middleware;

class ArticleController extends Controller
{
    protected $repository;

    public function middleware($middleware, array $options = [])
    {
        return [
            new Middleware('permission:articles-data', only: ['index']),
            new Middleware('permission:articles-create', only: ['create', 'store']),
            new Middleware('permission:articles-update', only: ['edit', 'update']),
            new Middleware('permission:articles-delete', only: ['destroy']),
        ];
    }

    public function __construct(ArticleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        $articles = $this->repository->getAll();

        return inertia('Apps/Articles/Index', [
            'articles' => $articles  // $articles harus punya property 'data'
        ]);
    }

    public function create()
    {
        return inertia('Apps/Articles/Create');
    }

    public function store(ArticleRequest $request)
    {
        $this->repository->create($request->validated());
        return redirect()->route('apps.articles.index')->with('success', 'Article created successfully.');
    }

    public function edit($id)
    {
        $article = $this->repository->findById($id);
        return inertia('Apps/Articles/Edit', [
            'article' => $article
        ]);
    }

    public function update(ArticleRequest $request, $id)
    {
        $this->repository->update($id, $request->validated());
        return redirect()->route('apps.articles.index')->with('success', 'Article updated successfully.');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('apps.articles.index')->with('success', 'Article deleted successfully.');
    }
}