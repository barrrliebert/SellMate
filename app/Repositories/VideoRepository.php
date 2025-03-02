<?php
namespace App\Repositories;

use App\Models\Videos;
use Illuminate\Support\Facades\Storage;

class VideoRepository
{
    protected $model;

    public function __construct(Videos $model)
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
        if (isset($data['video_file'])) {
            $data['video_file'] = $data['video_file']->store('videos', 'public');
        }
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $video = $this->findById($id);
        if (isset($data['video_file'])) {
            Storage::disk('public')->delete($video->file_video);
            $data['video_file'] = $data['video_file']->store('videos', 'public');
        }
        $video->update($data);
        return $video;
    }

    public function delete($id)
    {
        $video = $this->findById($id);
        if ($video->file_video) {
            Storage::delete($video->file_video);
        }
    
        return $video->delete();
    }
}