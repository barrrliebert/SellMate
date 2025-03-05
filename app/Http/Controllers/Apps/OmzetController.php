<?php

namespace App\Http\Controllers\Apps;

use App\Models\Omzet;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\OmzetRequest;

class OmzetController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(OmzetRequest $request)
    {
        // create omzet
        $omzet = Omzet::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'jumlah_omzet' => $request->jumlah_omzet,
            'tanggal' => $request->tanggal,
        ]);

        // return response
        return back()->with('success', 'Omzet berhasil ditambahkan.');
    }

    /**
     * Get user's transaction records
     */
    public function getTransactionRecords()
    {
        $omzets = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'omzets' => $omzets
        ]);
    }

    /**
     * Get user's commission records
     */
    public function getCommissionRecords()
    {
        $commissions = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function($omzet) {
                return [
                    'tanggal' => $omzet->tanggal,
                    'product' => $omzet->product->nama_produk,
                    'foto_produk' => $omzet->product->foto_produk,
                    'omzet' => $omzet->formatted_omzet,
                    'komisi' => $omzet->formatted_komisi
                ];
            });

        return response()->json([
            'commissions' => $commissions
        ]);
    }

    /**
     * Get total omzet for all users this month
     */
    public function getTopOmzet()
    {
        $topUsers = Omzet::with(['user', 'product'])
            ->whereMonth('tanggal', now()->month)
            ->get()
            ->groupBy('user_id')
            ->map(function ($omzets) {
                $totalOmzet = $omzets->sum('total_omzet');
                $user = $omzets->first()->user;
                return [
                    'name' => $user->name,
                    'major' => $user->major ?? 'Belum diisi',
                    'avatar' => $user->avatar ?? null,
                    'total_omzet' => $totalOmzet,
                    'formatted_omzet' => 'Rp ' . number_format($totalOmzet, 0, ',', '.')
                ];
            })
            ->sortByDesc('total_omzet')
            ->values();

        return response()->json([
            'top_users' => $topUsers
        ]);
    }

    /**
     * Get user's total omzet
     */
    public function getUserTotalOmzet()
    {
        $omzets = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->get();

        $totalOmzet = $omzets->sum('total_omzet');

        return response()->json([
            'total_omzet' => 'Rp ' . number_format($totalOmzet, 0, ',', '.')
        ]);
    }

    /**
     * Get user's weekly average omzet
     */
    public function getUserWeeklyAverageOmzet()
    {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $weeklyOmzets = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->whereBetween('tanggal', [$startOfWeek, $endOfWeek])
            ->get();

        $totalOmzet = $weeklyOmzets->sum('total_omzet');
        $totalProducts = $weeklyOmzets->sum('jumlah_omzet');

        $averageOmzet = $totalProducts > 0 ? $totalOmzet / $totalProducts : 0;

        return response()->json([
            'total_omzet' => 'Rp ' . number_format($totalOmzet, 0, ',', '.'),
            'total_products' => $totalProducts,
            'average_omzet' => 'Rp ' . number_format($averageOmzet, 0, ',', '.')
        ]);
    }

    /**
     * Get user's total commission
     */
    public function getUserTotalCommission()
    {
        $omzets = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->get();

        $totalKomisi = $omzets->sum(function($omzet) {
            return $omzet->komisi_value;
        });

        return response()->json([
            'total_komisi' => 'Rp ' . number_format($totalKomisi, 0, ',', '.')
        ]);
    }
} 