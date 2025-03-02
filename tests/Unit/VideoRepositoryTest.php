<?php

namespace Tests\Unit;

use App\Models\Videos;
use App\Repositories\VideoRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;

use Illuminate\Support\Facades\Storage;

class VideoRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $videoRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->videoRepository = new VideoRepository(new Videos());
    }

    /** @test */
    public function it_can_create_a_video()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('video.mp4', 1000, 'video/mp4');

        $data = [
            'video_file' => $file,
            'title' => 'Test Video',
            'description' => 'This is a test video',
            'link' => 'https://example.com/video',
            'source' => 'YouTube',
        ];

        $video = $this->videoRepository->create($data);

        $this->assertDatabaseHas('videos', [
            'title' => 'Test Video',
        ]);

        Storage::assertExists('public/' . $video->file_video);
    }

    /** @test */
    public function it_can_get_all_videos()
    {
        Videos::factory()->count(3)->create();

        $videos = $this->videoRepository->getAll();

        $this->assertCount(3, $videos);
    }

    /** @test */
    public function it_can_find_a_video_by_id()
    {
        $video = Videos::factory()->create([
            'title' => 'Find Me'
        ]);

        $foundVideo = $this->videoRepository->findById($video->id);

        $this->assertEquals('Find Me', $foundVideo->title);
    }

    /** @test */
    public function it_can_update_a_video()
    {
        $video = Videos::factory()->create([
            'title' => 'Old Title'
        ]);

        $updatedVideo = $this->videoRepository->update($video->id, ['title' => 'New Title']);

        $this->assertEquals('New Title', $updatedVideo->title);
        $this->assertDatabaseHas('videos', ['title' => 'New Title']);
    }

    /** @test */
    public function it_can_delete_a_video()
    {
        $video = Videos::factory()->create();

        $this->videoRepository->delete($video->id);

        $this->assertDatabaseMissing('videos', ['id' => $video->id]);
    }
}

