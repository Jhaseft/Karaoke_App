import type { FeaturedSong, Song } from '@/types/karaoke';

export const CATEGORIES = ['Todo', 'Karaoke', 'Lyric', 'Subtitulado', 'Reggaeton', 'Pop', 'Rock', 'Cumbia'];

export const FILTER_TYPES = ['Todo', 'Karaoke', 'Lyric', 'Subtitulado'];

export const FEATURED: FeaturedSong[] = [
    { id: 1, title: 'Quevedo: Bzrp Music Sessions #52', artist: 'Bizarrap & Quevedo', type: 'Karaoke', duration: '3:18', color: '#7c0000', accent: '#ff4444', initial: 'B' },
    { id: 2, title: 'Hawái', artist: 'Maluma', type: 'Lyric', duration: '3:10', color: '#005f73', accent: '#0a9396', initial: 'M' },
    { id: 3, title: 'Con Calma', artist: 'Daddy Yankee & Snow', type: 'Karaoke', duration: '3:33', color: '#4a0072', accent: '#9c27b0', initial: 'D' },
];

export const TRENDING: Song[] = [
    { id: 101, title: 'Shakira: Bzrp Music Sessions #53', artist: 'Bizarrap & Shakira', type: 'Karaoke', duration: '3:09', views: '2.1M', color: '#6b0000', initial: 'S' },
    { id: 102, title: 'Tití Me Preguntó', artist: 'Bad Bunny', type: 'Lyric', duration: '4:04', views: '1.8M', color: '#003060', initial: 'B' },
    { id: 103, title: 'Me Porto Bonito', artist: 'Bad Bunny ft. Chencho Corleone', type: 'Subtitulado', duration: '2:52', views: '1.5M', color: '#005700', initial: 'B' },
    { id: 104, title: 'Provenza', artist: 'KAROL G', type: 'Karaoke', duration: '3:20', views: '1.2M', color: '#5a003a', initial: 'K' },
    { id: 105, title: 'El Apagón', artist: 'Bad Bunny', type: 'Lyric', duration: '3:32', views: '980K', color: '#602000', initial: 'B' },
    { id: 106, title: 'La Jumpa', artist: 'Arcangel & Bad Bunny', type: 'Karaoke', duration: '3:55', views: '870K', color: '#003a5a', initial: 'A' },
    { id: 107, title: 'Gatúbela', artist: 'KAROL G & Maldy', type: 'Subtitulado', duration: '3:05', views: '760K', color: '#3a0060', initial: 'G' },
    { id: 108, title: 'Mamiii', artist: 'Becky G & KAROL G', type: 'Lyric', duration: '3:25', views: '710K', color: '#600020', initial: 'B' },
];

export const ALL_SONGS: Song[] = [
    { id: 1,  title: 'Nevada (Lyrics)',                      artist: 'Vicetone feat Cozi Zuehlsdorff',        type: 'Lyric',      duration: '3:29', views: '4.2M', color: '#1a003a', initial: 'N' },
    { id: 2,  title: 'Nevada (Slowed + Reverb)',             artist: 'Vicetone feat. Cozi Zuehlsdorff',       type: 'Lyric',      duration: '4:32', views: '2.1M', color: '#1a003a', initial: 'N' },
    { id: 3,  title: 'Nevada (Slowed + Reverb) Lyrics',     artist: 'Vicetone',                              type: 'Lyric',      duration: '4:44', views: '1.8M', color: '#1a003a', initial: 'N' },
    { id: 4,  title: 'Nevada (Slowed+Reverb)',               artist: 'Vicetone',                              type: 'Subtitulado',duration: '4:32', views: '950K', color: '#001a3a', initial: 'N' },
    { id: 5,  title: 'Quevedo: Bzrp Music Sessions #52',    artist: 'Bizarrap & Quevedo',                    type: 'Karaoke',    duration: '3:18', views: '2.8M', color: '#3a0000', initial: 'Q' },
    { id: 6,  title: 'Hawái',                               artist: 'Maluma',                                type: 'Karaoke',    duration: '3:10', views: '1.5M', color: '#001a3a', initial: 'H' },
    { id: 7,  title: 'Tití Me Preguntó',                    artist: 'Bad Bunny',                             type: 'Lyric',      duration: '4:04', views: '3.1M', color: '#003a1a', initial: 'T' },
    { id: 8,  title: 'MAMIII',                              artist: 'Becky G & KAROL G',                     type: 'Subtitulado',duration: '3:25', views: '2.4M', color: '#3a001a', initial: 'M' },
    { id: 9,  title: 'La Gasolina',                         artist: 'Daddy Yankee',                          type: 'Karaoke',    duration: '3:28', views: '1.9M', color: '#3a1a00', initial: 'G' },
    { id: 10, title: 'Despacito',                           artist: 'Luis Fonsi ft. Daddy Yankee',           type: 'Karaoke',    duration: '3:47', views: '5.6M', color: '#001a1a', initial: 'D' },
    { id: 11, title: 'Shape of You',                        artist: 'Ed Sheeran',                            type: 'Lyric',      duration: '3:53', views: '4.8M', color: '#1a2000', initial: 'S' },
    { id: 12, title: 'Blinding Lights',                     artist: 'The Weeknd',                            type: 'Subtitulado',duration: '3:20', views: '3.7M', color: '#1a001a', initial: 'B' },
    { id: 13, title: 'Provenza',                            artist: 'KAROL G',                               type: 'Karaoke',    duration: '3:20', views: '2.2M', color: '#3a003a', initial: 'P' },
    { id: 14, title: 'Con Calma',                           artist: 'Daddy Yankee & Snow',                   type: 'Karaoke',    duration: '3:33', views: '2.0M', color: '#002a3a', initial: 'C' },
    { id: 15, title: 'Ojitos Lindos',                       artist: 'Bad Bunny & Bomba Estéreo',             type: 'Lyric',      duration: '4:10', views: '1.6M', color: '#1a2a00', initial: 'O' },
    { id: 16, title: 'Efecto',                              artist: 'Bad Bunny',                             type: 'Subtitulado',duration: '3:45', views: '1.3M', color: '#2a0010', initial: 'E' },
];
