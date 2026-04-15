import { Head, Link } from '@inertiajs/react';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import { Mic2, Music2, Subtitles } from 'lucide-react';

export default function Welcome() {
    return (
        <WelcomeLayout>
            <Head title="Karaoke — Pachamama Bar" />

            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                {/* Logo */}
                <div
                    className="mb-6 flex items-center justify-center rounded-full"
                    style={{
                        width: 80,
                        height: 80,
                        background: '#0a0a0a',
                        border: '2px solid #dc2626',
                        boxShadow: '0 0 30px rgba(220,38,38,0.5)',
                    }}
                >
                    <Mic2 size={36} color="#ef4444" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-white mb-4">
                    KARA<span className="text-red-500">OKE</span>
                </h1>
                <p className="text-gray-400 text-lg mb-2">Pachamama Bar</p>
                <p className="text-gray-500 text-sm max-w-md mb-10">
                    Busca tus canciones favoritas, canta con letras y disfruta de la mejor experiencia karaoke.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('register')}
                        className="px-8 py-3 rounded-full text-base font-semibold text-white transition-all hover:brightness-110"
                        style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 20px rgba(220,38,38,0.4)' }}
                    >
                        Comenzar gratis
                    </Link>
                    <Link
                        href={route('login')}
                        className="px-8 py-3 rounded-full text-base font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        Iniciar sesión
                    </Link>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
                    {[
                        { icon: <Mic2 size={24} color="#ef4444" />, title: 'Karaoke', desc: 'Canta tus canciones favoritas' },
                        { icon: <Music2 size={24} color="#ef4444" />, title: 'Lyrics', desc: 'Letras sincronizadas' },
                        { icon: <Subtitles size={24} color="#ef4444" />, title: 'Subtitulado', desc: 'Videos con subtítulos' },
                    ].map(f => (
                        <div
                            key={f.title}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(220,38,38,0.12)' }}
                        >
                            {f.icon}
                            <p className="text-white font-semibold">{f.title}</p>
                            <p className="text-gray-500 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </WelcomeLayout>
    );
}
