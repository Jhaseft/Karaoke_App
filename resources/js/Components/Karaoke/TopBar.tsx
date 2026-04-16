import { useRef } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { User, PageProps } from '@/types';

interface Props {
    query: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
    onMenuOpen: () => void;
    user: User | null;
}

export default function TopBar({ query, onChange, onSearch, onClear, onMenuOpen, user }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage<PageProps>().props;

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') onSearch();
    }

    return (
        <header
            className="sticky top-0 z-10 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3"
            style={{
                background: 'rgba(10,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(220,38,38,0.12)',
            }}
        >

            <button
                className="md:hidden flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5"
                onClick={onMenuOpen}
            >
                <Menu size={20} />
            </button>


            <div className="flex-1 flex items-center gap-2 max-w-xl">
                <div
                    className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full"
                    style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(220,38,38,0.25)'
                    }}
                >
                    <Search size={16} color="#9ca3af" className="flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar..."
                        className="flex-1 bg-transparent text-sm text-white outline-none min-w-0"
                    />
                    {query && (
                        <button onClick={onClear} className="text-gray-500 ">
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button
                    onClick={onSearch}
                    className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 12px rgba(220,38,38,0.35)' }}
                >
                    <span className="hidden sm:inline">Buscar</span>
                    <Search size={16} className="sm:hidden" />
                </button>
            </div>


            <div className="ml-auto flex items-center gap-2">
            
                <div
                    className="flex items-center justify-center rounded-full text-xs font-bold text-white cursor-pointer"
                    style={{ width: 32, height: 32, background: auth.isGuest ? 'linear-gradient(135deg, #4b5563, #1f2937)' : 'linear-gradient(135deg, #dc2626, #7f1d1d)', border: '1px solid rgba(220,38,38,0.4)' }}
                >
                    {auth.isGuest ? '?' : user ? user.name.charAt(0).toUpperCase() + user.name.split(' ').slice(-1)[0].charAt(0).toUpperCase() : '?'}
                </div>
            </div>
        </header>
    );
}
