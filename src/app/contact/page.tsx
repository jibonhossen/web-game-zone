'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Mail, MessageSquare, Phone, Send, Sparkles } from 'lucide-react';

export default function Contact() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    const contactCards = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Us",
            description: "For any general issues and support.",
            contact: "support@gamezonebd.space",
            link: "mailto:support@gamezonebd.space",
            gradient: "from-indigo-500 to-purple-600",
            bgGlow: "bg-indigo-500"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Telegram",
            description: "Join our Telegram channel.",
            contact: "t.me/gamezonebd",
            link: "https://t.me/gamezonebd",
            gradient: "from-cyan-500 to-blue-600",
            bgGlow: "bg-cyan-500"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "WhatsApp",
            description: "Chat with us on WhatsApp.",
            contact: "+880 1400-389396",
            link: "https://wa.me/8801400389396",
            gradient: "from-emerald-500 to-green-600",
            bgGlow: "bg-emerald-500"
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: "24/7 Support",
            description: "Live support available anytime.",
            contact: "+880 1400-389396",
            link: "tel:+8801400389396",
            gradient: "from-amber-500 to-orange-600",
            bgGlow: "bg-amber-500"
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark via-darker to-dark z-0" />
            <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full filter blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary rounded-full filter blur-[150px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-500 rounded-full filter blur-[150px] animate-pulse delay-500" />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-sm font-medium mb-6 border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-primary">Get in Touch</span>
                        </motion.span>

                        <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6">
                            Let's <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">Connect</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Have questions, feedback, or just want to say hello? We'd love to hear from you. Reach out through any of the channels below.
                        </p>
                    </motion.div>

                    {/* Contact Cards - Centered Grid */}
                    <motion.div
                        className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {contactCards.map((card, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <a href={card.link} target="_blank" rel="noopener noreferrer">
                                    <Card
                                        className="relative p-5 sm:p-6 group cursor-pointer overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full"
                                        glow
                                    >
                                        {/* Card Glow Effect */}
                                        <div className={`absolute -top-20 -right-20 w-40 h-40 ${card.bgGlow} rounded-full filter blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                                        <div className="relative flex items-start gap-4 sm:gap-5">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${card.gradient} p-[1px] shrink-0`}>
                                                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-dark/90 flex items-center justify-center text-white">
                                                    {card.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-heading font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                                                    {card.title}
                                                </h3>
                                                <p className="text-gray-500 text-xs sm:text-sm mb-2">
                                                    {card.description}
                                                </p>
                                                <span className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent break-all`}>
                                                    {card.contact}
                                                </span>
                                            </div>
                                            <div className="hidden sm:block self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center`}>
                                                    <Send className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bottom CTA */}
                    <motion.div
                        className="mt-20 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-gray-300">We typically respond within <span className="text-white font-semibold">1 hours</span></span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
