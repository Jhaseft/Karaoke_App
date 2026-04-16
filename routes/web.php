<?php

use App\Http\Controllers\Auth\GuestLoginController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\PopularKaraokeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\YoutubeController;
use App\Http\Controllers\YoutubeSearchController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal: redirige a karaoke si está autenticado
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('karaoke');
    }
    return Inertia::render('Welcome');
})->name('home');

// API: búsqueda y trending vía Invidious, streams vía yt-dlp
Route::withoutMiddleware(\Inertia\Middleware::class)->group(function () {
    Route::get('/api/search', [YoutubeSearchController::class, 'search'])->name('search');
    Route::get('/api/trending', [YoutubeSearchController::class, 'trending'])->name('trending');
    Route::get('/api/streams/{videoId}', [YoutubeSearchController::class, 'streams'])->name('streams');
});

Route::post('/auth/guest', [GuestLoginController::class, 'store'])->name('guest.login');
Route::post('/auth/guest/logout', [GuestLoginController::class, 'destroy'])->name('guest.logout');

// Devuelve [] para invitados sin autenticación
Route::get('/api/favorites', fn() => Auth::check() ? app(FavoritesController::class)->index(request()) : response()->json([]));
Route::post('/api/favorites', fn() => Auth::check() ? app(FavoritesController::class)->store(request()) : response()->json([]));
Route::delete('/api/favorites/{videoId}', fn($videoId) => Auth::check() ? app(FavoritesController::class)->destroy(request(), $videoId) : response()->json([]));
Route::get('/api/playlist', fn() => Auth::check() ? app(PlaylistController::class)->index(request()) : response()->json([]));
Route::post('/api/playlist', fn() => Auth::check() ? app(PlaylistController::class)->store(request()) : response()->json([]));
Route::delete('/api/playlist/{videoId}', fn($videoId) => Auth::check() ? app(PlaylistController::class)->destroy(request(), $videoId) : response()->json([]));

Route::get('/karaoke', function () {
    return Inertia::render('Karaoke');
})->middleware('guest.session')->name('karaoke');

Route::withoutMiddleware(\Inertia\Middleware::class)->middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
