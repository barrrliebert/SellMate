<?php

namespace App\Http\Controllers\Apps;

use App\Http\Requests\VideoRequest;
use App\Repositories\VideoRepository;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class VideoController extends Controller
{
    protected $repository;

    public function __construct(VideoRepository $repository)
    {
        $this->repository = $repository;
    }

    public function middleware($middleware, array $options = [])
    {
        return [
            new Middleware('permission:videos-data', only: ['index']),
            new Middleware('permission:videos-create', only: ['create', 'store']),
            new Middleware('permission:videos-update', only: ['edit', 'update']),
            new Middleware('permission:videos-delete', only: ['destroy']),
        ];
    }

    public function index()
    {
        $videos = $this->repository->getAll();
        return Inertia::render('Apps/Videos/Index', [
            'videos' => $videos
        ]);
    }

    public function create()
    {
        return Inertia::render('Apps/Videos/Create');
    }

    public function store(VideoRequest $request)
    {
        $this->repository->create($request->validated());
        return redirect()->route('apps.videos.index')->with('success', 'Video created successfully.');
    }

    public function edit($id)
    {
        $video = $this->repository->findById($id);
        return Inertia::render('Apps/Videos/Edit', [
            'video' => $video
        ]);
    }

    public function update(VideoRequest $request, $id)
    {
        $this->repository->update($id, $request->validated());
        return redirect()->route('apps.videos.index')->with('success', 'Video updated successfully.');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('apps.videos.index')->with('success', 'Video deleted successfully.');
    }
}