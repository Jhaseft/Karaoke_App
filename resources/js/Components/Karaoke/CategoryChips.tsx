interface Props {
    categories: string[];
    active: string;
    onChange: (category: string) => void;
}

export default function CategoryChips({ categories, active, onChange }: Props) {
    return (
        <div
            className="flex gap-2 px-4 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
        >
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                    style={
                        active === cat
                            ? { background: '#dc2626', color: '#fff', boxShadow: '0 0 10px rgba(220,38,38,0.4)' }
                            : { background: 'rgba(255,255,255,0.07)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
