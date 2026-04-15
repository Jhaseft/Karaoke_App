import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import type { FeaturedSong, Song } from '@/types/karaoke';
import TypeBadge from './TypeBadge';

interface Props {
    items: FeaturedSong[];
    onPlay: (song: Song) => void;
    loading?: boolean;
}

const SKELETON = (
    <div
        className="relative mx-4 mt-5 rounded-2xl overflow-hidden animate-pulse"
        style={{ height: 'clamp(180px, 32vw, 300px)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(220,38,38,0.08)' }}
    >
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
            <div className="h-5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="space-y-2">
                <div className="h-5 w-3/4 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="h-3 w-1/3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-8 w-28 rounded-full mt-3" style={{ background: 'rgba(220,38,38,0.2)' }} />
            </div>
        </div>
    </div>
);

export default function FeaturedBanner({ items, onPlay, loading }: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!items.length) return;
        const t = setInterval(() => setIndex(i => (i + 1) % items.length), 5000);
        return () => clearInterval(t);
    }, [items.length]);

    // Mostrar skeleton mientras carga o si no hay datos aún
    const feat = items[index];
    if (loading || !feat) return SKELETON;

    function handlePlay() {
        onPlay({
            id:        feat.id,
            videoId:   feat.videoId,
            title:     feat.title,
            artist:    feat.artist,
            type:      feat.type,
            duration:  feat.duration,
            views:     '',
            color:     feat.color,
            initial:   feat.initial,
            thumbnail: feat.thumbnail,
        });
    }

    return (
        <div className="relative mx-4 mt-5 rounded-2xl overflow-hidden" style={{ height: 'clamp(180px, 32vw, 300px)' }}>

            {feat.thumbnail ? (
                <>
                    <img
                        src={feat.thumbnail}
                        alt={feat.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                        style={{ filter: 'brightness(0.7)' }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)' }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}
                    />
                </>
            ) : (
                <>
                    <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{ background: `linear-gradient(135deg, ${feat.color} 0%, #0a0a0a 100%)` }}
                    />
                    <div className="absolute -top-6 -right-6 rounded-full opacity-20" style={{ width: 160, height: 160, background: feat.accent }} />
                    <div className="absolute -bottom-10 right-24 rounded-full opacity-10" style={{ width: 100, height: 100, background: feat.accent }} />
                </>
            )}

            <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
                <TypeBadge type={feat.type} />
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight line-clamp-2 drop-shadow">{feat.title}</h2>
                    <p className="text-sm mt-1 font-medium drop-shadow" style={{ color: feat.thumbnail ? '#fca5a5' : feat.accent }}>
                        {feat.artist}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
                            style={{ background: '#dc2626', boxShadow: '0 0 18px rgba(220,38,38,0.6)' }}
                        >
                            <Play size={14} fill="white" />
                            Reproducir
                        </button>
                        <span className="text-xs text-gray-300 drop-shadow">{feat.duration}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 right-4 flex gap-1.5">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className="rounded-full transition-all duration-200"
                        style={{
                            width: i === index ? 16 : 6,
                            height: 6,
                            background: i === index ? '#dc2626' : 'rgba(255,255,255,0.4)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
