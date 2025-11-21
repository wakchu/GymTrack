import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-[#1E1E1E] p-4 rounded-xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
