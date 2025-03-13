<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Video;
use App\Models\Article;

class UserDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Apps/UserDashboard/Index', [
            'user' => auth()->user()
        ]);
    }

    public function omzet()
    {
        $products = Product::latest()->get();

        return Inertia::render('Apps/UserDashboard/Omzet/Index', [
            'products' => $products
        ]);
    }

    public function transactions()
    {
        return inertia('Apps/UserDashboard/Detail', [
            'type' => 'transactions'
        ]);
    }

    public function commissions()
    {
        return inertia('Apps/UserDashboard/Detail', [
            'type' => 'commissions'
        ]);
    }

    public function topOmzet()
    {
        return inertia('Apps/UserDashboard/Detail', [
            'type' => 'topOmzet'
        ]);
    }

    /**
     * Display target page
     */
    public function target()
    {
        return inertia('Apps/UserDashboard/Target/Index');
    }

    /**
     * Display target edit page
     */
    public function editTarget()
    {
        return inertia('Apps/UserDashboard/Target/Edit');
    }

    /**
     * Display video page
     */
    public function video()
    {
        return Inertia::render('Apps/UserDashboard/Video/Index', [
            'videos' => Video::latest()->get()
        ]);
    }

    public function showVideo(Video $video)
    {
        // Increment view count
        $video->increment('views');

        return Inertia::render('Apps/UserDashboard/Video/Show', [
            'video' => $video
        ]);
    }

    /**
     * Display article page
     */
    public function article()
    {
        return Inertia::render('Apps/UserDashboard/Article/Index', [
            'articles' => Article::latest()->get()
        ]);
    }

    /**
     * Display article detail page
     */
    public function showArticle(Article $article)
    {
        return Inertia::render('Apps/UserDashboard/Article/Show', [
            'article' => $article
        ]);
    }
} 