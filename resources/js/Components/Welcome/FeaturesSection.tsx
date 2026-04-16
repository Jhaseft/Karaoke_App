import { Mic2, Music2, Subtitles, Heart, Zap, Smartphone } from 'lucide-react';

const features = [
    {
        icon: <Mic2 size={26} color="#ef4444" />,
        title: 'Karaoke Completo',
        desc: 'Miles de pistas de karaoke en alta calidad. Canta las canciones de tus artistas favoritos sin la voz original.',
        badge: 'Lo más popular',
    },
    {
        icon: <Music2 size={26} color="#ef4444" />,
        title: 'Letras en Pantalla',
        desc: 'Visualiza las letras mientras el video se reproduce. Nunca olvides una sola línea de tu canción favorita.',
        badge: null,
    },
    {
        icon: <Subtitles size={26} color="#ef4444" />,
        title: 'Videos Subtitulados',
        desc: 'Accede a videos con subtítulos en español e inglés. Ideal para aprender canciones en otros idiomas.',
        badge: null,
    },
    {
        icon: <Heart size={26} color="#ef4444" />,
        title: 'Lista de Favoritos',
        desc: 'Guarda tus canciones favoritas y tenlas siempre a mano. Tu playlist personalizada te espera cada vez que entras.',
        badge: 'Nuevo',
    },
    {
        icon: <Zap size={26} color="#ef4444" />,
        title: 'Búsqueda Instantánea',
        desc: 'Encuentra cualquier canción en segundos. Busca por título, artista o género y empieza a cantar de inmediato.',
        badge: null,
    },
    {
        icon: <Smartphone size={26} color="#ef4444" />,
        title: 'Multiplataforma',
        desc: 'Funciona en tu celular, tablet o computadora. Sin descargas ni instalaciones, directo desde el navegador.',
        badge: null,
    },
];

export default function FeaturesSection() {
    return (
        <section className="px-6 py-16 max-w-6xl mx-auto">

            <div className="text-center mb-12">
                <span
                    className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-red-500 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.1)' }}
                >
                    Características
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Todo lo que necesitas para cantar
                </h2>
                <p className="text-gray-500 text-base max-w-xl mx-auto">
                    Una plataforma completa diseñada para ofrecerte la mejor experiencia de karaoke,
                    sin complicaciones y sin costo.
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map(f => (
                    <div
                        key={f.title}
                        className="relative flex flex-col gap-3 p-6 rounded-2xl group transition-all hover:-translate-y-0.5"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(220,38,38,0.1)',
                        }}
                    >

                        {f.badge && (
                            <span
                                className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-red-400"
                                style={{ background: 'rgba(220,38,38,0.15)' }}
                            >
                                {f.badge}
                            </span>
                        )}


                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(220,38,38,0.1)' }}
                        >
                            {f.icon}
                        </div>

                        <h3 className="text-white font-bold text-base">{f.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
