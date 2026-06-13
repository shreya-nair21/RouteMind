import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-medium rounded-lg transition-colors font-inter';

    const variants = {
        primary: 'bg-white text-black hover:bg-gray-100',
        secondary: 'border border-white/20 text-white hover:bg-white hover:text-black',
        glass: 'liquid-glass border border-white/20 text-white hover:bg-white hover:text-black',
    };

    const sizes = {
        sm: 'px-6 py-2 text-sm',
        md: 'px-8 py-3 text-base',
        lg: 'px-10 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};