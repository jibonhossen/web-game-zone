'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary font-medium uppercase tracking-wider">Get in Touch</span>
                    <h1 className="font-heading text-5xl font-bold mt-2 mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you! Fill out the form below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                <Mail />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                <p className="text-gray-400 text-sm mb-2">For general inquiries and support.</p>
                                <a href="mailto:support@gamezone.app" className="text-white hover:text-primary transition-colors">support@gamezone.app</a>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0 text-secondary">
                                <MessageSquare />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Community</h3>
                                <p className="text-gray-400 text-sm mb-2">Join our Discord server.</p>
                                <a href="#" className="text-white hover:text-primary transition-colors">discord.gg/gamezone</a>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                                <Phone />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Support</h3>
                                <p className="text-gray-400 text-sm mb-2">24/7 Live Support available.</p>
                                <span className="text-white">In-App Chat</span>
                            </div>
                        </Card>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-white"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-white"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-white resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <Button className="w-full">Send Message</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
