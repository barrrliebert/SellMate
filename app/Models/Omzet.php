<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Omzet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'jumlah_omzet',
        'tanggal'
    ];

    protected $appends = ['formatted_omzet', 'formatted_komisi'];

    protected $casts = [
        'tanggal' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getFormattedOmzetAttribute()
    {
        $total = $this->jumlah_omzet * $this->product->harga_produk;
        return 'Rp ' . number_format($total, 0, ',', '.');
    }

    public function getFormattedKomisiAttribute()
    {
        $komisi = $this->jumlah_omzet * ($this->product->harga_produk * $this->product->komisi_produk / 100);
        return 'Rp ' . number_format($komisi, 0, ',', '.');
    }

    public function getKomisiValueAttribute()
    {
        return $this->jumlah_omzet * ($this->product->harga_produk * $this->product->komisi_produk / 100);
    }

    public function getTotalOmzetAttribute()
    {
        return $this->jumlah_omzet * $this->product->harga_produk;
    }
} 