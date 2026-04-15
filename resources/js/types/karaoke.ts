export interface Song {
    id: number;
    videoId?: string;   // YouTube video ID (presente en resultados reales de búsqueda)
    title: string;
    artist: string;
    type: string;
    duration: string;
    views: string;
    color: string;
    initial: string;
    thumbnail?: string; // URL de miniatura de YouTube
}

export interface FeaturedSong {
    id: number;
    videoId?: string;
    title: string;
    artist: string;
    type: string;
    duration: string;
    color: string;
    accent: string;
    initial: string;
    thumbnail?: string;
}
