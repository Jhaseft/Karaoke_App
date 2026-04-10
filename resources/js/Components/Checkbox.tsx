import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-600 bg-gray-800 text-red-600 shadow-sm focus:ring-red-500 focus:ring-offset-black ' +
                className
            }
        />
    );
}
