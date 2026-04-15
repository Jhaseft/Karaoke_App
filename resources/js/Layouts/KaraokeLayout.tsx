import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Karaoke/Sidebar';
import TopBar from '@/Components/Karaoke/TopBar';
import type { PageProps } from '@/types';

interface Props {
    activeLabel: string;
    hasPlayer: boolean;
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
    onNavClick: (label: string) => void;
    children: React.ReactNode;
}

export default function KaraokeLayout({
    activeLabel,
    hasPlayer,
    query,
    onQueryChange,
    onSearch,
    onClear,
    onNavClick,
    children,
}: Props) {
    const { auth } = usePage<PageProps>().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="flex h-screen overflow-hidden text-white"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)' }}
        >
            <Sidebar
                isOpen={sidebarOpen}
                hasPlayer={hasPlayer}
                activeLabel={activeLabel}
                user={auth.user}
                onClose={() => setSidebarOpen(false)}
                onNavClick={onNavClick}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <TopBar
                    query={query}
                    onChange={onQueryChange}
                    onSearch={onSearch}
                    onClear={onClear}
                    onMenuOpen={() => setSidebarOpen(true)}
                    user={auth.user}
                />

                <main
                    className="flex-1 overflow-y-auto"
                    style={{ paddingBottom: hasPlayer ? 80 : 0 }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
