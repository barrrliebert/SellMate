<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function exportOmzet(Request $request)
    {
        // Jika ada query parameter start_date dan end_date, gunakan untuk filter
    $startDate = $request->query('start_date') 
    ? \Carbon\Carbon::parse($request->query('start_date'))->startOfDay()
    : \Carbon\Carbon::now()->startOfMonth();
$endDate   = $request->query('end_date')
    ? \Carbon\Carbon::parse($request->query('end_date'))->endOfDay()
    : \Carbon\Carbon::now()->endOfMonth();

$omzetList = \App\Models\Omzet::with('user')
    ->whereBetween('tanggal', [$startDate, $endDate])
    ->get();

$pdf = Pdf::loadView('omzet', compact('omzetList', 'startDate', 'endDate'));
return $pdf->download('laporan_omzet.pdf');
    }
}