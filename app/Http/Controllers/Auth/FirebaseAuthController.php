<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;

class FirebaseAuthController extends Controller
{
    public function __construct(private readonly FirebaseAuth $firebaseAuth) {}

    public function store(Request $request)
    {
        set_time_limit(120);
        $request->validate(['id_token' => 'required|string']);

        // Verificar el token de Firebase y obtener los datos del usuario
        try {
            $verifiedToken = $this->firebaseAuth->verifyIdToken($request->id_token);
        } catch (FailedToVerifyToken) {
            throw ValidationException::withMessages([
                'id_token' => 'Token de Firebase inválido o expirado.',
            ]);
        }

        $uid   = $verifiedToken->claims()->get('sub');
        $email = $verifiedToken->claims()->get('email');
        $name  = $verifiedToken->claims()->get('name') ?? explode('@', $email)[0];
        $photo = $verifiedToken->claims()->get('picture');

        // Buscar por firebase_uid o por email
        $user = User::where('firebase_uid', $uid)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            $user->update(['firebase_uid' => $uid, 'avatar' => $photo]);
        } else {
            $user = User::create([
                'firebase_uid'      => $uid,
                'name'              => $name,
                'email'             => $email,
                'avatar'            => $photo,
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('karaoke'));
    }
}
