'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Calendar, User, Eye, Search, Filter, Loader2, Sparkles } from 'lucide-react';
import blogApi from '@/lib/blogApi';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    icon: string;
    cover_image?: string;
    author_name: string;
    views: number;
    featured: boolean;
    published_at: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon: string;
    post_count: number;
}

const categoryColors: Record<string, string> = {
    'Tournament': 'from-amber-500/30 to-orange-500/30',
    'Tips & Tricks': 'from-orange-500/30 to-red-500/30',
    'Update': 'from-green-500/30 to-emerald-500/30',
    'Community': 'from-blue-500/30 to-indigo-500/30',
    'News': 'from-purple-500/30 to-pink-500/30',
    'General': 'from-primary/30 to-secondary/30',
};

export default function Blog() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [selectedCategory, searchQuery]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [postsData, categoriesData] = await Promise.all([
                blogApi.getPosts({
                    category: selectedCategory || undefined,
                    search: searchQuery || undefined,
                    limit: 20
                }),
                blogApi.getCategories()
            ]);
            setPosts(postsData.posts);
            setCategories(categoriesData.categories);
        } catch (err) {
            console.error('Failed to load posts:', err);
            setError('Failed to load blog posts');
            // Fallback to sample data
            setPosts([
                {
                    id: 1,
                    title: "Season 1 Championship Finals Announced!",
                    slug: "season-1-championship-finals",
                    excerpt: "The biggest tournament of the year is here. Compete for massive prizes and glory! Registration opens next week.",
                    category: "Tournament",
                    icon: "🏆",
                    author_name: "Game Zone Team",
                    views: 1250,
                    featured: true,
                    published_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Pro Tips: Master Battle Royale Mode",
                    slug: "pro-tips-battle-royale",
                    excerpt: "Learn the strategies pro players use to dominate in Battle Royale matches. Map knowledge, loadout optimization, and more.",
                    category: "Tips & Tricks",
                    icon: "🎮",
                    author_name: "Alex 'ProGamer'",
                    views: 890,
                    featured: false,
                    published_at: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Version 1.0 is Here: What's New",
                    slug: "version-1-0-whats-new",
                    excerpt: "Discover all the exciting new features and improvements in our latest update. Enhanced performance, new maps, and skins.",
                    category: "Update",
                    icon: "🚀",
                    author_name: "Dev Team",
                    views: 2100,
                    featured: false,
                    published_at: new Date().toISOString()
                },
                {
                    id: 4,
                    title: "Community Spotlight: Team Alpha",
                    slug: "community-spotlight-team-alpha",
                    excerpt: "Meet the team that has dominated the weekly ladders for three consecutive months. Their journey to the top.",
                    category: "Community",
                    icon: "⭐",
                    author_name: "Sarah J.",
                    views: 650,
                    featured: false,
                    published_at: new Date().toISOString()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const featuredPosts = posts.filter(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
                        Our <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest gaming news, tips, and tournament announcements.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4"
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${!selectedCategory
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.name
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                )}

                {/* Featured Posts */}
                {!isLoading && featuredPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <h2 className="text-xl font-bold font-heading">Featured</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {featuredPosts.map((post, i) => (
                                <Link href={`/blog/post?slug=${post.slug}`} key={post.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="glass rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-primary/50 transition-all h-full"
                                    >
                                        <div className={`h-48 bg-gradient-to-br ${categoryColors[post.category] || categoryColors['General']} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                            <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{post.icon}</span>
                                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1 backdrop-blur-sm">
                                                    <Sparkles size={12} /> Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                    {post.category}
                                                </span>
                                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} /> {post.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} /> {formatDate(post.published_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <h2 className="font-heading text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-400 mb-4 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <User size={14} /> {post.author_name}
                                                </div>
                                                <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                    Read Article →
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Regular Posts */}
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {featuredPosts.length > 0 && regularPosts.length > 0 && (
                            <h2 className="text-xl font-bold font-heading mb-6">Latest Articles</h2>
                        )}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regularPosts.map((post, i) => (
                                <Link href={`/blog/post?slug=${post.slug}`} key={post.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="glass rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-primary/50 transition-all h-full flex flex-col"
                                    >
                                        <div className={`h-40 bg-gradient-to-br ${categoryColors[post.category] || categoryColors['General']} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{post.icon}</span>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                    {post.category}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-500 text-xs">
                                                    <Eye size={12} /> {post.views}
                                                </span>
                                            </div>
                                            <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Calendar size={12} /> {formatDate(post.published_at)}
                                                </div>
                                                <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                    Read →
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && posts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-2">No posts found</h3>
                        <p className="text-gray-400">
                            {searchQuery || selectedCategory
                                ? 'Try adjusting your search or filter'
                                : 'Check back later for new content!'}
                        </p>
                    </motion.div>
                )}
                
            </div>
        </div>
    );
}
