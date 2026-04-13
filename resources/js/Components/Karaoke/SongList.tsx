import type { Song } from '@/types/karaoke';
import SongRow from './SongRow';

interface Props {
    songs: Song[];
    activeSongId: number | null;
    onPlay: (song: Song) => void;
}

export default function SongList({ songs, activeSongId, onPlay }: Props) {
    return (
        <section className="px-4 mt-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Todas las canciones</h3>
                <span className="text-xs text-gray-500">{songs.length} canciones</span>
            </div>
            <div className="space-y-1">
                {songs.map((song, idx) => (
                    <SongRow
                        key={song.id}
                        song={song}
                        index={idx + 1}
                        isActive={activeSongId === song.id}
                        onPlay={onPlay}
                    />
                ))}
            </div>
        </section>
    );
}
