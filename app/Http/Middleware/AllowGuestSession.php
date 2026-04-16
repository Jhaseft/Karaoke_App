<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowGuestSession
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() || $request->session()->get('guest')) {
            return $next($request);
        }

        return redirect()->route('login');
    }
}
