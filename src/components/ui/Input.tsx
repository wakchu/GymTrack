import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <label className="flex flex-col w-full gap-2">
            {label && <span className="text-base font-medium text-[#E0E0E0]">{label}</span>}
            <input
                className={`
          flex w-full rounded-lg border border-[#222222] bg-[#222222] 
          px-4 h-14 text-base text-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
                {...props}
            />
        </label>
    );
};
