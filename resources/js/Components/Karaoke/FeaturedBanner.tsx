import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import type { FeaturedSong, Song } from '@/types/karaoke';
import TypeBadge from './TypeBadge';

interface Props {
    items: FeaturedSong[];
    onPlay: (song: Song) => void;
}

export default function FeaturedBanner({ items, onPlay }: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIndex(i => (i + 1) % items.length), 5000);
        return () => clearInterval(t);
    }, [items.length]);

    const feat = items[index];

    function handlePlay() {
        onPlay({
            id: feat.id,
            title: feat.title,
            artist: feat.artist,
            type: feat.type,
            duration: feat.duration,
            views: '',
            color: feat.color,
            initial: feat.initial,
        });
    }

    return (
        <div className="relative mx-4 mt-5 rounded-2xl overflow-hidden" style={{ height: 'clamp(160px, 28vw, 260px)' }}>
         
            <div
                className="absolute inset-0 transition-all duration-700"
                style={{ background: `linear-gradient(135deg, ${feat.color} 0%, #0a0a0a 100%)` }}
            />
           
            <div className="absolute -top-6 -right-6 rounded-full opacity-20" style={{ width: 160, height: 160, background: feat.accent }} />
            <div className="absolute -bottom-10 right-24 rounded-full opacity-10" style={{ width: 100, height: 100, background: feat.accent }} />

          
            <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
                <TypeBadge type={feat.type} />
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">{feat.title}</h2>
                    <p className="text-sm mt-1" style={{ color: feat.accent }}>{feat.artist}</p>
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                            style={{ background: '#dc2626', boxShadow: '0 0 14px rgba(220,38,38,0.5)' }}
                        >
                            <Play size={14} fill="white" />
                            Reproducir
                        </button>
                        <span className="text-xs text-gray-400">{feat.duration}</span>
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
                            background: i === index ? '#dc2626' : 'rgba(255,255,255,0.3)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
