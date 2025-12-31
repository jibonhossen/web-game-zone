import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-darker text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                            <Image
                                src="/logo.png"
                                alt="Game Zone Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-heading font-bold text-xl">Game Zone</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                        <Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Game Zone. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
