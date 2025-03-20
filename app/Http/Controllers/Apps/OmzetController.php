<?php

namespace App\Http\Controllers\Apps;

use App\Models\Omzet;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\OmzetRequest;
use Carbon\Carbon;

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
     * Get transaction records for all users (admin) or specific user
     */
    public function getTransactionRecords(Request $request)
    {
        // Check if user is admin
        $isAdmin = auth()->user()->hasRole('super-admin');

        $query = Omzet::with(['user', 'product'])
            ->latest();

        // If not admin, only get user's transactions
        if (!$isAdmin) {
            $query->where('user_id', Auth::id());
        }

        // Add search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        // Add date filtering
        if ($request->has('filter_type')) {
            $filterType = $request->filter_type;
            $now = now();

            switch ($filterType) {
                case 'today':
                    $query->whereDate('tanggal', $now);
                    break;
                case 'week':
                    $startOfWeek = $now->copy()->startOfWeek(Carbon::MONDAY);
                    $endOfWeek = $now->copy()->endOfWeek(Carbon::SUNDAY);
                    $query->whereBetween('tanggal', [$startOfWeek, $endOfWeek]);
                    break;
                case 'month':
                    $query->whereMonth('tanggal', $now->month)
                         ->whereYear('tanggal', $now->year);
                    break;
                case 'custom':
                    if ($request->has('start_date') && $request->has('end_date')) {
                        $query->whereBetween('tanggal', [
                            Carbon::parse($request->start_date)->startOfDay(),
                            Carbon::parse($request->end_date)->endOfDay()
                        ]);
                    }
                    break;
            }
        }

        $omzets = $query->get()
            ->map(function($omzet) use ($isAdmin) {
                $data = [
                    'id' => $omzet->id,
                    'tanggal' => $omzet->tanggal,
                    'formatted_omzet' => $omzet->formatted_omzet,
                    'total_omzet' => $omzet->total_omzet
                ];

                if (!$isAdmin) {
                    $data['product'] = [
                        'nama_produk' => $omzet->product->nama_produk,
                        'foto_produk' => $omzet->product->foto_produk
                    ];
                } else {
                    $data['user'] = [
                        'name' => $omzet->user->name,
                        'major' => $omzet->user->major
                    ];
                }

                return $data;
            });

        return response()->json([
            'omzets' => $omzets
        ]);
    }

    /**
     * Get user's commission records
     */
    public function getCommissionRecords(Request $request)
    {
        $query = Omzet::with('product')
            ->where('user_id', Auth::id())
            ->latest();

        // Add date filtering
        if ($request->has('filter_type')) {
            $filterType = $request->filter_type;
            $now = now();

            switch ($filterType) {
                case 'today':
                    $query->whereDate('tanggal', $now);
                    break;
                case 'week':
                    $startOfWeek = $now->copy()->startOfWeek(Carbon::MONDAY);
                    $endOfWeek = $now->copy()->endOfWeek(Carbon::SUNDAY);
                    $query->whereBetween('tanggal', [$startOfWeek, $endOfWeek]);
                    break;
                case 'month':
                    $query->whereMonth('tanggal', $now->month)
                         ->whereYear('tanggal', $now->year);
                    break;
                case 'custom':
                    if ($request->has('start_date') && $request->has('end_date')) {
                        $query->whereBetween('tanggal', [
                            Carbon::parse($request->start_date)->startOfDay(),
                            Carbon::parse($request->end_date)->endOfDay()
                        ]);
                    }
                    break;
            }
        }

        $commissions = $query->get()
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
    public function getTopOmzet(Request $request)
    {
        $query = Omzet::with(['user', 'product']);

        // Add search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        // Add date filtering
        if ($request->has('filter_type')) {
            $filterType = $request->filter_type;
            $now = now();

            switch ($filterType) {
                case 'today':
                    $query->whereDate('tanggal', $now);
                    break;
                case 'week':
                    $startOfWeek = $now->copy()->startOfWeek(Carbon::MONDAY);
                    $endOfWeek = $now->copy()->endOfWeek(Carbon::SUNDAY);
                    $query->whereBetween('tanggal', [$startOfWeek, $endOfWeek]);
                    break;
                case 'month':
                    $query->whereMonth('tanggal', $now->month)
                         ->whereYear('tanggal', $now->year);
                    break;
                case 'custom':
                    if ($request->has('start_date') && $request->has('end_date')) {
                        $query->whereBetween('tanggal', [
                            Carbon::parse($request->start_date)->startOfDay(),
                            Carbon::parse($request->end_date)->endOfDay()
                        ]);
                    }
                    break;
                default:
                    $query->whereMonth('tanggal', $now->month)
                         ->whereYear('tanggal', $now->year);
            }
        }

        $topUsers = $query->get()
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

    /**
     * Get total omzet from all users
     */
    public function getTotalOmzet()
    {
        $totalOmzet = Omzet::with('product')
            ->get()
            ->sum('total_omzet');

        return response()->json([
            'total_omzet' => 'Rp ' . number_format($totalOmzet, 0, ',', '.')
        ]);
    }

    /**
     * Get total products
     */
    public function getTotalProducts()
    {
        $totalProducts = \App\Models\Product::count();

        return response()->json([
            'total' => $totalProducts
        ]);
    }

    /**
     * Get total users
     */
    public function getTotalUsers()
    {
        $totalUsers = \App\Models\User::whereHas('roles', function($query) {
            $query->where('name', 'users-access');
        })->count();

        return response()->json([
            'total' => $totalUsers
        ]);
    }

    /**
     * Export transactions to PDF based on filter
     */
    public function exportPdf(Request $request)
    {
        $filter = $request->query('filter', 'today');
        $currentTime = now();
        
        $query = Omzet::with(['user', 'product']);

        // Apply date filter
        switch ($filter) {
            case 'today':
                $query->whereDate('tanggal', $currentTime);
                break;
            case 'week':
                $startOfWeek = $currentTime->copy()->startOfWeek(Carbon::MONDAY);
                $endOfWeek = $currentTime->copy()->endOfWeek(Carbon::SUNDAY);
                $query->whereBetween('tanggal', [$startOfWeek->format('Y-m-d'), $endOfWeek->format('Y-m-d')]);
                break;
            case '3months':
                $query->whereBetween('tanggal', [
                    $currentTime->copy()->subMonths(3)->format('Y-m-d'), 
                    $currentTime->format('Y-m-d')
                ]);
                break;
            case '6months':
                $query->whereBetween('tanggal', [
                    $currentTime->copy()->subMonths(6)->format('Y-m-d'), 
                    $currentTime->format('Y-m-d')
                ]);
                break;
            case '12months':
                $query->whereBetween('tanggal', [
                    $currentTime->copy()->subMonths(12)->format('Y-m-d'), 
                    $currentTime->format('Y-m-d')
                ]);
                break;
            case 'custom':
                if ($request->has('start_date') && $request->has('end_date')) {
                    $query->whereBetween('tanggal', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay()
                    ]);
                }
                break;
            default:
                $query->whereDate('tanggal', $currentTime);
        }

        $transactions = $query->latest()->get();

        // Generate PDF using DomPDF
        $pdf = \PDF::loadView('pdf.transactions', [
            'transactions' => $transactions,
            'filter' => $filter,
            'dateRange' => $this->getDateRangeText($filter, $currentTime, $request),
            'exportTime' => $currentTime
        ]);

        return $pdf->download('transactions.pdf');
    }

    /**
     * Get date range text for PDF header
     */
    private function getDateRangeText($filter, $currentTime, $request = null)
    {
        switch ($filter) {
            case 'today':
                return 'Hari ini (' . $currentTime->format('d/m/Y') . ')';
            case 'week':
                $startOfWeek = $currentTime->copy()->startOfWeek(Carbon::MONDAY);
                $endOfWeek = $currentTime->copy()->endOfWeek(Carbon::SUNDAY);
                return 'Minggu ini (' . $startOfWeek->format('d/m/Y') . ' - ' . $endOfWeek->format('d/m/Y') . ')';
            case '3months':
                return '3 Bulan terakhir (' . $currentTime->copy()->subMonths(3)->format('d/m/Y') . ' - ' . $currentTime->format('d/m/Y') . ')';
            case '6months':
                return '6 Bulan terakhir (' . $currentTime->copy()->subMonths(6)->format('d/m/Y') . ' - ' . $currentTime->format('d/m/Y') . ')';
            case '12months':
                return '12 Bulan terakhir (' . $currentTime->copy()->subMonths(12)->format('d/m/Y') . ' - ' . $currentTime->format('d/m/Y') . ')';
            case 'custom':
                if ($request && $request->has('start_date') && $request->has('end_date')) {
                    $startDate = Carbon::parse($request->start_date)->format('d/m/Y');
                    $endDate = Carbon::parse($request->end_date)->format('d/m/Y');
                    return 'Periode (' . $startDate . ' - ' . $endDate . ')';
                }
                return 'Custom periode';
            default:
                return 'Semua waktu';
        }
    }
} 