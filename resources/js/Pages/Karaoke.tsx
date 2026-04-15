import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import type { Song, FeaturedSong } from '@/types/karaoke';
import { CATEGORIES } from '@/data/karaokeData';
import KaraokeLayout from '@/Layouts/KaraokeLayout';
import FeaturedBanner from '@/Components/Karaoke/FeaturedBanner';
import CategoryChips from '@/Components/Karaoke/CategoryChips';
import TrendingGrid from '@/Components/Karaoke/TrendingGrid';
import SongList from '@/Components/Karaoke/SongList';
import SearchResults from '@/Components/Karaoke/SearchResults';
import MiniPlayer from '@/Components/Karaoke/MiniPlayer';
import KaraokeVideoPlayer from '@/Components/Karaoke/KaraokeVideoPlayer';

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
    return n.toString();
}

function videoColor(videoId: string): string {
    let hash = 0;
    for (let i = 0; i < videoId.length; i++) hash = videoId.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 10%)`;
}

function mapApiToSongs(data: any[], idOffset = 0): Song[] {
    return data.map((v, i) => ({
        id:        idOffset + i,
        videoId:   v.videoId,
        title:     v.title,
        artist:    v.author,
        type:      'Karaoke',
        duration:  formatDuration(v.duration),
        views:     formatViews(v.viewCount),
        color:     videoColor(v.videoId),
        initial:   v.title.charAt(0).toUpperCase(),
        thumbnail: v.thumbnail,
    }));
}

// Qué buscar por cada chip de categoría
const CATEGORY_QUERIES: Record<string, string> = {
    'Karaoke':     'karaoke',
    'Lyric':       'lyric video',
    'Subtitulado': 'karaoke subtitulado',
    'Reggaeton':   'reggaeton karaoke',
    'Pop':         'pop karaoke',
    'Rock':        'rock karaoke',
    'Cumbia':      'cumbia karaoke',
};

// ── page ─────────────────────────────────────────────────────────────────────
export default function Karaoke() {
    const [query, setQuery]                 = useState('');
    const [searchResults, setSearchResults] = useState<Song[] | null>(null);
    const [activeFilter, setActiveFilter]   = useState('Todo');
    const [activeCategory, setActiveCategory] = useState('Todo');
    const [currentSong, setCurrentSong]     = useState<Song | null>(null);
    const [isPlaying, setIsPlaying]         = useState(false);
    const [searching, setSearching]         = useState(false);

    const [featuredItems, setFeaturedItems] = useState<FeaturedSong[]>([]);
    const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
    const [allSongs, setAllSongs]           = useState<Song[]>([]);
    const [loadingHome, setLoadingHome]     = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(false);

    // Cache de trending para restaurar al volver a "Todo"
    const trendingCache = useRef<{ featured: FeaturedSong[]; trending: Song[]; all: Song[] } | null>(null);

    // ── Carga inicial: trending o fallback con búsqueda ──────────────────────
    useEffect(() => {
        loadHome();
    }, []);

    async function loadHome() {
        setLoadingHome(true);
        try {
            const res = await fetch('/api/trending');
            if (!res.ok) throw new Error();
            const data: any[] = await res.json();
            if (!data.length) throw new Error();

            const songs = mapApiToSongs(data, 500);
            applyHomeData(songs);
        } catch {
            // Trending falló → buscar "karaoke popular" como fallback
            try {
                const res = await fetch('/api/search?q=' + encodeURIComponent('karaoke popular'));
                const data: any[] = await res.json();
                const songs = mapApiToSongs(data, 500);
                applyHomeData(songs);
            } catch {
                // Ambos fallaron, dejamos skeletons (array vacío)
            }
        } finally {
            setLoadingHome(false);
        }
    }

    function applyHomeData(songs: Song[]) {
        const featured: FeaturedSong[] = songs.slice(0, 3).map(s => ({
            id:        s.id,
            videoId:   s.videoId,
            title:     s.title,
            artist:    s.artist,
            type:      s.type,
            duration:  s.duration,
            color:     s.color,
            accent:    '#ef4444',
            initial:   s.initial,
            thumbnail: s.thumbnail,
        }));

        setFeaturedItems(featured);
        setTrendingSongs(songs.slice(3, 11));
        setAllSongs(songs);

        trendingCache.current = { featured, trending: songs.slice(3, 11), all: songs };
    }

    // ── Cambio de categoría → búsqueda real ──────────────────────────────────
    async function handleCategoryChange(cat: string) {
        setActiveCategory(cat);

        if (cat === 'Todo') {
            // Restaurar datos de trending desde cache
            if (trendingCache.current) {
                setFeaturedItems(trendingCache.current.featured);
                setTrendingSongs(trendingCache.current.trending);
                setAllSongs(trendingCache.current.all);
            }
            return;
        }

        const q = CATEGORY_QUERIES[cat] ?? `${cat} karaoke`;
        setLoadingCategory(true);
        try {
            const res  = await fetch('/api/search?q=' + encodeURIComponent(q));
            const data: any[] = await res.json();
            const songs = mapApiToSongs(data, 600);

            const featured: FeaturedSong[] = songs.slice(0, 3).map(s => ({
                id: s.id, videoId: s.videoId, title: s.title, artist: s.artist,
                type: s.type, duration: s.duration, color: s.color,
                accent: '#ef4444', initial: s.initial, thumbnail: s.thumbnail,
            }));

            setFeaturedItems(featured);
            setTrendingSongs(songs.slice(3, 11));
            setAllSongs(songs);
        } catch {
            // Si falla, mantiene lo que había
        } finally {
            setLoadingCategory(false);
        }
    }

    // ── Búsqueda del usuario ──────────────────────────────────────────────────
    async function handleSearch() {
        const q = query.trim();
        if (!q) { handleClear(); return; }

        setSearching(true);
        try {
            const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setSearchResults(mapApiToSongs(data as any[], 1));
            setActiveFilter('Todo');
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
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

    const activeNavLabel = searchResults !== null ? 'Explorar' : 'Inicio';
    const hasRealVideo   = !!currentSong?.videoId;
    const homeLoading    = loadingHome || loadingCategory;

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
                {/* Spinner búsqueda de usuario */}
                {searching && (
                    <div className="flex items-center justify-center py-24">
                        <svg className="animate-spin h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                    </div>
                )}

                {!searching && searchResults !== null && (
                    <SearchResults
                        query={query}
                        results={searchResults}
                        activeFilter={activeFilter}
                        activeSongId={currentSong?.id ?? null}
                        onFilterChange={setActiveFilter}
                        onPlay={playSong}
                    />
                )}

                {!searching && searchResults === null && (
                    <div className="pb-4">
                        <FeaturedBanner
                            items={featuredItems}
                            onPlay={playSong}
                            loading={loadingHome}
                        />

                        <div className="mt-5">
                            <CategoryChips
                                categories={CATEGORIES}
                                active={activeCategory}
                                onChange={handleCategoryChange}
                            />
                        </div>

                        <TrendingGrid
                            songs={trendingSongs}
                            activeSongId={currentSong?.id ?? null}
                            onPlay={playSong}
                            loading={homeLoading}
                        />

                        <SongList
                            songs={allSongs}
                            activeSongId={currentSong?.id ?? null}
                            onPlay={playSong}
                            loading={homeLoading}
                        />
                    </div>
                )}
            </KaraokeLayout>

            {currentSong && hasRealVideo && (
                <KaraokeVideoPlayer
                    song={currentSong}
                    onClose={() => { setCurrentSong(null); setIsPlaying(false); }}
                />
            )}
            {currentSong && !hasRealVideo && (
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
