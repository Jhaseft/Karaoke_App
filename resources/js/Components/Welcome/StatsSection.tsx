const stats = [
    { value: '10M+',  label: 'Canciones disponibles',    sub: 'en todos los géneros' },
    { value: '100%',  label: 'Gratis',                   sub: 'sin suscripción' },
    { value: '50+',   label: 'Categorías musicales',     sub: 'Karaoke, Pop, Rock y más' },
    { value: '0s',    label: 'Tiempo de instalación',    sub: 'directo desde el navegador' },
];

export default function StatsSection() {
    return (
        <section
            className="mx-4 sm:mx-6 lg:mx-auto max-w-5xl rounded-3xl px-8 py-12 my-4"
            style={{
                background: 'linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(153,27,27,0.06) 100%)',
                border: '1px solid rgba(220,38,38,0.18)',
            }}
        >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {stats.map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                        <span
                            className="text-4xl sm:text-5xl font-black"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            {s.value}
                        </span>
                        <span className="text-white font-semibold text-sm">{s.label}</span>
                        <span className="text-gray-600 text-xs">{s.sub}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
