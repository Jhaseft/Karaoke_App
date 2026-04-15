<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class YoutubeSearchController extends Controller
{
    // Instancias Invidious en orden de preferencia
    private const INSTANCES = [
        'https://inv.nadeko.net/api/v1',
        'https://invidious.privacyredirect.com/api/v1',
        'https://invidious.nerdvpn.de/api/v1',
        'https://y.com.sb/api/v1',
        'https://invidious.projectsegfau.lt/api/v1',
    ];

    private function client(int $timeout = 8)
    {
        return Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        ])->timeout($timeout);
    }

    /** Llama a una ruta de la API probando instancias hasta que una responda */
    private function fetchFromAnyInstance(string $path, array $params = [], int $timeout = 8): ?array
    {
        foreach (self::INSTANCES as $base) {
            try {
                $res = $this->client($timeout)->get($base . $path, $params);
                if ($res->successful()) {
                    $data = $res->json();
                    if (!empty($data)) return $data;
                }
            } catch (\Throwable) {
                // intentar siguiente instancia
            }
        }
        return null;
    }

    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|max:200']);

        $data = $this->fetchFromAnyInstance('/search', [
            'q'    => $request->input('q'),
            'type' => 'video',
        ]);

        if (!$data) {
            return response()->json(['error' => 'No se pudo contactar ninguna instancia'], 502);
        }

        $videos = collect($data)
            ->filter(fn($item) => ($item['type'] ?? '') === 'video')
            ->map(fn($item) => [
                'videoId'       => $item['videoId'],
                'title'         => $item['title'],
                'author'        => $item['author'],
                'duration'      => $item['lengthSeconds'] ?? 0,
                'thumbnail'     => "https://i.ytimg.com/vi/{$item['videoId']}/hqdefault.jpg",
                'viewCount'     => $item['viewCount'] ?? 0,
                'publishedText' => $item['publishedText'] ?? '',
            ])
            ->values();

        return response()->json($videos);
    }

    public function streams(Request $request, string $videoId)
    {
        if (!preg_match('/^[a-zA-Z0-9_\-]{6,16}$/', $videoId)) {
            return response()->json(['error' => 'ID de video inválido'], 400);
        }

        // Usar Invidious /videos/{id} — no requiere Python ni yt-dlp
        $data = $this->fetchFromAnyInstance('/videos/' . $videoId, [], 15);

        if (!$data) {
            return response()->json(['error' => 'No se pudo obtener el video'], 502);
        }

        // formatStreams = streams combinados video+audio (mp4), listos para reproducir
        $streams = collect($data['formatStreams'] ?? [])
            ->filter(fn($f) => str_contains($f['type'] ?? '', 'video/mp4'))
            ->sortByDesc(fn($f) => (int) filter_var($f['resolution'] ?? '0p', FILTER_SANITIZE_NUMBER_INT))
            ->map(fn($f) => [
                'url'     => $f['url'],
                'quality' => $f['resolution'] ?? $f['qualityLabel'] ?? '360p',
                'ext'     => 'mp4',
            ])
            ->values();

        if ($streams->isEmpty()) {
            return response()->json(['error' => 'No hay formatos de video disponibles'], 502);
        }

        return response()->json([
            'title'   => $data['title'] ?? '',
            'streams' => $streams,
        ]);
    }

    public function trending()
    {
        $data = $this->fetchFromAnyInstance('/trending', ['type' => 'music']);

        if (!$data) {
            return response()->json(['error' => 'No se pudo obtener tendencias'], 502);
        }

        $videos = collect($data)
            ->take(12)
            ->map(fn($item) => [
                'videoId'       => $item['videoId'],
                'title'         => $item['title'],
                'author'        => $item['author'],
                'duration'      => $item['lengthSeconds'] ?? 0,
                'thumbnail'     => "https://i.ytimg.com/vi/{$item['videoId']}/hqdefault.jpg",
                'viewCount'     => $item['viewCount'] ?? 0,
                'publishedText' => $item['publishedText'] ?? '',
            ])
            ->values();

        return response()->json($videos);
    }
}
