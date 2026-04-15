<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoritesController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favorites()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($f) => [
                'videoId'   => $f->video_id,
                'title'     => $f->title,
                'author'    => $f->artist,
                'duration'  => $f->duration,
                'thumbnail' => $f->thumbnail,
                'type'      => $f->type,
                'viewCount' => 0,
            ]);

        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'videoId'   => 'required|string|max:20',
            'title'     => 'required|string|max:255',
            'artist'    => 'required|string|max:255',
            'type'      => 'required|string|max:50',
            'duration'  => 'required|string|max:20',
            'thumbnail' => 'nullable|string|max:500',
        ]);

        Favorite::firstOrCreate(
            ['user_id' => $request->user()->id, 'video_id' => $data['videoId']],
            [
                'title'     => $data['title'],
                'artist'    => $data['artist'],
                'type'      => $data['type'],
                'duration'  => $data['duration'],
                'thumbnail' => $data['thumbnail'] ?? null,
            ]
        );

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, string $videoId)
    {
        $request->user()
            ->favorites()
            ->where('video_id', $videoId)
            ->delete();

        return response()->json(['ok' => true]);
    }
}
