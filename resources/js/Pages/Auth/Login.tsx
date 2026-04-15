import Checkbox from '@/Components/LaravelComponents/Checkbox';
import InputError from '@/Components/LaravelComponents/InputError';
import InputLabel from '@/Components/LaravelComponents/InputLabel';
import PasswordInput from '@/Components/LaravelComponents/PasswordInput';
import PrimaryButton from '@/Components/LaravelComponents/PrimaryButton';
import SocialLoginButtons from '@/Components/LaravelComponents/SocialLoginButtons';
import TextInput from '@/Components/LaravelComponents/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <h2 className="mb-6 text-center text-2xl font-bold tracking-widest text-white">
                INICIAR <span className="text-red-500">SESIÓN</span>
            </h2>

            {status && (
                <div className="mb-4 rounded-md border border-green-700 bg-green-900/30 px-4 py-2 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', (e.target.checked || false) as false)
                            }
                        />
                        <span className="text-sm text-gray-400">Recordarme</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-red-400 transition-colors duration-150 hover:text-red-300"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        Entrar
                    </PrimaryButton>
                </div>

                <p className="text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-red-400 transition-colors hover:text-red-300"
                    >
                        Regístrate aquí
                    </Link>
                </p>

                <SocialLoginButtons />
            </form>
        </GuestLayout>
    );
}
