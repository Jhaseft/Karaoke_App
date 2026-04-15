import { useState, useEffect, useRef } from 'react';
import { Plyr } from 'plyr-react';
import 'plyr/dist/plyr.css';

interface Video {
    videoId: string;
    title: string;
    author: string;
    duration: number;
    thumbnail: string;
    viewCount: number;
    publishedText: string;
}

interface Stream {
    url: string;
    quality: string;
    ext: string;
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
    return n.toString();
}

// ── Player con Plyr ───────────────────────────────────────────────────────────
function Player({ video }: { video: Video }) {
    const [streams, setStreams]       = useState<Stream[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setStreams([]);

        fetch(`/api/streams/${video.videoId}`)
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => {
                if (!data.streams?.length) throw new Error('sin streams');
                setStreams(data.streams);
            })
            .catch(() => setError('No se pudo cargar el video.'))
            .finally(() => setLoading(false));
    }, [video.videoId]);

    if (loading) {
        return (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center gap-3 text-gray-400">
                <svg className="animate-spin h-7 w-7 text-purple-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Cargando video...
            </div>
        );
    }

    if (error || !streams.length) {
        return (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-red-400 text-sm">
                {error ?? 'No hay streams disponibles.'}
            </div>
        );
    }

    // Plyr recibe las fuentes como array — la primera es la calidad por defecto
    const sources: Plyr.SourceInfo = {
        type: 'video',
        sources: streams.map(s => ({
            src:   s.url,
            type:  'video/mp4',
            size:  parseInt(s.quality),   // Plyr usa esto para el selector de calidad
        })),
    };

    return (
        <div className="w-full rounded-xl overflow-hidden border border-gray-800 plyr-karaoke">
            <Plyr
                key={video.videoId}
                source={sources}
                options={{
                    autoplay:    true,
                    controls:    ['play-large', 'play', 'progress', 'current-time',
                                  'duration', 'mute', 'volume', 'settings',
                                  'pip', 'fullscreen'],
                    settings:    ['quality', 'speed'],
                    speed:       { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5] },
                    quality:     { default: parseInt(streams[0].quality), options: streams.map(s => parseInt(s.quality)), forced: true },
                    ratio:       '16:9',
                    i18n: {
                        play:        'Reproducir',
                        pause:       'Pausar',
                        mute:        'Silenciar',
                        unmute:      'Activar sonido',
                        settings:    'Configuración',
                        pip:         'Imagen en imagen',
                        enterFullscreen: 'Pantalla completa',
                        exitFullscreen:  'Salir',
                        speed:       'Velocidad',
                        quality:     'Calidad',
                        normal:      'Normal',
                    },
                }}
            />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Welcome() {
    const [query, setQuery]             = useState('');
    const [results, setResults]         = useState<Video[]>([]);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState<string | null>(null);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const search = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: Video[] = await res.json();
            setResults(data);
            if (data.length > 0) setActiveVideo(data[0]);
        } catch {
            setError('No se pudo conectar al servidor.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        search(query);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl">🎤</span>
                    <span className="text-xl font-bold tracking-tight text-purple-400">KaraokeSearch</span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-1 max-w-2xl mx-auto gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar karaoke... ej: Shakira, Bad Bunny, Adele"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
                            </svg>
                        )}
                        Buscar
                    </button>
                </form>
            </header>

            {/* Main */}
            <main className="flex flex-1 overflow-hidden">
                {!hasSearched ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
                        <span className="text-7xl">🎵</span>
                        <h1 className="text-4xl font-bold">Bienvenido a KaraokeSearch</h1>
                        <p className="text-gray-400 text-lg max-w-md">
                            Busca tu canción favorita y canta sin anuncios ni restricciones.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {['Shakira karaoke', 'Bad Bunny karaoke', 'Adele karaoke', 'Daddy Yankee karaoke'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setQuery(s); search(s); }}
                                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-300 transition"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Reproductor */}
                        <section className="flex flex-col flex-1 min-w-0 p-4 gap-4 overflow-y-auto">
                            {activeVideo ? (
                                <>
                                    <Player video={activeVideo} />
                                    <div>
                                        <h2 className="text-lg font-semibold leading-snug">{activeVideo.title}</h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {activeVideo.author}
                                            {' · '}
                                            {formatViews(activeVideo.viewCount)} vistas
                                            {' · '}
                                            {activeVideo.publishedText}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-600">
                                    Selecciona un video de la lista
                                </div>
                            )}
                        </section>

                        {/* Lista lateral */}
                        <aside className="w-80 shrink-0 border-l border-gray-800 overflow-y-auto">
                            {error && <div className="p-4 text-red-400 text-sm">{error}</div>}

                            {loading && !error && (
                                <div className="flex items-center justify-center py-12">
                                    <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                </div>
                            )}

                            {!loading && !error && results.length === 0 && (
                                <div className="p-4 text-gray-500 text-sm text-center">No se encontraron resultados.</div>
                            )}

                            {!loading && results.length > 0 && (
                                <ul className="divide-y divide-gray-800">
                                    {results.map(video => (
                                        <li
                                            key={video.videoId}
                                            onClick={() => setActiveVideo(video)}
                                            className={`flex gap-3 p-3 cursor-pointer transition hover:bg-gray-800 ${
                                                activeVideo?.videoId === video.videoId
                                                    ? 'bg-gray-800 border-l-2 border-purple-500'
                                                    : ''
                                            }`}
                                        >
                                            <div className="relative shrink-0 w-28 rounded overflow-hidden bg-gray-800" style={{ aspectRatio: '16/9' }}>
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                                    {formatDuration(video.duration)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium leading-snug line-clamp-2">{video.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{video.author}</p>
                                                <p className="text-xs text-gray-600 mt-0.5">{formatViews(video.viewCount)} vistas</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}
