import { Play } from 'lucide-react';
import type { Song } from '@/types/karaoke';
import TypeBadge from './TypeBadge';
import AlbumArt from './AlbumArt';

interface Props {
    songs: Song[];
    activeSongId: number | null;
    onPlay: (song: Song) => void;
    loading?: boolean;
}

export default function TrendingGrid({ songs, activeSongId, onPlay, loading }: Props) {
    return (
        <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Tendencias</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : songs.map(song => (
                        <TrendingCard
                            key={song.id}
                            song={song}
                            isActive={activeSongId === song.id}
                            onPlay={onPlay}
                        />
                    ))
                }
            </div>
        </section>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(220,38,38,0.08)' }}>
            <div className="w-full aspect-video" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="p-2.5 space-y-1.5">
                <div className="h-2.5 rounded-full w-4/5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-2 rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="h-2 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
        </div>
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
            {/* Thumbnail 16:9 */}
            <div
                className="relative w-full aspect-video flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${song.color}, #0a0a0a)` }}
            >
                {song.thumbnail ? (
                    <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <AlbumArt color={song.color} initial={song.initial} size={48} />
                )}

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="flex items-center justify-center rounded-full bg-red-600 w-10 h-10 shadow-lg">
                        <Play size={18} fill="white" color="white" />
                    </div>
                </div>

                {/* Duration badge */}
                {song.duration && (
                    <span
                        className="absolute bottom-1.5 right-1.5 text-white text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(0,0,0,0.8)', fontSize: '0.65rem' }}
                    >
                        {song.duration}
                    </span>
                )}

                <div className="absolute top-1.5 right-1.5">
                    <TypeBadge type={song.type} />
                </div>
            </div>

            {/* Info */}
            <div className="p-2.5">
                <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">{song.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{song.artist}</p>
                <p className="text-xs text-gray-600 mt-0.5">{song.views} vistas</p>
            </div>
        </button>
    );
}
