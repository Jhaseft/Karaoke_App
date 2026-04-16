<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class YoutubeSearchController extends Controller
{
    private function ytdlpBase(): string
    {
        $node  = env('NODE_PATH', 'node');
        $ytdlp = env('YT_DLP_PATH', 'yt-dlp');
        return "{$ytdlp} --js-runtimes \"node:{$node}\" --no-warnings";
    }

    /** Ejecuta un comando yt-dlp y devuelve las líneas JSON parseadas */
    private function runYtdlp(string $args): array
    {
        $cmd = $this->ytdlpBase() . ' ' . $args . ' 2>&1';
        $raw = shell_exec($cmd);

        if (!$raw) return [];

        $results = [];
        foreach (explode("\n", $raw) as $line) {
            $line = trim($line);
            if (!str_starts_with($line, '{')) continue;
            $data = json_decode($line, true);
            if ($data) $results[] = $data;
        }
        return $results;
    }

    /** Mapea un resultado de yt-dlp a formato estándar de la app */
    private function mapEntry(array $entry): array
    {
        $id = $entry['id'] ?? $entry['display_id'] ?? '';
        return [
            'videoId'       => $id,
            'title'         => $entry['title'] ?? '',
            'author'        => $entry['channel'] ?? $entry['uploader'] ?? '',
            'duration'      => (int)($entry['duration'] ?? 0),
            'thumbnail'     => $entry['thumbnail']
                             ?? "https://i.ytimg.com/vi/{$id}/hqdefault.jpg",
            'viewCount'     => (int)($entry['view_count'] ?? 0),
            'publishedText' => $entry['upload_date'] ?? '',
        ];
    }

    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|max:200']);

        $q    = $request->input('q');
        $query = escapeshellarg("ytsearch25:{$q}");
        $args  = "--dump-json --flat-playlist --no-download {$query}";

        $items = $this->runYtdlp($args);

        if (empty($items)) {
            return response()->json(['error' => 'No se encontraron resultados'], 502);
        }

        $videos = collect($items)
            ->filter(fn($e) => !empty($e['id']))
            ->map(fn($e) => $this->mapEntry($e))
            ->values();

        return response()->json($videos);
    }

    public function trending()
    {
        $videos = Cache::remember('yt_trending', 1800, function () {
            // Busca karaoke popular como proxy de trending (no requiere API key)
            $query = escapeshellarg('ytsearch20:karaoke popular');
            $args  = "--dump-json --flat-playlist --no-download {$query}";
            return $this->runYtdlp($args);
        });

        if (empty($videos)) {
            return response()->json(['error' => 'No se pudo obtener tendencias'], 502);
        }

        $result = collect($videos)
            ->filter(fn($e) => !empty($e['id']))
            ->map(fn($e) => $this->mapEntry($e))
            ->values();

        return response()->json($result);
    }

    public function streams(string $videoId)
    {
        if (!preg_match('/^[a-zA-Z0-9_\-]{6,16}$/', $videoId)) {
            return response()->json(['error' => 'ID de video inválido'], 400);
        }

        $ytUrl = escapeshellarg('https://www.youtube.com/watch?v=' . $videoId);
        $args  = "--dump-json --no-download {$ytUrl}";

        $items = $this->runYtdlp($args);
        $info  = $items[0] ?? null;

        if (!$info) {
            return response()->json(['error' => 'yt-dlp no pudo obtener el video'], 502);
        }

        $streams = collect($info['formats'] ?? [])
            ->filter(fn($f) =>
                ($f['ext'] ?? '') === 'mp4' &&
                ($f['acodec'] ?? 'none') !== 'none' &&
                ($f['vcodec'] ?? 'none') !== 'none'
            )
            ->sortByDesc(fn($f) => $f['height'] ?? 0)
            ->map(fn($f) => [
                'url'     => $f['url'],
                'quality' => ($f['height'] ?? 360) . 'p',
                'ext'     => 'mp4',
            ])
            ->values();

        if ($streams->isEmpty()) {
            return response()->json(['error' => 'No hay formatos mp4 disponibles'], 502);
        }

        return response()->json([
            'title'   => $info['title'] ?? '',
            'streams' => $streams,
        ]);
    }
}
