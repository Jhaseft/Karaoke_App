import { Mic2 } from 'lucide-react';

export default function WelcomeFooter() {
    const year = new Date().getFullYear();

    return (
        <footer
            className="mt-4 px-6 py-8 border-t"
            style={{ borderColor: 'rgba(220,38,38,0.12)' }}
        >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                            width: 46,
                            height: 46,
                            background: '#0a0a0a',
                            border: '1.5px solid #dc2626',
                            boxShadow: '0 0 10px rgba(220,38,38,0.4)',
                        }}
                    >
                        <img
                            src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1776305288/WhatsApp_Image_2026-04-15_at_9.51.13_PM_ua1zwx.jpg"
                            alt="Karaoke Logo"
                            className="rounded-full object-cover"
                            style={{ width: 42, height: 42 }}
                        />
                    </div>
                    <span className="text-sm font-black tracking-widest text-white">
                        KARA<span className="text-red-500">OKE</span>
                    </span>
                </div>

                <p className="text-gray-600 text-xs text-center sm:text-right">
                    © {year} Pachamama Bar · Todos los derechos reservados
                </p>
            </div>
        </footer>
    );
}
