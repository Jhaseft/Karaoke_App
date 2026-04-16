import type { Song } from '@/types/karaoke';
import SongRow from './SongRow';

interface Props {
    songs: Song[];
    activeSongId: number | null;
    favorites?: string[];
    playlist?: string[];
    onPlay: (song: Song) => void;
    onToggleFavorite?: (song: Song) => void;
    onTogglePlaylist?: (song: Song) => void;
    loading?: boolean;
}

export default function SongList({ songs, activeSongId, favorites = [], playlist = [], onPlay, onToggleFavorite, onTogglePlaylist, loading }: Props) {
    return (
        <section className="px-4 mt-8 pb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Todas las canciones</h3>
                {!loading && <span className="text-xs text-gray-500">{songs.length} canciones</span>}
            </div>
            <div className="space-y-1">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse">
                            <div className="w-6 h-3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <div className="w-11 h-11 rounded-md flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                <div className="h-2.5 rounded-full w-1/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                            </div>
                            <div className="h-2.5 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                        </div>
                    ))
                    : songs.map((song, idx) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={idx + 1}
                            isActive={activeSongId === song.id}
                            isFavorite={song.videoId ? favorites.includes(song.videoId) : false}
                            inPlaylist={song.videoId ? playlist.includes(song.videoId) : false}
                            onPlay={onPlay}
                            onToggleFavorite={onToggleFavorite}
                            onTogglePlaylist={onTogglePlaylist}
                        />
                    ))
                }
            </div>
        </section>
    );
}
