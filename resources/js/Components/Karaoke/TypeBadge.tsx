const TYPE_STYLES: Record<string, string> = {
    Karaoke:    'bg-red-600/20 text-red-400 border-red-600/40',
    Lyric:      'bg-emerald-600/20 text-emerald-400 border-emerald-600/40',
    Subtitulado:'bg-violet-600/20 text-violet-400 border-violet-600/40',
    Reggaeton:  'bg-orange-600/20 text-orange-400 border-orange-600/40',
    Pop:        'bg-pink-600/20 text-pink-400 border-pink-600/40',
    Rock:       'bg-yellow-600/20 text-yellow-400 border-yellow-600/40',
    Cumbia:     'bg-cyan-600/20 text-cyan-400 border-cyan-600/40',
};

export default function TypeBadge({ type }: { type: string }) {
    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                TYPE_STYLES[type] ?? 'bg-gray-600/20 text-gray-400 border-gray-600/40'
            }`}
        >
            {type}
        </span>
    );
}
