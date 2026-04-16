import { useEffect, useRef, useState } from 'react';
import {
    ChevronDown, ChevronUp, X, Maximize2, Minimize2,
    SkipBack, SkipForward, Play, Pause, Repeat1, Star, ListPlus
} from 'lucide-react';
// @ts-ignore — plyr ships mixed export=/export default typings; works fine at runtime with esModuleInterop
import PlyrJS from 'plyr';
import 'plyr/dist/plyr.css';
import type { Song } from '@/types/karaoke';

interface Stream { url: string; quality: string; ext: string; }

interface Props {
    song: Song;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onEnded?: () => void;
    isFavorite?: boolean;
    inPlaylist?: boolean;
    onToggleFavorite?: () => void;
    onTogglePlaylist?: () => void;
}

export default function KaraokeVideoPlayer({ song, onClose, onNext, onPrev, onEnded, isFavorite, inPlaylist, onToggleFavorite, onTogglePlaylist }: Props) {
    const containerRef             = useRef<HTMLDivElement>(null);
    const plyrRef                  = useRef<PlyrJS | null>(null);
    const repeatRef                = useRef(false);
    const [loading, setLoading]    = useState(true);
    const [error, setError]        = useState<string | null>(null);
    const [expanded, setExpanded]  = useState(true);
    const [mini, setMini]          = useState(false);
    const [playing, setPlaying]    = useState(false);
    const [repeatOne, setRepeatOne]= useState(false);

    // Mantiene repeatRef sincronizado para acceder desde el evento ended
    useEffect(() => { repeatRef.current = repeatOne; }, [repeatOne]);

    useEffect(() => {
        if (!song.videoId) return;
        let cancelled = false;

        setLoading(true);
        setError(null);
        setPlaying(false);

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
                    autoplay: true,
                    blankVideo: '/blank.mp4',
                    controls: ['play-large', 'play', 'progress', 'current-time',
                               'duration', 'mute', 'volume', 'settings', 'pip', 'fullscreen'],
                    settings: ['quality', 'speed'],
                    speed:    { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5] },
                    quality:  {
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

                player.on('play',  () => setPlaying(true));
                player.on('pause', () => setPlaying(false));
                player.on('ended', () => {
                    if (repeatRef.current) {
                        player.currentTime = 0;
                        player.play();
                    } else {
                        onEnded?.();
                    }
                });

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

    function togglePlay() {
        plyrRef.current?.togglePlay();
    }

    // ── Barra de controles de reproducción ───────────────────────────────────
    function Controls({ small = false }: { small?: boolean }) {
        const btn  = `p-1.5 transition-colors rounded-full ${small ? 'text-gray-400 hover:text-white' : 'text-gray-300 hover:text-white'}`;
        const size = small ? 14 : 18;
        return (
            <div className="flex items-center gap-1">
                {/* Repetir uno */}
                <button
                    onClick={() => setRepeatOne(r => !r)}
                    className={`${btn} ${repeatOne ? 'text-red-400' : ''}`}
                    title="Repetir canción"
                >
                    <Repeat1 size={size} />
                </button>
                {/* Anterior */}
                <button onClick={onPrev} className={btn} title="Anterior">
                    <SkipBack size={size} />
                </button>
                {/* Play / Pause */}
                <button
                    onClick={togglePlay}
                    className={`p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors ${loading ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={loading}
                    title={playing ? 'Pausar' : 'Reproducir'}
                >
                    {playing ? <Pause size={size} /> : <Play size={size} />}
                </button>
                {/* Siguiente */}
                <button onClick={onNext} className={btn} title="Siguiente">
                    <SkipForward size={size} />
                </button>
            </div>
        );
    }

    return (
        <div
            className="fixed z-50 transition-all duration-300"
            style={mini ? {
                bottom: 24, right: 24, left: 'auto', width: 320,
                background: 'rgba(6,0,0,0.97)',
                border: '1px solid rgba(220,38,38,0.4)',
                borderRadius: 12,
                boxShadow: '0 8px 40px rgba(220,38,38,0.25)',
                overflow: 'hidden',
            } : {
                bottom: 0, left: 0, right: 0,
                background: 'rgba(6,0,0,0.97)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(220,38,38,0.3)',
                boxShadow: '0 -4px 32px rgba(220,38,38,0.15)',
            }}
        >
            {/* Barra superior: título + controles de ventana */}
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(220,38,38,0.1)' }}>
                <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-white truncate ${mini ? 'text-xs' : 'text-sm'}`}>{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                </div>

                {mini
                    ? <Controls small />
                    : null
                }

                {mini ? (
                    <button onClick={() => setMini(false)} className="p-1 text-gray-400 hover:text-white transition-colors" title="Expandir">
                        <Maximize2 size={14} />
                    </button>
                ) : (
                    <>
                        <button onClick={() => setMini(true)} className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Mini player">
                            <Minimize2 size={16} />
                        </button>
                        <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                            {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                    </>
                )}

                {onToggleFavorite && (
                    <button onClick={onToggleFavorite} className="p-1.5 hover:scale-110 transition-colors" title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                        <Star size={16} fill={isFavorite ? '#facc15' : 'none'} color={isFavorite ? '#facc15' : '#6b7280'} />
                    </button>
                )}
                {onTogglePlaylist && (
                    <button onClick={onTogglePlaylist} className="p-1.5 hover:scale-110 transition-colors" title={inPlaylist ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}>
                        <ListPlus size={16} color={inPlaylist ? '#ef4444' : '#6b7280'} />
                    </button>
                )}
                <button onClick={onClose} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                    <X size={mini ? 14 : 16} />
                </button>
            </div>

            {/* Controles de reproducción — solo en modo normal */}
            {!mini && (
                <div className="flex justify-center py-2 border-b" style={{ borderColor: 'rgba(220,38,38,0.08)' }}>
                    <Controls />
                </div>
            )}

            {/* Área del video */}
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: mini ? 999 : (expanded ? 600 : 0) }}
            >
                <div className={mini ? '' : 'p-3 md:p-4 plyr-karaoke'}>
                    {loading && !error && (
                        <div className="w-full flex items-center justify-center gap-3 py-10 text-gray-400 text-sm">
                            <svg className="animate-spin h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            {!mini && 'Cargando video...'}
                        </div>
                    )}
                    {error && (
                        <div className="w-full py-8 flex items-center justify-center text-red-400 text-sm">{error}</div>
                    )}
                    <div
                        ref={containerRef}
                        className={`w-full mx-auto overflow-hidden ${loading || error ? 'hidden' : ''} ${mini ? '' : 'max-w-3xl rounded-xl'}`}
                    />
                </div>
            </div>
        </div>
    );
}
