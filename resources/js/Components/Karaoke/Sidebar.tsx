import {
    ClipboardList,
    Compass,
    Home,
    LogOut,
    Mic2,
    Music2,
    Star,
    Subtitles,
    Text,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import type { User } from '@/types';

interface NavItem {
    icon: React.ReactNode;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { icon: <Home size={18} />, label: 'Inicio' },
    { icon: <Compass size={18} />, label: 'Explorar' },
    { icon: <Mic2 size={18} />, label: 'Karaoke' },
    { icon: <Text size={18} />, label: 'Lyrics' },
    { icon: <Subtitles size={18} />, label: 'Subtitulado' },
    { icon: <Star size={18} />, label: 'Favoritos' },
    { icon: <ClipboardList size={18} />, label: 'Mi Lista' },
];

interface Props {
    isOpen: boolean;
    hasPlayer: boolean;
    activeLabel: string;
    user: User;
    onClose: () => void;
    onNavClick: (label: string) => void;
}

export default function Sidebar({ isOpen, hasPlayer, activeLabel, user, onClose, onNavClick }: Props) {
    return (
        <>

            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/70 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-30 h-screen flex flex-col transition-transform duration-300 md:relative md:translate-x-0 md:z-auto flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    width: 220,
                    background: 'rgba(8,8,8,0.98)',
                    borderRight: '1px solid rgba(220,38,38,0.15)',
                    paddingBottom: hasPlayer ? 80 : 0,
                }}
            >

                <div className="px-5 pt-6 pb-4 flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                            width: 36,
                            height: 36,
                            background: '#0a0a0a',
                            border: '2px solid #dc2626',
                            boxShadow: '0 0 12px rgba(220,38,38,0.5)',
                        }}
                    >
                        <Music2 size={18} color="#ef4444" />
                    </div>
                    <div>
                        <span className="text-sm font-black tracking-widest text-white">
                            KARA<span className="text-red-500">OKE</span>
                        </span>
                        <p className="text-xs text-gray-500 -mt-0.5">Pachamama Bar</p>
                    </div>
                </div>


                <nav className="flex-1 px-3 py-2 space-y-0.5">
                    {NAV_ITEMS.map(item => {
                        const active = item.label === activeLabel;
                        return (
                            <button
                                key={item.label}
                                onClick={() => { onNavClick(item.label); onClose(); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                                style={
                                    active
                                        ? { background: 'rgba(220,38,38,0.15)', color: '#f87171' }
                                        : { color: '#9ca3af' }
                                }
                                onMouseEnter={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                                }}
                            >
                                {item.icon}
                                {item.label}
                                {active && <span className="ml-auto w-1 h-1 rounded-full bg-red-500" />}
                            </button>
                        );
                    })}
                </nav>


                <div className="px-2 py-4 border-t" style={{ borderColor: 'rgba(220,38,38,0.15)' }}>
                    <div className="flex items-center gap-1">
                        <div
                            className="flex items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                            style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #dc2626, #7f1d1d)' }}
                        >
                            {user.name.charAt(0).toUpperCase() + user.name.split(' ').slice(-1)[0].charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="flex-shrink-0 p-1.5 rounded-md text-red-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
