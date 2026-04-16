import { Link } from '@inertiajs/react';
import { Mic2 } from 'lucide-react';

export default function CtaBanner() {
    return (
        <section className="px-6 py-16 max-w-4xl mx-auto">
            <div
                className="relative overflow-hidden rounded-3xl px-8 py-14 text-center"
                style={{
                    background: 'linear-gradient(135deg, #7f1d1d 0%, #1a0000 50%, #0a0a0a 100%)',
                    border: '1px solid rgba(220,38,38,0.3)',
                    boxShadow: '0 0 60px rgba(220,38,38,0.15)',
                }}
            >
                {/* Glow */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.4), transparent 60%)' }}
                />

                <div className="relative z-10 flex flex-col items-center gap-5">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(220,38,38,0.2)', border: '2px solid rgba(220,38,38,0.4)' }}
                    >
                        <Mic2 size={30} color="#ef4444" />
                    </div>

                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                            ¿Listo para cantar?
                        </h2>
                        <p className="text-gray-400 text-base max-w-md mx-auto">
                            Únete gratis hoy y descubre por qué miles de personas eligen
                            Pachamama Karaoke para sus noches de entretenimiento.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('register')}
                            className="px-8 py-3.5 rounded-full text-base font-bold text-white transition-all hover:brightness-110 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                                boxShadow: '0 0 24px rgba(220,38,38,0.5)',
                            }}
                        >
                            Crear cuenta gratis
                        </Link>
                        <Link
                            href={route('login')}
                            className="px-8 py-3.5 rounded-full text-base font-medium text-gray-300 border border-white/15 hover:bg-white/5 transition-all"
                        >
                            Ya tengo cuenta
                        </Link>
                    </div>

                    <p className="text-gray-600 text-xs">
                        Sin tarjeta de crédito · Sin contratos · Cancela cuando quieras
                    </p>
                </div>
            </div>
        </section>
    );
}
