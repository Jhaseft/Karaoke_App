<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->playlists()->orderBy('order')->get()->map(fn($p) => [
                'videoId'   => $p->video_id,
                'title'     => $p->title,
                'artist'    => $p->artist,
                'thumbnail' => $p->thumbnail,
                'type'      => $p->type,
                'duration'  => $p->duration,
            ])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'videoId'   => 'required|string|max:20',
            'title'     => 'required|string|max:255',
            'artist'    => 'required|string|max:255',
            'type'      => 'required|string|max:50',
            'duration'  => 'nullable|string|max:20',
            'thumbnail' => 'nullable|string|max:500',
        ]);

        $order = $request->user()->playlists()->max('order') + 1;

        Playlist::firstOrCreate(
            ['user_id' => $request->user()->id, 'video_id' => $data['videoId']],
            [
                'title'     => $data['title'],
                'artist'    => $data['artist'],
                'type'      => $data['type'],
                'duration'  => $data['duration'] ?? null,
                'thumbnail' => $data['thumbnail'] ?? null,
                'order'     => $order,
            ]
        );

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, string $videoId)
    {
        $request->user()->playlists()->where('video_id', $videoId)->delete();
        return response()->json(['ok' => true]);
    }
}
