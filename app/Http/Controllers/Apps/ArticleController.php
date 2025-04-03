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

    public function edit($slug)
    {
        $article = $this->repository->findBySlug($slug);
        return inertia('Apps/Articles/Edit', [
            'article' => $article
        ]);
    }

    public function update(ArticleRequest $request, $slug)
    {
        $this->repository->updateBySlug($slug, $request->validated());
        return redirect()->route('apps.articles.index')->with('success', 'Article updated successfully.');
    }

    public function destroy($slug)
    {
        $this->repository->deleteBySlug($slug);
        return redirect()->route('apps.articles.index')->with('success', 'Article deleted successfully.');
    }

    // Menampilkan detail artikel
    public function show($id)
    {
        $article = $this->repository->findById($id);

        if (!$article) {
            return redirect()->route('apps.articles.index')->with('error', 'Article not found.');
        }

        return inertia('Apps/Articles/Show', [
            'article' => $article
        ]);
    }
}
