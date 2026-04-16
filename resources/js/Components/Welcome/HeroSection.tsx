import { Link, router } from '@inertiajs/react';
import { Mic2, Play } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden">
          
            <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl opacity-20"
                style={{ width: 600, height: 600, background: 'radial-gradient(circle, #dc2626, transparent 70%)' }}
            />
            <div
                className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rounded-full blur-3xl opacity-10"
                style={{ width: 400, height: 400, background: 'radial-gradient(circle, #991b1b, transparent 70%)' }}
            />

       
            <span
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-400"
                style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)' }}
            >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                En vivo · Pachamama Bar
            </span>

     
            <div
                className="mb-7 flex items-center justify-center rounded-full"
                style={{
                    width: 88,
                    height: 88,
                    background: 'linear-gradient(135deg, #1a0000, #0a0a0a)',
                    border: '2px solid #dc2626',
                    boxShadow: '0 0 40px rgba(220,38,38,0.5), inset 0 0 20px rgba(220,38,38,0.08)',
                }}
            >
                <img
                            src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1776305288/WhatsApp_Image_2026-04-15_at_9.51.13_PM_ua1zwx.jpg"
                            alt="Karaoke Logo"
                            className="rounded-full object-cover"
                            style={{ width: 82, height: 82 }}
                        />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-widest text-white leading-none mb-3">
                KARA<span className="text-red-500">OKE</span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-gray-300 tracking-widest uppercase mb-4">
                Pachamama Bar
            </p>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-3 leading-relaxed">
                La experiencia de karaoke más completa de Perú. Busca, canta y disfruta
                con <span className="text-white font-semibold">millones de canciones</span> en tiempo real.
            </p>
            <p className="text-gray-600 text-sm max-w-md mb-10">
                Sin descargas. Sin instalación. Funciona desde cualquier dispositivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md sm:max-w-none sm:w-auto">
                <Link
                    href={route('register')}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white transition-all hover:brightness-110 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                        boxShadow: '0 0 24px rgba(220,38,38,0.45)',
                    }}
                >
                    <Play size={16} fill="white" />
                    Comenzar gratis
                </Link>
                <Link
                    href={route('login')}
                    className="flex items-center justify-center px-8 py-3.5 rounded-full text-base font-medium text-gray-200 border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all"
                >
                    Iniciar sesión
                </Link>
                <button
                    onClick={() => router.post(route('guest.login'))}
                    className="flex items-center justify-center px-8 py-3.5 rounded-full text-base font-medium text-gray-500 border border-white/06 hover:bg-white/04 hover:text-gray-400 transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                >
                    Entrar como invitado
                </button>
            </div>

            <div className="mt-10 flex items-center gap-2 text-sm text-gray-600">
                <div className="flex -space-x-2">
                    {['#ef4444','#f97316','#eab308'].map((c, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ background: c, borderColor: '#0a0a0a' }}
                        >
                            {['A','B','C'][i]}
                        </div>
                    ))}
                </div>
                <span>+500 usuarios activos este mes</span>
            </div>
        </section>
    );
}
