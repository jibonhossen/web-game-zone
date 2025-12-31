import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}

export function Card({ className, glow = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-md',
                glow && 'hover:border-primary/50 transition-colors duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
