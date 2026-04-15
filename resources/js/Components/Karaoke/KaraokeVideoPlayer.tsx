import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import PlyrJS from 'plyr';
import 'plyr/dist/plyr.css';
import type { Song } from '@/types/karaoke';

interface Stream { url: string; quality: string; ext: string; }

interface Props {
    song: Song;
    onClose: () => void;
}

export default function KaraokeVideoPlayer({ song, onClose }: Props) {
    const containerRef            = useRef<HTMLDivElement>(null);
    const plyrRef                 = useRef<PlyrJS | null>(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        if (!song.videoId) return;
        let cancelled = false;

        setLoading(true);
        setError(null);

        if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }

        fetch(`/api/streams/${song.videoId}`)
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => {
                if (cancelled || !data.streams?.length) throw new Error();
                if (!containerRef.current) return;

                const videoEl = document.createElement('video');
                videoEl.setAttribute('playsinline', '');
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(videoEl);

                const player = new PlyrJS(videoEl, {
                    autoplay:   true,
                    blankVideo: '/blank.mp4',
                    controls:   ['play-large', 'play', 'progress', 'current-time',
                                 'duration', 'mute', 'volume', 'settings', 'pip', 'fullscreen'],
                    settings:   ['quality', 'speed'],
                    speed:      { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5] },
                    quality:    {
                        default: parseInt(data.streams[0].quality),
                        options: data.streams.map((s: Stream) => parseInt(s.quality)),
                        forced:  true,
                    },
                    i18n: {
                        play: 'Reproducir', pause: 'Pausar', mute: 'Silenciar',
                        unmute: 'Activar sonido', settings: 'Configuración',
                        enterFullscreen: 'Pantalla completa', exitFullscreen: 'Salir',
                        speed: 'Velocidad', quality: 'Calidad', normal: 'Normal',
                        pip: 'Imagen en imagen',
                    },
                });

                player.source = {
                    type: 'video',
                    sources: data.streams.map((s: Stream) => ({
                        src: s.url, type: 'video/mp4', size: parseInt(s.quality),
                    })),
                };

                plyrRef.current = player;
                setLoading(false);
            })
            .catch(() => { if (!cancelled) { setError('No se pudo cargar el video.'); setLoading(false); } });

        return () => {
            cancelled = true;
            if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, [song.videoId]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: 'rgba(6,0,0,0.97)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(220,38,38,0.3)',
                boxShadow: '0 -4px 32px rgba(220,38,38,0.15)',
            }}
        >
            {/* Barra de controles superior */}
            <div className="flex items-center gap-3 px-4 py-2 border-b" style={{ borderColor: 'rgba(220,38,38,0.1)' }}>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                </div>
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title={expanded ? 'Minimizar' : 'Expandir'}
                >
                    {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
                <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* Área del player — se muestra/oculta con expanded */}
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: expanded ? 600 : 0 }}
            >
                <div className="p-3 md:p-4 plyr-karaoke">
                    {loading && !error && (
                        <div className="w-full flex items-center justify-center gap-3 py-10 text-gray-400 text-sm">
                            <svg className="animate-spin h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            Cargando video...
                        </div>
                    )}
                    {error && (
                        <div className="w-full py-8 flex items-center justify-center text-red-400 text-sm">{error}</div>
                    )}
                    <div
                        ref={containerRef}
                        className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden ${loading || error ? 'hidden' : ''}`}
                    />
                </div>
            </div>
        </div>
    );
}
