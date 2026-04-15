import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Mic2 } from 'lucide-react';

export default function WelcomeLayout({ children }: PropsWithChildren) {
    return (
        <div
            className="min-h-screen text-white"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)' }}
        >
            {/* Header */}
            <header
                className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
                style={{
                    background: 'rgba(10,0,0,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(220,38,38,0.15)',
                }}
            >
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3">
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
                        <Mic2 size={18} color="#ef4444" />
                    </div>
                    <span className="text-sm font-black tracking-widest text-white">
                        KARA<span className="text-red-500">OKE</span>
                    </span>
                </Link>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('login')}
                        className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-white/5"
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        href={route('register')}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
                        style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 12px rgba(220,38,38,0.35)' }}
                    >
                        Registrarse
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}
