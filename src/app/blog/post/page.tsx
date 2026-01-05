'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Loader2, Share2, Tag, Clock, BookOpen } from 'lucide-react';
import blogApi from '@/lib/blogApi';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    icon: string;
    cover_image?: string;
    author_name: string;
    views: number;
    featured: boolean;
    created_at: string;
    published_at: string;
}

interface TagItem {
    id: number;
    name: string;
    slug: string;
}

const categoryColors: Record<string, string> = {
    'Tournament': 'from-amber-500/30 to-orange-500/30',
    'Tips & Tricks': 'from-orange-500/30 to-red-500/30',
    'Update': 'from-green-500/30 to-emerald-500/30',
    'Community': 'from-blue-500/30 to-indigo-500/30',
    'News': 'from-purple-500/30 to-pink-500/30',
    'General': 'from-primary/30 to-secondary/30',
};

function BlogPostContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');

    const [post, setPost] = useState<Post | null>(null);
    const [tags, setTags] = useState<TagItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            loadPost();
        } else {
            setError('No post specified');
            setIsLoading(false);
        }
    }, [slug]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            const data = await blogApi.getPostBySlug(slug!);
            setPost(data.post);
            setTags(data.tags || []);
        } catch (err) {
            console.error('Failed to load post:', err);
            setError('Post not found');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const estimateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const sharePost = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post?.title,
                    text: post?.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Simple markdown to HTML converter
    const renderContent = (content: string) => {
        let html = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold font-heading mt-8 mb-4 text-white">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold font-heading mt-10 mb-4 text-white">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold font-heading mt-10 mb-6 text-white">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/30 rounded-xl p-4 my-4 overflow-x-auto border border-white/10"><code class="text-sm font-mono text-emerald-400">$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-2 py-0.5 rounded text-primary text-sm font-mono">$1</code>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic text-gray-300 bg-white/5 rounded-r-lg">$1</blockquote>')
            // Unordered lists
            .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
            // Ordered lists
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>')
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-6 w-full" />')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="border-white/10 my-8" />')
            // Paragraphs (double newlines)
            .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-300">')
            // Line breaks
            .replace(/\n/g, '<br />');

        // Wrap content in paragraph
        html = '<p class="mb-4 leading-relaxed text-gray-300">' + html + '</p>';

        return html;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold font-heading mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-8">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:opacity-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
            </div>

            {/* Hero */}
            <div className={`w-full h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px] bg-gradient-to-br ${categoryColors[post.category] || categoryColors['General']} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[80px] sm:text-[120px] md:text-[200px] opacity-50"
                    >
                        {post.icon}
                    </motion.span>
                </div>

                {/* Back button */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-lg sm:rounded-xl text-sm sm:text-base text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} className="sm:hidden" />
                        <ArrowLeft size={18} className="hidden sm:block" />
                        <span className="hidden sm:inline">Back to Blog</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-32 relative z-10 pb-12 sm:pb-20">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-white/10"
                >
                    {/* Category & Meta */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full w-fit">
                            {post.category}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={12} className="sm:hidden" />
                                <Calendar size={14} className="hidden sm:block" />
                                {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={12} className="sm:hidden" />
                                <Clock size={14} className="hidden sm:block" />
                                {estimateReadTime(post.content)} min
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye size={12} className="sm:hidden" />
                                <Eye size={14} className="hidden sm:block" />
                                {post.views}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Author & Share */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-6 border-y border-white/10 mb-6 sm:mb-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                                {post.author_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm sm:text-base">{post.author_name}</p>
                                <p className="text-xs sm:text-sm text-gray-400">Author</p>
                            </div>
                        </div>
                        <button
                            onClick={sharePost}
                            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all text-gray-400 hover:text-white text-sm sm:text-base"
                        >
                            <Share2 size={16} className="sm:hidden" />
                            <Share2 size={18} className="hidden sm:block" />
                            Share
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
                    />

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag size={16} className="text-gray-400" />
                                {tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.article>

                {/* Back to Blog */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <BookOpen size={18} />
                        More articles
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default function BlogPostPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        }>
            <BlogPostContent />
        </Suspense>
    );
}
