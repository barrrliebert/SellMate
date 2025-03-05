<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

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
} 