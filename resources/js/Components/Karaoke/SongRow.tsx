import { useState } from 'react';
import { Play, Star, ListPlus } from 'lucide-react';
import type { Song } from '@/types/karaoke';
import AlbumArt from './AlbumArt';
import TypeBadge from './TypeBadge';

interface Props {
    song: Song;
    index: number;
    isActive: boolean;
    isFavorite?: boolean;
    inPlaylist?: boolean;
    onPlay: (song: Song) => void;
    onToggleFavorite?: (song: Song) => void;
    onTogglePlaylist?: (song: Song) => void;
}

export default function SongRow({ song, index, isActive, isFavorite, inPlaylist, onPlay, onToggleFavorite, onTogglePlaylist }: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150"
            style={{
                background: isActive ? 'rgba(220,38,38,0.12)' : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isActive ? '1px solid rgba(220,38,38,0.2)' : '1px solid transparent',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Área clickeable para reproducir */}
            <button onClick={() => onPlay(song)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                {/* Index / play icon */}
                <div className="w-6 flex-shrink-0 flex items-center justify-center">
                    {hovered || isActive ? (
                        <Play size={14} fill={isActive ? '#ef4444' : '#9ca3af'} color={isActive ? '#ef4444' : '#9ca3af'} />
                    ) : (
                        <span className="text-xs text-gray-600">{index}</span>
                    )}
                </div>

                {song.thumbnail ? (
                    <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="flex-shrink-0 rounded-md object-cover"
                        style={{ width: 44, height: 44 }}
                    />
                ) : (
                    <AlbumArt color={song.color} initial={song.initial} size={44} />
                )}

                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-red-400' : 'text-white'}`}>
                        {song.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{song.artist}</p>
                </div>
            </button>

            <TypeBadge type={song.type} />

            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <span className="text-xs text-gray-600 hidden sm:block">{song.views}</span>
                <span className="text-xs text-gray-500">{song.duration}</span>

                {/* Botón favorito */}
                {onToggleFavorite && (
                    <button
                        onClick={e => { e.stopPropagation(); onToggleFavorite(song); }}
                        className="p-1 rounded transition-colors hover:scale-110"
                        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <Star
                            size={14}
                            fill={isFavorite ? '#facc15' : 'none'}
                            color={isFavorite ? '#facc15' : '#6b7280'}
                        />
                    </button>
                )}
                {onTogglePlaylist && (
                    <button
                        onClick={e => { e.stopPropagation(); onTogglePlaylist(song); }}
                        className="p-1 rounded transition-colors hover:scale-110"
                        title={inPlaylist ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}
                    >
                        <ListPlus
                            size={14}
                            color={inPlaylist ? '#ef4444' : '#6b7280'}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}
