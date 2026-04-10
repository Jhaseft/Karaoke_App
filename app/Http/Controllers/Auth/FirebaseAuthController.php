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

        // Buscar o crear el usuario en la base de datos
        $user = User::firstOrCreate(
            ['firebase_uid' => $uid],
            [
                'name'              => $name,
                'email'             => $email,
                'avatar'            => $photo,
                'email_verified_at' => now(),
            ]
        );

        // Si ya existía por email (registro normal previo), vincular el firebase_uid
        if (! $user->wasRecentlyCreated && ! $user->firebase_uid) {
            $user->update(['firebase_uid' => $uid, 'avatar' => $photo]);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
