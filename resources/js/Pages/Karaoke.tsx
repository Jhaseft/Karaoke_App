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

function mapApiToSongs(data: any[], idOffset = 0, type = 'Karaoke'): Song[] {
    return data.map((v, i) => ({
        id:        idOffset + i,
        videoId:   v.videoId,
        title:     v.title,
        artist:    v.author,
        type,
        duration:  formatDuration(v.duration),
        views:     formatViews(v.viewCount),
        color:     videoColor(v.videoId),
        initial:   v.title.charAt(0).toUpperCase(),
        thumbnail: v.thumbnail,
    }));
}

const CATEGORY_QUERIES: Record<string, string> = {
    'Karaoke':     'karaoke version',
    'Lyric':       'official lyrics video',
    'Subtitulado': 'con letra official audio',
    'Reggaeton':   'reggaeton 2024',
    'Pop':         'pop 2024',
    'Rock':        'rock 2024',
    'Cumbia':      'cumbia 2024',
};

function csrfToken(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}

export default function Karaoke() {
    const [query, setQuery]                     = useState('');
    const [searchResults, setSearchResults]     = useState<Song[] | null>(null);
    const [activeFilter, setActiveFilter]       = useState('Todo');
    const [activeCategory, setActiveCategory]   = useState('Todo');
    const [currentSong, setCurrentSong]         = useState<Song | null>(null);
    const [isPlaying, setIsPlaying]             = useState(false);
    const [searching, setSearching]             = useState(false);
    const [featuredItems, setFeaturedItems]     = useState<FeaturedSong[]>([]);
    const [trendingSongs, setTrendingSongs]     = useState<Song[]>([]);
    const [allSongs, setAllSongs]               = useState<Song[]>([]);
    const [loadingHome, setLoadingHome]         = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [favorites, setFavorites]             = useState<string[]>([]);
    const [playlist, setPlaylist]               = useState<string[]>([]);
    const [playlistSongs, setPlaylistSongs]     = useState<Song[]>([]);

    const trendingCache = useRef<{ featured: FeaturedSong[]; trending: Song[]; all: Song[] } | null>(null);
    const historyRef    = useRef<Song[]>([]);

    useEffect(() => {
        loadHome();
        fetch('/api/favorites')
            .then(r => r.ok ? r.json() : [])
            .then((data: any[]) => setFavorites(Array.isArray(data) ? data.map(f => f.videoId).filter(Boolean) : []))
            .catch(() => {});
        fetch('/api/playlist')
            .then(r => r.ok ? r.json() : [])
            .then((data: any[]) => {
                if (!Array.isArray(data)) return;
                setPlaylist(data.map((p: any) => p.videoId).filter(Boolean));
                setPlaylistSongs(data.map((p: any, i: number) => ({
                    id: 3000 + i, videoId: p.videoId, title: p.title,
                    artist: p.artist, type: p.type ?? 'Video',
                    duration: p.duration ?? '0:00', views: '',
                    color: videoColor(p.videoId ?? ''),
                    initial: p.title?.charAt(0).toUpperCase() ?? '?',
                    thumbnail: p.thumbnail,
                })));
            })
            .catch(() => {});
    }, []);

    async function loadHome() {
        setLoadingHome(true);
        try {
            const categories: { type: string; q: string }[] = [
                { type: 'Karaoke',     q: 'karaoke version' },
                { type: 'Lyric',       q: 'official lyrics video' },
                { type: 'Subtitulado', q: 'con letra official audio' },
                { type: 'Reggaeton',   q: 'reggaeton 2024' },
                { type: 'Pop',         q: 'pop 2024' },
                { type: 'Rock',        q: 'rock 2024' },
                { type: 'Cumbia',      q: 'cumbia 2024' },
            ];
            const results = await Promise.allSettled(
                categories.map(c => fetch('/api/search?q=' + encodeURIComponent(c.q)).then(r => r.json()))
            );
            let mixed: Song[] = [];
            results.forEach((res, i) => {
                if (res.status === 'fulfilled' && Array.isArray(res.value))
                    mixed = mixed.concat(mapApiToSongs(res.value.slice(0, 4), 500 + i * 50, categories[i].type));
            });
            if (!mixed.length) throw new Error();
            applyHomeData(mixed);
        } catch {
            try {
                const res = await fetch('/api/search?q=' + encodeURIComponent('karaoke popular'));
                applyHomeData(mapApiToSongs(await res.json(), 500));
            } catch { /* skeletons */ }
        } finally {
            setLoadingHome(false);
        }
    }

    function applyHomeData(songs: Song[]) {
        const featured: FeaturedSong[] = songs.slice(0, 3).map(s => ({
            id: s.id, videoId: s.videoId, title: s.title, artist: s.artist,
            type: s.type, duration: s.duration, color: s.color,
            accent: '#ef4444', initial: s.initial, thumbnail: s.thumbnail,
        }));
        setFeaturedItems(featured);
        setTrendingSongs(songs.slice(3, 11));
        setAllSongs(songs);
        trendingCache.current = { featured, trending: songs.slice(3, 11), all: songs };
    }

    async function handleCategoryChange(cat: string) {
        setActiveCategory(cat);
        if (cat === 'Todo') {
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
            const data: any[] = await fetch('/api/search?q=' + encodeURIComponent(q)).then(r => r.json());
            const songs = mapApiToSongs(data, 600, cat);
            const featured: FeaturedSong[] = songs.slice(0, 3).map(s => ({
                id: s.id, videoId: s.videoId, title: s.title, artist: s.artist,
                type: s.type, duration: s.duration, color: s.color,
                accent: '#ef4444', initial: s.initial, thumbnail: s.thumbnail,
            }));
            setFeaturedItems(featured);
            setTrendingSongs(songs.slice(3, 11));
            setAllSongs(songs);
        } catch { /* mantiene lo anterior */ }
        finally { setLoadingCategory(false); }
    }

    async function handleSearch() {
        const q = query.trim();
        if (!q) { handleClear(); return; }
        setSearching(true);
        setActiveCategory('Explorar');
        setSearchResults(null);
        try {
            const searches = [
                { suffix: 'karaoke version',      type: 'Karaoke'     },
                { suffix: 'official lyrics video', type: 'Lyric'       },
                { suffix: 'con letra',             type: 'Subtitulado' },
            ];
            const responses = await Promise.allSettled(
                searches.map(s => fetch('/api/search?q=' + encodeURIComponent(`${q} ${s.suffix}`)).then(r => r.json()))
            );
            let combined: Song[] = [];
            responses.forEach((res, i) => {
                if (res.status === 'fulfilled' && Array.isArray(res.value))
                    combined = combined.concat(mapApiToSongs(res.value.slice(0, 17), 1 + i * 100, searches[i].type));
            });
            setSearchResults(combined);
            setActiveFilter('Todo');
        } catch { setSearchResults([]); }
        finally { setSearching(false); }
    }

    function handleClear() {
        setQuery('');
        setSearchResults(null);
        setActiveFilter('Todo');
    }

    function playSong(song: Song) {
        if (currentSong) historyRef.current = [...historyRef.current.slice(-49), currentSong];
        setCurrentSong(song);
        setIsPlaying(true);
    }

    function playPrev() {
        const prev = historyRef.current.pop();
        if (prev) setCurrentSong(prev);
    }

    async function playRandom() {
        // Si la canción actual está en Mi Lista, reproducir la siguiente en orden
        if (playlistSongs.length > 0 && currentSong?.videoId && playlist.includes(currentSong.videoId)) {
            const currentIndex = playlistSongs.findIndex(s => s.videoId === currentSong.videoId);
            const nextIndex = currentIndex + 1 < playlistSongs.length ? currentIndex + 1 : 0;
            playSong(playlistSongs[nextIndex]);
            return;
        }
        // Si no está en la lista, reproducir aleatoriamente
        const type = currentSong?.type ?? 'Karaoke';
        const q    = CATEGORY_QUERIES[type] ?? 'karaoke version';
        try {
            const data: any[] = await fetch('/api/search?q=' + encodeURIComponent(q)).then(r => r.json());
            const candidates  = mapApiToSongs(data, 900, type).filter(s => s.videoId && s.videoId !== currentSong?.videoId);
            if (candidates.length) playSong(candidates[Math.floor(Math.random() * candidates.length)]);
        } catch { /* silencio */ }
    }

    async function toggleFavorite(song: Song) {
        if (!song.videoId) return;
        const isFav = favorites.includes(song.videoId);
        if (isFav) {
            setFavorites(f => f.filter(id => id !== song.videoId));
            if (activeCategory === 'Favoritos') setSearchResults(r => r ? r.filter(s => s.videoId !== song.videoId) : r);
            await fetch(`/api/favorites/${song.videoId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrfToken() } }).catch(() => {});
        } else {
            setFavorites(f => [...f, song.videoId!]);
            if (activeCategory === 'Favoritos') setSearchResults(r => r ? [...r, song] : r);
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken() },
                body: JSON.stringify({ videoId: song.videoId, title: song.title, artist: song.artist, type: song.type, duration: song.duration, thumbnail: song.thumbnail ?? null }),
            }).catch(() => {});
        }
    }

    async function togglePlaylist(song: Song) {
        if (!song.videoId) return;
        const inList = playlist.includes(song.videoId);
        if (inList) {
            setPlaylist(p => p.filter(id => id !== song.videoId));
            setPlaylistSongs(p => p.filter(s => s.videoId !== song.videoId));
            if (activeCategory === 'Mi Lista') setSearchResults(r => r ? r.filter(s => s.videoId !== song.videoId) : r);
            await fetch(`/api/playlist/${song.videoId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrfToken() } }).catch(() => {});
        } else {
            setPlaylist(p => [...p, song.videoId!]);
            setPlaylistSongs(p => [...p, song]);
            if (activeCategory === 'Mi Lista') setSearchResults(r => r ? [...r, song] : r);
            await fetch('/api/playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken() },
                body: JSON.stringify({ videoId: song.videoId, title: song.title, artist: song.artist, type: song.type, duration: song.duration, thumbnail: song.thumbnail ?? null }),
            }).catch(() => {});
        }
    }

    function handleNavClick(label: string) {
        const labelToCategory: Record<string, string> = {
            'Karaoke': 'Karaoke', 'Lyrics': 'Lyric', 'Subtitulado': 'Subtitulado',
        };

        if (label === 'Inicio') {
            setSearchResults(null);
            setQuery('');
            setActiveCategory('Todo');
            loadHome();
        } else if (label === 'Explorar') {
            // solo visual
        } else if (labelToCategory[label]) {
            setSearchResults(null);
            setQuery('');
            handleCategoryChange(labelToCategory[label]);
        } else if (label === 'Favoritos') {
            setQuery('');
            setActiveCategory('Favoritos');
            fetch('/api/favorites')
                .then(r => r.ok ? r.json() : [])
                .then((data: any[]) => {
                    setSearchResults(data.map((f: any, i: number) => ({
                        id: 2000 + i, videoId: f.videoId, title: f.title,
                        artist: f.author ?? f.artist, type: f.type ?? 'Video',
                        duration: f.duration ?? '0:00', views: '',
                        color: videoColor(f.videoId ?? ''),
                        initial: f.title?.charAt(0).toUpperCase() ?? '?',
                        thumbnail: f.thumbnail,
                    })));
                    setActiveFilter('Todo');
                }).catch(() => {});
        } else if (label === 'Mi Lista') {
            setQuery('');
            setActiveCategory('Mi Lista');
            fetch('/api/playlist')
                .then(r => r.ok ? r.json() : [])
                .then((data: any[]) => {
                    setSearchResults(data.map((p: any, i: number) => ({
                        id: 3000 + i, videoId: p.videoId, title: p.title,
                        artist: p.artist, type: p.type ?? 'Video',
                        duration: p.duration ?? '0:00', views: '',
                        color: videoColor(p.videoId ?? ''),
                        initial: p.title?.charAt(0).toUpperCase() ?? '?',
                        thumbnail: p.thumbnail,
                    })));
                    setActiveFilter('Todo');
                }).catch(() => {});
        }
    }

    const categoryToNavLabel: Record<string, string> = {
        'Lyric': 'Lyrics', 'Karaoke': 'Karaoke', 'Subtitulado': 'Subtitulado',
        'Favoritos': 'Favoritos', 'Mi Lista': 'Mi Lista',
    };
    const activeNavLabel = searchResults !== null
        ? (['Favoritos', 'Mi Lista'].includes(activeCategory) ? activeCategory : 'Explorar')
        : (activeCategory !== 'Todo' && categoryToNavLabel[activeCategory])
            ? categoryToNavLabel[activeCategory]
            : 'Inicio';

    const hasRealVideo = !!currentSong?.videoId;
    const homeLoading  = loadingHome || loadingCategory;

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
                onNavClick={handleNavClick}
            >
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
                        query={activeCategory === 'Favoritos' ? 'Mis Favoritos' : activeCategory === 'Mi Lista' ? 'Mi Lista' : query}
                        results={searchResults}
                        activeFilter={activeFilter}
                        activeSongId={currentSong?.id ?? null}
                        favorites={favorites}
                        playlist={playlist}
                        onFilterChange={setActiveFilter}
                        onPlay={playSong}
                        onToggleFavorite={toggleFavorite}
                        onTogglePlaylist={togglePlaylist}
                    />
                )}

                {!searching && searchResults === null && (
                    <div className="pb-4">
                        <FeaturedBanner items={featuredItems} onPlay={playSong} loading={loadingHome} />

                        <div className="mt-5">
                            <CategoryChips categories={CATEGORIES} active={activeCategory} onChange={handleCategoryChange} />
                        </div>

                        <TrendingGrid songs={trendingSongs} activeSongId={currentSong?.id ?? null} onPlay={playSong} loading={homeLoading} />

                        <SongList
                            songs={allSongs}
                            activeSongId={currentSong?.id ?? null}
                            favorites={favorites}
                            playlist={playlist}
                            onPlay={playSong}
                            onToggleFavorite={toggleFavorite}
                            onTogglePlaylist={togglePlaylist}
                            loading={homeLoading}
                        />
                    </div>
                )}
            </KaraokeLayout>

            {currentSong && hasRealVideo && (
                <KaraokeVideoPlayer
                    song={currentSong}
                    onClose={() => { setCurrentSong(null); setIsPlaying(false); }}
                    onEnded={playRandom}
                    onNext={playRandom}
                    onPrev={playPrev}
                    isFavorite={currentSong.videoId ? favorites.includes(currentSong.videoId) : false}
                    inPlaylist={currentSong.videoId ? playlist.includes(currentSong.videoId) : false}
                    onToggleFavorite={() => toggleFavorite(currentSong)}
                    onTogglePlaylist={() => togglePlaylist(currentSong)}
                />
            )}
            {currentSong && !hasRealVideo && (
                <MiniPlayer
                    song={currentSong}
                    isPlaying={isPlaying}
                    isFavorite={currentSong.videoId ? favorites.includes(currentSong.videoId) : false}
                    inPlaylist={currentSong.videoId ? playlist.includes(currentSong.videoId) : false}
                    onToggle={() => setIsPlaying(p => !p)}
                    onClose={() => { setCurrentSong(null); setIsPlaying(false); }}
                    onToggleFavorite={() => toggleFavorite(currentSong)}
                    onTogglePlaylist={() => togglePlaylist(currentSong)}
                />
            )}
        </>
    );
}
