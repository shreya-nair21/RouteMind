import React, { useState } from 'react';
import { Button } from './Button.tsx';

interface NavLink {
    label: string;
    href: string;
}

interface NavbarProps {
    logo?: string;
    links?: NavLink[];
    ctaLabel?: string;
    onCTAClick?: () => void;
    transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
    logo = 'RouteMind',
    links = [
        { label: 'Destinations', href: '#destinations' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'AI Planner', href: '#ai-planner' },
        { label: 'Pricing', href: '#pricing' },
    ],
    ctaLabel = 'Start a Chat',
    onCTAClick = () => { },
    transparent = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={`px-6 md:px-12 lg:px-16 pt-6 ${transparent ? 'bg-transparent' : ''}`}>
            <div className={`${transparent ? '' : 'liquid-glass'} rounded-xl px-4 py-2 flex items-center justify-between`}>
                {/* Logo */}
                <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
                    <div className="w-2 h-2 rounded-full bg-white"/>
                    <span>{logo}</span>
                </div>

                {/* Center Links - Hidden on mobile */}
                <div className="hidden md:flex gap-8">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-white hover:text-gray-300 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <Button variant="primary" size="sm" onClick={onCTAClick}>
                    {ctaLabel}
                </Button>

                {/* Mobile Menu Toggle (for future implementation) */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu (for future implementation) */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-2">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="block text-white hover:text-gray-300 transition-colors py-2"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};