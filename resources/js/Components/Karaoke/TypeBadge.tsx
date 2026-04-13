const TYPE_STYLES: Record<string, string> = {
    Karaoke:    'bg-red-600/20 text-red-400 border-red-600/40',
    Lyric:      'bg-emerald-600/20 text-emerald-400 border-emerald-600/40',
    Subtitulado:'bg-violet-600/20 text-violet-400 border-violet-600/40',
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
