<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class YoutubeSearchController extends Controller
{
    private const INVIDIOUS_BASE = 'https://y.com.sb/api/v1';

    private function client()
    {
        return Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        ])->timeout(10);
    }

    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|max:200']);

        $query = $request->input('q');

        $response = $this->client()->get(self::INVIDIOUS_BASE . '/search', [
            'q'    => $query,
            'type' => 'video',
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Error al contactar Invidious'], 502);
        }

        $videos = collect($response->json())
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

        // En Windows usa el path completo; en Linux/Docker usa python3 del PATH
        $python = PHP_OS_FAMILY === 'Windows'
            ? 'C:\\Program Files\\Python312\\python.exe'
            : 'python3';

        $url = 'https://www.youtube.com/watch?v=' . escapeshellarg($videoId);
        $cmd = "\"{$python}\" -m yt_dlp --dump-json --no-playlist --no-warnings --quiet {$url} 2>&1";

        $output = shell_exec($cmd);

        if (!$output) {
            return response()->json(['error' => 'No se pudo obtener el video'], 502);
        }

        $info = json_decode($output, true);
        if (!$info || isset($info['error'])) {
            return response()->json(['error' => 'Error al procesar el video'], 502);
        }

        // Primero intentar formatos combinados (video+audio en el mismo archivo)
        $streams = collect($info['formats'] ?? [])
            ->filter(fn($f) =>
                ($f['vcodec'] ?? 'none') !== 'none' &&
                ($f['acodec'] ?? 'none') !== 'none'
            )
            ->sortByDesc(fn($f) => $f['height'] ?? 0)
            ->take(4)
            ->map(fn($f) => [
                'url'     => $f['url'],
                'quality' => ($f['height'] ?? '?') . 'p',
                'ext'     => $f['ext'] ?? 'mp4',
            ])
            ->values();

        if ($streams->isEmpty()) {
            return response()->json(['error' => 'No hay formatos de video disponibles'], 502);
        }

        return response()->json([
            'title'   => $info['title'],
            'streams' => $streams,
        ]);
    }

    public function trending()
    {
        $response = $this->client()->get(self::INVIDIOUS_BASE . '/trending', [
            'type' => 'music',
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Error al contactar Invidious'], 502);
        }

        $videos = collect($response->json())
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
