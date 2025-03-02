<?php

namespace App\Http\Controllers\Apps;

use App\Http\Requests\ArticleRequest;
use App\Repositories\ArticleRepository;
use Illuminate\Routing\Controller;

class ArticleController extends Controller
{
    protected $repository;

    public function __construct(ArticleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        $articles = $this->repository->getAll();
        return view('articles.index', compact('articles'));
    }

    public function create()
    {
        return view('articles.create');
    }

    public function store(ArticleRequest $request)
    {
        $this->repository->create($request->validated());
        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }

    public function edit($id)
    {
        $article = $this->repository->findById($id);
        return view('articles.edit', compact('article'));
    }

    public function update(ArticleRequest $request, $id)
    {
        $this->repository->update($id, $request->validated());
        return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
    }
}
