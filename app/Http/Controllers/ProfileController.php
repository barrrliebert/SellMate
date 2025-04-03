<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse|JsonResponse
    {
        // Get validated data excluding avatar and password
        $validatedData = $request->safe()->except(['avatar', 'password', 'password_confirmation']);
        
        // Update user with validated data
        $request->user()->fill($validatedData);

        // Check if email was changed
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // Update password if provided
        if ($request->filled('password')) {
            $request->user()->password = bcrypt($request->password);
        }

        // Handle avatar upload only if a new file is provided
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // Delete the old avatar if it exists
            if ($request->user()->getAvatarPath()) {
                Storage::disk('public')->delete('avatars/' . $request->user()->getAvatarPath());
            }
            
            // Store the new avatar
            $avatar = $request->file('avatar');
            $filename = time() . '_' . $request->user()->id . '.' . $avatar->getClientOriginalExtension();
            
            // Store image and handle potential failure
            try {
                $avatar->storeAs('avatars', $filename, 'public');
                // Update the user's avatar field with just the filename
                $request->user()->avatar = $filename;
            } catch (\Exception $e) {
                // Log error or handle storage failure
                Log::error('Avatar upload failed: ' . $e->getMessage());
                
                if ($request->wantsJson()) {
                    return response()->json([
                        'message' => 'Profile updated but avatar upload failed',
                        'error' => 'Failed to save image'
                    ], 422);
                }
            }
        }

        // Save changes
        $request->user()->save();

        // Return appropriate response
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $request->user(),
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
