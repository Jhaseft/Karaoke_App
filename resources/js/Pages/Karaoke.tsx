import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Song } from '@/types/karaoke';
import { ALL_SONGS, CATEGORIES, FEATURED, TRENDING } from '@/data/karaokeData';
import KaraokeLayout from '@/Layouts/KaraokeLayout';
import FeaturedBanner from '@/Components/Karaoke/FeaturedBanner';
import CategoryChips from '@/Components/Karaoke/CategoryChips';
import TrendingGrid from '@/Components/Karaoke/TrendingGrid';
import SongList from '@/Components/Karaoke/SongList';
import SearchResults from '@/Components/Karaoke/SearchResults';
import MiniPlayer from '@/Components/Karaoke/MiniPlayer';

export default function Karaoke() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Song[] | null>(null);
    const [activeFilter, setActiveFilter] = useState('Todo');
    const [activeCategory, setActiveCategory] = useState('Todo');
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function handleSearch() {
        const q = query.trim().toLowerCase();
        if (!q) {
            setSearchResults(null);
            setActiveFilter('Todo');
            return;
        }
        setSearchResults(
            ALL_SONGS.filter(s =>
                s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
            ),
        );
        setActiveFilter('Todo');
    }

    function handleClear() {
        setQuery('');
        setSearchResults(null);
        setActiveFilter('Todo');
    }

    function playSong(song: Song) {
        setCurrentSong(song);
        setIsPlaying(true);
    }

    const displayedTrending =
        activeCategory === 'Todo' ? TRENDING : TRENDING.filter(s => s.type === activeCategory);

    const activeNavLabel = searchResults !== null ? 'Explorar' : 'Inicio';

    return (
        <>
            <Head title="Karaoke — Pachamama Bar" />

            <KaraokeLayout
                activeLabel={activeNavLabel}
                hasPlayer={currentSong !== null}
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
                onClear={handleClear}
            >
                {searchResults !== null ? (
                    <SearchResults
                        query={query}
                        results={searchResults}
                        activeFilter={activeFilter}
                        activeSongId={currentSong?.id ?? null}
                        onFilterChange={setActiveFilter}
                        onPlay={playSong}
                    />
                ) : (
                    <div className="pb-4">
                        <FeaturedBanner items={FEATURED} onPlay={playSong} />

                        <div className="mt-5">
                            <CategoryChips
                                categories={CATEGORIES}
                                active={activeCategory}
                                onChange={setActiveCategory}
                            />
                        </div>

                        <TrendingGrid
                            songs={displayedTrending}
                            activeSongId={currentSong?.id ?? null}
                            onPlay={playSong}
                        />

                        <SongList
                            songs={ALL_SONGS}
                            activeSongId={currentSong?.id ?? null}
                            onPlay={playSong}
                        />
                    </div>
                )}
            </KaraokeLayout>

            {currentSong && (
                <MiniPlayer
                    song={currentSong}
                    isPlaying={isPlaying}
                    onToggle={() => setIsPlaying(p => !p)}
                    onClose={() => { setCurrentSong(null); setIsPlaying(false); }}
                />
            )}
        </>
    );
}
