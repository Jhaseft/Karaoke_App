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

    private function client()
    {
        return Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        ])->timeout(8);
    }

    /** Llama a una ruta de la API probando instancias hasta que una responda */
    private function fetchFromAnyInstance(string $path, array $params = []): ?array
    {
        foreach (self::INSTANCES as $base) {
            try {
                $res = $this->client()->get($base . $path, $params);
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

        // En Windows usa python; en Linux/Docker usa el binario yt-dlp directamente
        if (PHP_OS_FAMILY === 'Windows') {
            $python = 'C:\\Program Files\\Python312\\python.exe';
            $ytdlp  = "\"{$python}\" -m yt_dlp";
        } else {
            // pip3 install yt-dlp instala el binario en /usr/bin/yt-dlp en Alpine
            $ytdlp = '/usr/bin/yt-dlp';
        }

        $url = 'https://www.youtube.com/watch?v=' . escapeshellarg($videoId);
        $cmd = "{$ytdlp} --dump-json --no-playlist --no-warnings --quiet {$url} 2>&1";

        $output = shell_exec($cmd);

        if (!$output) {
            return response()->json(['error' => 'No se pudo obtener el video'], 502);
        }

        $info = json_decode($output, true);
        if (!$info || isset($info['error'])) {
            return response()->json(['error' => 'Error al procesar el video'], 502);
        }

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
