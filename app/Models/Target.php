<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Target extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'judul_target',
        'tanggal_mulai',
        'tanggal_target',
        'total_target'
    ];

    protected $appends = [
        'formatted_total_target',
        'progress_percentage',
        'current_omzet',
        'formatted_current_omzet'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_target' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedTotalTargetAttribute()
    {
        return 'Rp ' . number_format($this->total_target, 0, ',', '.');
    }

    public function getCurrentOmzetAttribute()
    {
        return Omzet::where('user_id', $this->user_id)
            ->whereBetween('tanggal', [$this->tanggal_mulai, $this->tanggal_target])
            ->get()
            ->sum('total_omzet');
    }

    public function getFormattedCurrentOmzetAttribute()
    {
        return 'Rp ' . number_format($this->current_omzet, 0, ',', '.');
    }

    public function getProgressPercentageAttribute()
    {
        return $this->total_target > 0 ? 
            min(100, round(($this->current_omzet / $this->total_target) * 100)) : 0;
    }
} 