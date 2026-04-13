import { Music2 } from 'lucide-react';

interface Props {
    color: string;
    initial: string;
    size?: number;
}

export default function AlbumArt({ color, size = 56 }: Props) {
    const iconSize = Math.round(size * 0.45);

    return (
        <div
            className="flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden"
            style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${color} 0%, #0a0a0a 100%)`,
                border: '1px solid rgba(220,38,38,0.25)',
            }}
        >
            <Music2 size={iconSize} color="rgba(220,38,38,0.6)" />
        </div>
    );
}
