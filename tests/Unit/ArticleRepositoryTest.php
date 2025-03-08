<?php

namespace Tests\Unit;

use App\Models\Article;
use App\Repositories\ArticleRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArticleRepositoryTest extends TestCase
{
    use RefreshDatabase; // Membersihkan database sebelum menjalankan test

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new ArticleRepository(new Article());
    }

    /** @test */
    public function it_can_create_an_article()
    {
        
            Storage::fake('public'); // Gunakan penyimpanan sementara untuk testing
    
            // Simulasi file artikel PDF
            $fakeFile = UploadedFile::fake()->create('test_article.pdf', 100);
            
            // Simulasi file thumbnail JPG
            $fakeThumbnail = UploadedFile::fake()->image('thumbnail.jpg');
    
            // Buat data artikel dengan file yang benar
            $articleData = Article::factory()->make()->toArray();
            $articleData['file_article'] = $fakeFile;
            $articleData['thumbnail'] = $fakeThumbnail;
    
            // Jalankan metode create dari repository
            $article = $this->repository->create($articleData);
    
            // Pastikan artikel masuk ke database
            $this->assertDatabaseHas('articles', [
                'title' => $articleData['title'],
            ]);
    
            // Pastikan file artikel tersimpan di storage
            $this->assertTrue(Storage::disk('public')->exists($article->file_article));
    
            // Pastikan thumbnail tersimpan di storage
            $this->assertTrue(Storage::disk('public')->exists($article->thumbnail));
        }

    /** @test */
    public function it_can_delete_an_article()
    {
        $article = Article::factory()->create();

        $this->repository->delete($article->id);

        $this->assertDatabaseMissing('articles', [
            'id' => $article->id,
        ]);
    }
}


