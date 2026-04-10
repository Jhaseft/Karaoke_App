import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function PasswordInput(
    { className = '', ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
    ref,
) {
    const [visible, setVisible] = useState(false);
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    return (
        <div className="relative mt-1">
            <input
                {...props}
                ref={localRef}
                type={visible ? 'text' : 'password'}
                className={
                    'w-full rounded-md border border-gray-700 bg-gray-900 pr-10 text-gray-100 placeholder-gray-600 shadow-sm transition-colors duration-150 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none ' +
                    className
                }
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-red-400 focus:outline-none"
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
});
