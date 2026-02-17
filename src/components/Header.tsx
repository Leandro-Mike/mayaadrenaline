"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotonCTA from './botonCTA';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for header background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/nosotros', label: 'Conocenos' },
        { href: '/excursiones', label: 'Experiencias' },
        { href: '/contacto', label: 'Hablemos' },
        { href: '/contacto', label: 'Otros servicios' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'
                } ${isMenuOpen ? 'bg-transparent' : (scrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent')
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">

                {/* Left Side: Logo + Desktop Navigation */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="relative z-50">
                        <img
                            className="w-32 md:w-40 lg:w-48 transition-all duration-300"
                            src={`https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/logo.svg`}
                            alt="Maya Adrenaline Logo"
                        />
                    </Link>

                    {/* Desktop Navigation Links (Next to Logo) */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href + link.label}
                                href={link.href}
                                className={`font-montserrat font-light text-sm lg:text-base transition-colors duration-300 ${pathname === link.href ? 'text-ma-amarillo' : 'text-white hover:text-ma-amarillo'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side: CTA + Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {/* Desktop CTA */}
                    <div className="hidden md:block">
                        <BotonCTA />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden relative z-50 p-2 text-white focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between">
                            <motion.span
                                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 9 : 0 }}
                                className="w-full h-0.5 bg-white block transition-transform origin-center"
                            />
                            <motion.span
                                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                                className="w-full h-0.5 bg-white block transition-opacity"
                            />
                            <motion.span
                                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -9 : 0 }}
                                className="w-full h-0.5 bg-white block transition-transform origin-center"
                            />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-[#011D18] z-40 flex flex-col items-center justify-center space-y-8 md:hidden h-screen w-screen"
                        >
                            <nav className="flex flex-col items-center space-y-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href + link.label}
                                        href={link.href}
                                        className="font-montserrat text-3xl font-light text-white hover:text-ma-amarillo transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-8 scale-125" onClick={() => setIsMenuOpen(false)}>
                                <BotonCTA />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </header>
    );
}
