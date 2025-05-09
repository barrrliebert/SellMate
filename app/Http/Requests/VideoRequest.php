<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VideoRequest extends FormRequest
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
            'video_file' => $this->isMethod('post')
            ? 'required|mimes:mp4,mov,ogg,qt|max:20000'
            : 'nullable|mimes:mp4,mov,ogg,qt|max:20000',
        'title'       => 'required|string|max:255',
        'description' => 'nullable|string',
        'source'      => 'nullable|string',
        ];
    }
}