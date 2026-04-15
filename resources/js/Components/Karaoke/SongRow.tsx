import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Song } from '@/types/karaoke';
import AlbumArt from './AlbumArt';
import TypeBadge from './TypeBadge';

interface Props {
    song: Song;
    index: number;
    isActive: boolean;
    onPlay: (song: Song) => void;
}

export default function SongRow({ song, index, isActive, onPlay }: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={() => onPlay(song)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150"
            style={{
                background: isActive ? 'rgba(220,38,38,0.12)' : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isActive ? '1px solid rgba(220,38,38,0.2)' : '1px solid transparent',
            }}
        >
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

            <TypeBadge type={song.type} />

            <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                <span className="text-xs text-gray-600 hidden sm:block">{song.views}</span>
                <span className="text-xs text-gray-500">{song.duration}</span>
            </div>
        </button>
    );
}
