'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark/80 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                            <Image
                                src="/logo.png"
                                alt="Game Zone Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-heading font-bold text-xl text-white">Game Zone</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                        <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
                        <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                    </div>

                    <Link
                        href="/download"
                        className="hidden md:flex px-5 py-2 bg-gradient-to-r from-primary to-secondary rounded-full font-medium hover:opacity-90 transition-opacity text-white"
                    >
                        Download Now
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark/95 border-t border-white/10"
                    >
                        <div className="px-4 py-4 space-y-3 flex flex-col">
                            <Link href="/about" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>About</Link>
                            <Link href="/blog" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Blog</Link>
                            <Link href="/contact" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Contact</Link>
                            <Link href="/download" className="block py-2 text-primary font-medium" onClick={() => setIsOpen(false)}>Download Now</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
