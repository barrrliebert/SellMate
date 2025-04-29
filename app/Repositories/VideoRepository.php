<?php
namespace App\Repositories;

use App\Models\Video;
use Illuminate\Support\Facades\Storage;

class VideoRepository
{
    protected $model;

    public function __construct(Video $model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        $videos = $this->model->all();
        
        // Fix video URLs for all videos
        foreach ($videos as $video) {
            if ($video->video_file && !str_starts_with($video->video_file, 'http')) {
                $video->video_file = asset('storage/' . $video->video_file);
            }
        }
        
        return $videos;
    }

    public function findById($id)
    {
        $video = $this->model->findOrFail($id);
        
        // Fix video URL to use storage URL
        if ($video->video_file && !str_starts_with($video->video_file, 'http')) {
            $video->video_file = asset('storage/' . $video->video_file);
        }
        
        return $video;
    }

    public function create(array $data)
    {
        if (isset($data['video_file'])) {
            // Simpan ke storage/app/public/videos
            $data['video_file'] = $data['video_file']->store('videos', 'public');
        }
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $video = $this->findById($id);
        
        if (isset($data['video_file']) && $data['video_file'] instanceof \Illuminate\Http\UploadedFile) {
            // Hapus video lama jika ada
            if ($video->video_file) {
                // Dapatkan path relatif dari URL lengkap
                $oldPath = str_replace(asset('storage/'), '', $video->getRawOriginal('video_file'));
                Storage::disk('public')->delete($oldPath);
            }
            
            // Simpan video baru
            $data['video_file'] = $data['video_file']->store('videos', 'public');
        } else {
            // Hapus kunci video_file dari data update agar tidak mengubah nilai yang ada
            unset($data['video_file']);
        }
        
        $video->update($data);
        return $video;
    }

    public function delete($id)
    {
        $video = $this->findById($id);
        
        // Hapus file video jika ada
        if ($video->video_file) {
            // Dapatkan path relatif dari URL lengkap
            $path = str_replace(asset('storage/'), '', $video->getRawOriginal('video_file'));
            Storage::disk('public')->delete($path);
        }
    
        return $video->delete();
    }
}