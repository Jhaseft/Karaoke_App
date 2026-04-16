<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GuestLoginController extends Controller
{
    public function store(Request $request)
    {
        $request->session()->put('guest', true);
        $request->session()->put('guest_favorites', []);
        $request->session()->put('guest_playlist', []);

        return redirect()->route('karaoke');
    }

    public function destroy(Request $request)
    {
        $request->session()->forget(['guest', 'guest_favorites', 'guest_playlist']);
        return redirect('/');
    }
}
