<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OmzetRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'jumlah_omzet' => 'required|integer|min:1',
            'tanggal' => 'required|date'
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
            'product_id.required' => 'Produk wajib dipilih',
            'product_id.exists' => 'Produk tidak ditemukan',
            'jumlah_omzet.required' => 'Jumlah produk wajib diisi',
            'jumlah_omzet.integer' => 'Jumlah produk harus berupa angka bulat',
            'jumlah_omzet.min' => 'Jumlah produk minimal 1',
            'tanggal.required' => 'Tanggal wajib diisi',
            'tanggal.date' => 'Format tanggal tidak valid'
        ];
    }
} 