<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'school' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', 'min:8', Rules\Password::defaults()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised(),
            ],
        ], [
            'name.required' => 'Nama lengkap wajib diisi',
            'name.max' => 'Nama lengkap maksimal 255 karakter',
            'school.required' => 'Nama sekolah wajib diisi',
            'school.max' => 'Nama sekolah maksimal 255 karakter',
            'major.required' => 'Jurusan wajib diisi',
            'major.max' => 'Jurusan maksimal 255 karakter',
            'username.required' => 'Username wajib diisi',
            'username.unique' => 'Username sudah digunakan',
            'username.max' => 'Username maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'password.mixed' => 'Password harus mengandung huruf besar dan kecil',
            'password.numbers' => 'Password harus mengandung angka',
            'password.symbols' => 'Password harus mengandung simbol',
            'password.uncompromised' => 'Password yang Anda masukkan terlalu umum. Mohon gunakan password yang lebih unik',
        ]);

        $user = User::create([
            'name' => $request->name,
            'school' => $request->school,
            'major' => $request->major,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default role to user
        $user->assignRole('users-access');

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on role
        if ($user->hasRole('users-access')) {
            return redirect(route('apps.user.dashboard', absolute: false));
        }

        return redirect(route('apps.dashboard', absolute: false));
    }
}
