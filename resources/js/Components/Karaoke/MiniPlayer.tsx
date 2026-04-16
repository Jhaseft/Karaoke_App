import { useEffect, useState } from 'react';
import { ListPlus, Pause, Play, SkipBack, SkipForward, Star, X } from 'lucide-react';
import type { Song } from '@/types/karaoke';
import AlbumArt from './AlbumArt';
import TypeBadge from './TypeBadge';

interface Props {
    song: Song;
    isPlaying: boolean;
    isFavorite?: boolean;
    inPlaylist?: boolean;
    onToggle: () => void;
    onClose: () => void;
    onToggleFavorite?: () => void;
    onTogglePlaylist?: () => void;
}

export default function MiniPlayer({ song, isPlaying, isFavorite, inPlaylist, onToggle, onClose, onToggleFavorite, onTogglePlaylist }: Props) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isPlaying) return;
        const t = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 0.3)), 300);
        return () => clearInterval(t);
    }, [isPlaying]);

    useEffect(() => setProgress(0), [song.id]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3"
            style={{
                background: 'rgba(8,0,0,0.96)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(220,38,38,0.25)',
                boxShadow: '0 -4px 24px rgba(220,38,38,0.12)',
            }}
        >
        
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
                />
            </div>

            <AlbumArt color={song.color} initial={song.initial} size={44} />

            <div className="flex-1 min-w-0 hidden xs:block sm:block">
                <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
            </div>

            <div className="flex-1 min-w-0 xs:hidden sm:hidden block">
                <p className="text-xs font-semibold text-white truncate">{song.title}</p>
            </div>

            <TypeBadge type={song.type} />

            <div className="flex items-center gap-1">
                {onToggleFavorite && (
                    <button onClick={onToggleFavorite} className="p-1.5 text-gray-400 hover:scale-110 transition-colors" title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                        <Star size={16} fill={isFavorite ? '#facc15' : 'none'} color={isFavorite ? '#facc15' : '#6b7280'} />
                    </button>
                )}
                {onTogglePlaylist && (
                    <button onClick={onTogglePlaylist} className="p-1.5 text-gray-400 hover:scale-110 transition-colors" title={inPlaylist ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}>
                        <ListPlus size={16} color={inPlaylist ? '#ef4444' : '#6b7280'} />
                    </button>
                )}
            </div>

         
            <div className="flex items-center gap-1 ml-1 sm:ml-2">
                <button className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors hidden sm:flex">
                    <SkipBack size={20} />
                </button>

                <button
                    onClick={onToggle}
                    className="flex items-center justify-center rounded-full w-9 h-9 transition-all duration-150 hover:scale-105"
                    style={{ background: '#dc2626', boxShadow: '0 0 12px rgba(220,38,38,0.5)' }}
                >
                    {isPlaying
                        ? <Pause size={18} fill="white" color="white" />
                        : <Play size={18} fill="white" color="white" />
                    }
                </button>

                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <SkipForward size={20} />
                </button>
            </div>

            <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-400 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
}
