import { UserPlus, Search, Mic2 } from 'lucide-react';

const steps = [
    {
        step: '01',
        icon: <UserPlus size={28} color="#ef4444" />,
        title: 'Crea tu cuenta',
        desc: 'Regístrate en segundos de forma gratuita. Solo necesitas un correo y una contraseña. Sin tarjetas de crédito.',
    },
    {
        step: '02',
        icon: <Search size={28} color="#ef4444" />,
        title: 'Busca tu canción',
        desc: 'Escribe el nombre de la canción o artista. Filtra por Karaoke, Lyrics o Subtitulado según lo que necesites.',
    },
    {
        step: '03',
        icon: <Mic2 size={28} color="#ef4444" />,
        title: '¡Canta!',
        desc: 'Presiona play y disfruta. Guarda tus favoritos y vuelve a cantarlos cuando quieras, desde cualquier lugar.',
    },
];

export default function HowItWorksSection() {
    return (
        <section className="px-6 py-16 max-w-5xl mx-auto">

            <div className="text-center mb-12">
                <span
                    className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-red-500 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.1)' }}
                >
                    Cómo funciona
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Listo para cantar en 3 pasos
                </h2>
                <p className="text-gray-500 text-base max-w-lg mx-auto">
                    Sin complicaciones. Empieza a cantar en menos de un minuto.
                </p>
            </div>


            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">

                <div
                    className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)' }}
                />

                {steps.map((s, i) => (
                    <div key={s.step} className="relative flex flex-col items-center text-center gap-4">

                        <div className="relative">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: 'rgba(220,38,38,0.1)',
                                    border: '1px solid rgba(220,38,38,0.25)',
                                    boxShadow: '0 0 20px rgba(220,38,38,0.1)',
                                }}
                            >
                                {s.icon}
                            </div>

                            <span
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black text-white flex items-center justify-center"
                                style={{ background: '#dc2626' }}
                            >
                                {i + 1}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-base mb-1">{s.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
