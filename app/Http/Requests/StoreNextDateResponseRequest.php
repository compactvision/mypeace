<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNextDateResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'food' => ['required', 'string', 'max:80'],
            'drink' => ['required', 'string', 'max:80'],
            'location_type' => ['required', 'string', 'max:80'],
            'atmosphere' => ['required', 'string', 'max:80'],
            'music_choice' => ['required', 'string', 'max:80'],
            'dessert_choice' => ['required', 'string', 'max:80'],
        ];
    }
}
