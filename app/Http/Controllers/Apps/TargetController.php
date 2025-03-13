<?php

namespace App\Http\Controllers\Apps;

use App\Models\Target;
use App\Models\Omzet;
use App\Http\Controllers\Controller;
use App\Http\Requests\TargetRequest;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(TargetRequest $request)
    {
        // Check if user already has a target
        $existingTarget = Target::where('user_id', Auth::id())->first();
        
        if ($existingTarget) {
            return back()->with('error', 'Anda sudah memiliki target yang aktif.');
        }

        // create target
        Target::create([
            'user_id' => Auth::id(),
            'judul_target' => $request->judul_target,
            'tanggal_mulai' => now(),
            'tanggal_target' => $request->tanggal_target,
            'total_target' => $request->total_target,
        ]);

        // return response
        return back()->with('success', 'Target berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TargetRequest $request, Target $target)
    {
        // Check if target belongs to user
        if ($target->user_id !== Auth::id()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah target ini.');
        }

        // update target
        $target->update([
            'judul_target' => $request->judul_target,
            'tanggal_target' => $request->tanggal_target,
            'total_target' => $request->total_target,
        ]);

        // return response
        return back()->with('success', 'Target berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Target $target)
    {
        // Check if target belongs to user
        if ($target->user_id !== Auth::id()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menghapus target ini.');
        }

        // delete target
        $target->delete();

        // return response
        return back()->with('success', 'Target berhasil dihapus.');
    }

    /**
     * Get user's current target with progress
     */
    public function getCurrentTarget()
    {
        $target = Target::where('user_id', Auth::id())->first();
        
        if (!$target) {
            return response()->json([
                'target' => null
            ]);
        }

        // Get total omzet for the target period
        $totalOmzet = Omzet::where('user_id', Auth::id())
            ->whereBetween('tanggal', [$target->tanggal_mulai, $target->tanggal_target])
            ->get()
            ->sum('total_omzet');

        $progress = $target->total_target > 0 ? 
            min(100, round(($totalOmzet / $target->total_target) * 100)) : 0;

        return response()->json([
            'target' => array_merge($target->toArray(), [
                'current_omzet' => 'Rp ' . number_format($totalOmzet, 0, ',', '.'),
                'progress' => $progress
            ])
        ]);
    }
} 