<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\YoutubeSearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal: buscador de karaoke
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// API: búsqueda y trending vía Invidious, streams vía yt-dlp
Route::get('/api/search', [YoutubeSearchController::class, 'search'])->name('search');
Route::get('/api/trending', [YoutubeSearchController::class, 'trending'])->name('trending');
Route::get('/api/streams/{videoId}', [YoutubeSearchController::class, 'streams'])->name('streams');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/karaoke', function () {
    return Inertia::render('Karaoke');
})->name('karaoke');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
