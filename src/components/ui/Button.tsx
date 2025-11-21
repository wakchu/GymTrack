import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'fab';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-primary text-background-dark hover:bg-opacity-90 shadow-lg shadow-primary/30',
        secondary: 'bg-[#222222] text-white hover:bg-[#2a2a2a]',
        ghost: 'bg-transparent text-[#E0E0E0] hover:bg-white/5',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
        fab: 'bg-primary text-background-dark rounded-full shadow-lg shadow-primary/30',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 py-2 text-base rounded-lg',
        lg: 'h-14 px-6 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-full p-0',
    };

    // Override for FAB size
    if (variant === 'fab') {
        className += ' h-16 w-16';
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${variant !== 'fab' ? sizes[size] : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
        </button>
    );
};
