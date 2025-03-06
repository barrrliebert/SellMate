<?php
namespace App\Http\Controllers\Apps;

use App\Http\Requests\VideoRequest;
use App\Repositories\VideoRepository;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class VideoController extends Controller
{
    protected $repository;

    public function __construct(VideoRepository $repository)
    {
        $this->repository = $repository;
    }



    public function index()
    {
        $videos = $this->repository->getAll();
        return view('apps.videos.index', compact('videos'));
    }

    public function create()
    {
        return view('apps.videos.create');
    }

    public function store(VideoRequest $request)
    {
        $this->repository->create($request->validated());
        return redirect()->route('apps.videos.index')->with('success', 'Video created successfully.');
    }

    public function edit($id)
    {
        $video = $this->repository->findById($id);
        return view('apps.videos.edit', compact('video'));
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
