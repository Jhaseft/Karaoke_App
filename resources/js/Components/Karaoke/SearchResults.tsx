import type { Song } from '@/types/karaoke';
import { FILTER_TYPES } from '@/data/karaokeData';
import CategoryChips from './CategoryChips';
import SongRow from './SongRow';

interface Props {
    query: string;
    results: Song[];
    activeFilter: string;
    activeSongId: number | null;
    favorites?: string[];
    onFilterChange: (filter: string) => void;
    onPlay: (song: Song) => void;
    onToggleFavorite?: (song: Song) => void;
}

export default function SearchResults({ query, results, activeFilter, activeSongId, favorites = [], onFilterChange, onPlay, onToggleFavorite }: Props) {
    const filtered = activeFilter === 'Todo' ? results : results.filter(s => s.type === activeFilter);

    return (
        <div className="px-4 py-5 max-w-3xl mx-auto">
            <p className="text-xs text-gray-500 mb-4">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para{' '}
                <span className="text-red-400">"{query}"</span>
            </p>

            <div className="mb-5">
                <CategoryChips
                    categories={FILTER_TYPES}
                    active={activeFilter}
                    onChange={onFilterChange}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-12 h-12 opacity-30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                    <p className="text-sm">No se encontraron canciones</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {filtered.map((song, idx) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={idx + 1}
                            isActive={activeSongId === song.id}
                            isFavorite={song.videoId ? favorites.includes(song.videoId) : false}
                            onPlay={onPlay}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
