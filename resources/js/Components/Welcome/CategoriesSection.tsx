const categories = [
    { name: 'Karaoke',     emoji: '🎤', color: '#ef4444' },
    { name: 'Lyrics',      emoji: '🎵', color: '#f97316' },
    { name: 'Subtitulado', emoji: '📺', color: '#eab308' },
    { name: 'Reggaeton',   emoji: '🔥', color: '#a855f7' },
    { name: 'Pop',         emoji: '⭐', color: '#ec4899' },
    { name: 'Rock',        emoji: '🎸', color: '#3b82f6' },
    { name: 'Cumbia',      emoji: '🪗', color: '#22c55e' },
    { name: 'Bachata',     emoji: '💃', color: '#f43f5e' },
    { name: 'Salsa',       emoji: '🎺', color: '#fb923c' },
    { name: 'Balada',      emoji: '🎶', color: '#818cf8' },
];

export default function CategoriesSection() {
    return (
        <section className="px-6 py-12 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <span
                    className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-red-500 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.1)' }}
                >
                    Géneros
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                    Explora por categoría
                </h2>
                <p className="text-gray-500 text-sm">
                    Desde karaoke clásico hasta los géneros más populares de Latinoamérica.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(c => (
                    <div
                        key={c.name}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white cursor-default transition-all hover:scale-105"
                        style={{
                            background: `${c.color}18`,
                            border: `1px solid ${c.color}35`,
                        }}
                    >
                        <span>{c.emoji}</span>
                        <span>{c.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
