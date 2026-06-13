import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
}

const FadeIn = ({ children, delay = 0, duration = 1000 }: FadeInProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}ms`,
            }}
            className="transition-opacity"
        >
            {children}
        </div>
    );
};

interface AnimatedHeadingProps {
    text: string;
    delay?: number;
    charDelay?: number;
    className?: string;
}

const AnimatedHeading = ({
    text,
    delay = 200,
    charDelay = 30,
    className = "text-center text-white",
}: AnimatedHeadingProps) => {
    const [animatedChars, setAnimatedChars] = useState<boolean[]>([]);

    useEffect(() => {
        setAnimatedChars(new Array(text.length).fill(false));

        const lines = text.split('\n');
        let currentGlobalIndex = 0;

        lines.forEach((line, lineIndex) => {
            line.split('').forEach((_, charIndexInLine) => {
                const totalDelay = delay + (lineIndex * line.length * charDelay) + (charIndexInLine * charDelay);
                const targetIndex = currentGlobalIndex;
                setTimeout(() => {
                    setAnimatedChars((prev) => {
                        const updated = [...prev];
                        updated[targetIndex] = true;
                        return updated;
                    });
                }, totalDelay);
                currentGlobalIndex++;
            });
            currentGlobalIndex++; // adjust for the newline char split out
        });
    }, [text, delay, charDelay]);

    return (
        <h1
            style={{
                fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
                letterSpacing: '-0.04em',
            }}
            className={`font-bold mb-4 leading-none ${className}`}
        >
            {text.split('\n').map((line, lineIndex) => (
                <span key={lineIndex}>
                    {line.split('').map((char, charIdx) => {
                        let globalCharIdx = 0;
                        for (let i = 0; i < lineIndex; i++) {
                            globalCharIdx += text.split('\n')[i].length + 1;
                        }
                        globalCharIdx += charIdx;

                        const isAnimated = animatedChars[globalCharIdx];
                        return (
                            <span
                                key={`${lineIndex}-${charIdx}`}
                                style={{
                                    opacity: isAnimated ? 1 : 0,
                                    transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
                                    transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                                    display: 'inline-block',
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        );
                    })}
                    {lineIndex < text.split('\n').length - 1 && <br />}
                </span>
            ))}
        </h1>
    );
};

export const Hero = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    return (
        <div className="w-full h-screen relative bg-black overflow-hidden">
            {/* Video Background */}
            <video
                className="absolute inset-0 w-full h-full object-cover scale-105"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
                    type="video/mp4"
                />
            </video>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {/* Navbar */}
                <nav className="px-6 md:px-12 lg:px-16 pt-6">
                    <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <span>RouteMind</span>
                        </div>

                        {/* Center Links - Hidden on mobile */}
                        <div className="hidden md:flex gap-8">
                            {[
                                { label: 'Destinations', href: '#destinations' },
                                { label: 'How It Works', href: '#how-it-works' },
                                { label: 'AI Planner', href: '#ai-planner' },
                                { label: 'Pricing', href: '#pricing' },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Sign In'}
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="flex-1 flex flex-col justify-start items-end px-6 md:px-12 lg:px-16 pt-16 md:pt-24 lg:pt-32 pb-12 lg:pb-16 text-right">
                    <div className="flex flex-col items-end text-right max-w-2xl">
                        {/* Title Heading */}
                        <FadeIn delay={200} duration={1000}>
                            <h1
                                style={{
                                    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                                    letterSpacing: '-0.05em',
                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
                                }}
                                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-zinc-400 mb-4 leading-none tracking-tighter"
                            >
                                RouteMind
                            </h1>
                        </FadeIn>

                        {/* Animated Tagline */}
                        <FadeIn delay={600} duration={800}>
                            <p 
                                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                                className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/95 mb-4"
                            >
                                The Ultimate AI Travel Concierge
                            </p>
                        </FadeIn>

                        {/* Subheading */}
                        <FadeIn delay={1000} duration={1000}>
                            <p 
                                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                                className="text-base md:text-lg text-white/90 max-w-xl font-light leading-relaxed"
                            >
                                Bespoke itineraries, luxury recommendations, and seamless routes designed instantly for your lifestyle.
                            </p>
                        </FadeIn>
                    </div>
                </div>

                {/* Absolute Bottom Right Buttons */}
                <div className="absolute bottom-12 lg:bottom-16 right-6 md:right-12 lg:right-16 z-20">
                    <FadeIn delay={1400} duration={1000}>
                        <div className="flex flex-wrap justify-end gap-4">
                            <button
                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                                className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Initialize Plan'}
                            </button>
                            <button
                                onClick={() => {
                                    const element = document.getElementById('destinations');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
                            >
                                Explore Now
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default Hero;