import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6"
            style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
            }}
        >
            {/* Decorative background dots */}
            <div
                className="pointer-events-none fixed inset-0 opacity-5"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, #ff2222 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Logo / Brand */}
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="group flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-600 bg-black shadow-lg shadow-red-900/50 transition-transform duration-200 group-hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-8 w-8 text-red-500"
                        >
                            <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v5a2 2 0 0 0 4 0V7a2 2 0 0 0-2-2zm-7 8h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.93V21h2v2H9v-2h2v-2.07A7 7 0 0 1 5 13z" />
                        </svg>
                    </div>
                    <span
                        className="text-3xl font-black tracking-widest text-white"
                        style={{ textShadow: '0 0 20px rgba(220,38,38,0.7)' }}
                    >
                        KARA<span className="text-red-500">OKE</span>
                    </span>
                </Link>
            </div>

            {/* Card */}
            <div
                className="w-full max-w-md overflow-hidden rounded-xl"
                style={{
                    background: 'rgba(10,10,10,0.95)',
                    border: '1px solid rgba(220,38,38,0.3)',
                    boxShadow: '0 0 40px rgba(220,38,38,0.15), 0 20px 60px rgba(0,0,0,0.8)',
                }}
            >
                <div
                    className="h-1 w-full"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
                    }}
                />
                <div className="px-8 py-8">{children}</div>
            </div>
        </div>
    );
}
