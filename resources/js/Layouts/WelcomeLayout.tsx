import { Link, router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { Mic2, Menu, X } from 'lucide-react';

export default function WelcomeLayout({ children }: PropsWithChildren) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className="min-h-screen text-white"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)' }}
        >

            <header
                className="sticky top-0 z-50 px-4 sm:px-6"
                style={{
                    background: 'rgba(10,0,0,0.88)',
                    backdropFilter: 'blur(14px)',
                    borderBottom: '1px solid rgba(220,38,38,0.15)',
                }}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between h-14 sm:h-16">

                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                                width: 40,
                                height: 40,
                                background: '#0a0a0a',
                                border: '1px solid #dc2626',
                                boxShadow: '0 0 12px rgba(220,38,38,0.5)',
                            }}
                        >
                            <img
                                src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1776305288/WhatsApp_Image_2026-04-15_at_9.51.13_PM_ua1zwx.jpg"
                                alt="Karaoke Logo"
                                className="rounded-full object-cover"
                                style={{ width: 36, height: 36 }}
                            />
                        </div>
                        <span className="text-sm font-black tracking-widest text-white">
                            KARA<span className="text-red-500">OKE</span>
                        </span>
                        <span
                            className="hidden sm:inline text-[10px] font-medium text-gray-500 px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            Pachamama Bar
                        </span>
                    </Link>


                    <div className="hidden sm:flex items-center gap-2">
                        <Link
                            href={route('login')}
                            className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-white/5"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
                            style={{
                                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                                boxShadow: '0 0 12px rgba(220,38,38,0.35)',
                            }}
                        >
                            Registrarse
                        </Link>
                    </div>

                    <button
                        className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/05 transition-colors"
                        style={{ background: menuOpen ? 'rgba(255,255,255,0.06)' : undefined }}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Menú"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {menuOpen && (
                    <div
                        className="sm:hidden pb-4 pt-2 flex flex-col gap-2 border-t"
                        style={{ borderColor: 'rgba(220,38,38,0.1)' }}
                    >
                        <Link
                            href={route('login')}
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/05 transition-colors text-center"
                            onClick={() => setMenuOpen(false)}
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            href={route('register')}
                            className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:brightness-110"
                            style={{
                                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                                boxShadow: '0 0 16px rgba(220,38,38,0.35)',
                            }}
                            onClick={() => setMenuOpen(false)}
                        >
                            Registrarse gratis
                        </Link>
                        <button
                            onClick={() => { setMenuOpen(false); router.post(route('guest.login')); }}
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/04 transition-colors"
                            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            Entrar como invitado
                        </button>
                    </div>
                )}
            </header>

            <main className="w-full">{children}</main>
        </div>
    );
}
