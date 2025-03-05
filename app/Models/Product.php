<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['formatted_harga', 'formatted_komisi'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_produk',
        'deskripsi_produk',
        'harga_produk',
        'komisi_produk',
        'kategori',
        'foto_produk',
    ];

    /**
     * accessor foto_produk
     */
    protected function fotoProduk(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value != null ? asset('/storage/products/' . $value) : null,
        );
    }

    /**
     * Format harga to rupiah
     */
    public function getFormattedHargaAttribute()
    {
        return 'Rp ' . number_format($this->harga_produk, 0, ',', '.');
    }

    /**
     * Format komisi to percentage
     */
    public function getFormattedKomisiAttribute()
    {
        return number_format($this->komisi_produk, 0) . '%';
    }
} 