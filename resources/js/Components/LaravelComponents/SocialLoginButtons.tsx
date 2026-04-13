import { router } from '@inertiajs/react';
import { useState } from 'react';
import { signInWithFacebook, signInWithGoogle } from '@/firebase';

export default function SocialLoginButtons() {
    const [loading, setLoading] = useState<'google' | 'facebook' | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSocialLogin(provider: 'google' | 'facebook') {
        setError(null);
        setLoading(provider);
        try {
            const idToken =
                provider === 'google'
                    ? await signInWithGoogle()
                    : await signInWithFacebook();

            router.post(
                '/auth/firebase',
                { id_token: idToken },
                {
                    onError: () => setError('No se pudo iniciar sesión. Intenta de nuevo.'),
                    onFinish: () => setLoading(null),
                },
            );
        } catch (e: unknown) {
            setLoading(null);
            const msg = e instanceof Error ? e.message : '';
            if (msg.includes('popup-closed') || msg.includes('cancelled')) return;
            if (msg.includes('account-exists-with-different-credential')) {
                setError('Este correo ya está registrado con otro método.');
            } else {
                setError('Error al conectar con ' + provider + '. Intenta de nuevo.');
            }
        }
    }

    return (
        <div className="space-y-3">

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-700" />
                <span className="text-xs text-gray-500 uppercase tracking-widest">o continúa con</span>
                <div className="h-px flex-1 bg-gray-700" />
            </div>

            {error && (
                <p className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-center text-xs text-red-400">
                    {error}
                </p>
            )}


            <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading !== null}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-800 disabled:opacity-50"
            >
                {loading === 'google' ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                )}
                Continuar con Google
            </button>


            <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading !== null}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-800 disabled:opacity-50"
            >
                {loading === 'facebook' ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2" aria-hidden="true">
                        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                )}
                Continuar con Facebook
            </button>
        </div>
    );
}
