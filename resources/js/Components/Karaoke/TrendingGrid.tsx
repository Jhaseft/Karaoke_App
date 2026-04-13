import { Play } from 'lucide-react';
import type { Song } from '@/types/karaoke';
import TypeBadge from './TypeBadge';
import AlbumArt from './AlbumArt';

interface Props {
    songs: Song[];
    activeSongId: number | null;
    onPlay: (song: Song) => void;
}

export default function TrendingGrid({ songs, activeSongId, onPlay }: Props) {
    return (
        <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Tendencias</h3>
                <button className="text-xs text-red-400 hover:text-red-300">Ver todo</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {songs.map(song => (
                    <TrendingCard
                        key={song.id}
                        song={song}
                        isActive={activeSongId === song.id}
                        onPlay={onPlay}
                    />
                ))}
            </div>
        </section>
    );
}

function TrendingCard({ song, isActive, onPlay }: { song: Song; isActive: boolean; onPlay: (s: Song) => void }) {
    return (
        <button
            onClick={() => onPlay(song)}
            className="group text-left rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
            style={{
                background: isActive ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(220,38,38,0.35)' : 'rgba(220,38,38,0.12)'}`,
            }}
        >
            {/* Thumbnail */}
            <div
                className="relative flex items-center justify-center"
                style={{ height: 100, background: `linear-gradient(135deg, ${song.color}, #0a0a0a)` }}
            >
                <AlbumArt color={song.color} initial={song.initial} size={48} />

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="flex items-center justify-center rounded-full bg-red-600 w-10 h-10">
                        <Play size={18} fill="white" color="white" />
                    </div>
                </div>

                <div className="absolute top-2 right-2">
                    <TypeBadge type={song.type} />
                </div>
            </div>

            {/* Info */}
            <div className="p-2.5">
                <p className="text-xs font-semibold text-white line-clamp-1">{song.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{song.artist}</p>
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-600">{song.views} vistas</span>
                    <span className="text-xs text-gray-600">{song.duration}</span>
                </div>
            </div>
        </button>
    );
}
