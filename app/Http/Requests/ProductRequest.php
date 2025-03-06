<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_produk' => 'required|string|max:255',
            'deskripsi_produk' => 'nullable|string',
            'harga_produk' => 'required|numeric|min:0',
            'komisi_produk' => 'required|integer|min:0|max:100',
            'kategori' => 'required|in:produk,jasa',
            'foto_produk' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_produk.required' => 'Nama produk wajib diisi',
            'nama_produk.max' => 'Nama produk maksimal 255 karakter',
            'harga_produk.required' => 'Harga produk wajib diisi',
            'harga_produk.numeric' => 'Harga produk harus berupa angka',
            'harga_produk.min' => 'Harga produk minimal 0',
            'komisi_produk.required' => 'Komisi produk wajib diisi',
            'komisi_produk.integer' => 'Komisi produk harus berupa angka bulat',
            'komisi_produk.min' => 'Komisi produk minimal 0%',
            'komisi_produk.max' => 'Komisi produk maksimal 100%',
            'kategori.required' => 'Kategori wajib diisi',
            'kategori.in' => 'Kategori harus berupa produk atau jasa',
            'foto_produk.image' => 'File harus berupa gambar',
            'foto_produk.mimes' => 'Format gambar harus jpg, jpeg, atau png',
            'foto_produk.max' => 'Ukuran gambar maksimal 2MB'
        ];
    }
} 