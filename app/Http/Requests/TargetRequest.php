<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TargetRequest extends FormRequest
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
            'judul_target' => 'required|string|max:255',
            'tanggal_target' => 'required|date|after:today',
            'total_target' => 'required|numeric|min:1'
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
            'judul_target.required' => 'Judul target wajib diisi',
            'judul_target.max' => 'Judul target maksimal 255 karakter',
            'tanggal_target.required' => 'Tanggal target wajib diisi',
            'tanggal_target.date' => 'Format tanggal tidak valid',
            'tanggal_target.after' => 'Tanggal target harus setelah hari ini',
            'total_target.required' => 'Total target wajib diisi',
            'total_target.numeric' => 'Total target harus berupa angka',
            'total_target.min' => 'Total target minimal 1'
        ];
    }
} 