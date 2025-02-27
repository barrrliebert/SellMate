<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Apps/UserDashboard/Index', [
            'user' => auth()->user()
        ]);
    }
} 