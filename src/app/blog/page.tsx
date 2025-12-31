import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

export default function Blog() {
    const posts = [
        {
            title: "Season 1 Championship Finals Announced!",
            excerpt: "The biggest tournament of the year is here. Compete for massive prizes and glory! Registration opens next week.",
            category: "Tournament",
            date: "Dec 20, 2024",
            author: "Game Zone Team",
            color: "from-primary/30 to-secondary/30",
            icon: "🏆"
        },
        {
            title: "Pro Tips: Master Battle Royale Mode",
            excerpt: "Learn the strategies pro players use to dominate in Battle Royale matches. Map knowledge, loadout optimization, and more.",
            category: "Tips & Tricks",
            date: "Dec 18, 2024",
            author: "Alex 'ProGamer'",
            color: "from-orange-500/30 to-red-500/30",
            icon: "🎮"
        },
        {
            title: "Version 1.0 is Here: What's New",
            excerpt: "Discover all the exciting new features and improvements in our latest update. Enhanced performance, new maps, and skins.",
            category: "Update",
            date: "Dec 15, 2024",
            author: "Dev Team",
            color: "from-green-500/30 to-emerald-500/30",
            icon: "🚀"
        },
        {
            title: "Community Spotlight: Team Alpha",
            excerpt: "Meet the team that has dominated the weekly ladders for three consecutive months. Their journey to the top.",
            category: "Community",
            date: "Dec 10, 2024",
            author: "Sarah J.",
            color: "from-blue-500/30 to-indigo-500/30",
            icon: "⭐"
        }
    ];

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="font-heading text-5xl font-bold mb-6">Our <span className="text-primary">Blog</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest gaming news, tips, and tournament announcements.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {posts.map((post, i) => (
                        <Card key={i} glow className="overflow-hidden group cursor-pointer h-full flex flex-col">
                            <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{post.icon}</span>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {post.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar size={14} /> {post.date}
                                    </div>
                                </div>
                                <h2 className="font-heading text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-400 mb-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <User size={14} /> {post.author}
                                    </div>
                                    <span className="text-primary font-medium text-sm hover:underline">Read Article →</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
