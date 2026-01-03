'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Edit3, Trash2, Plus, Eye, EyeOff, TrendingUp,
    LogOut, Save, X, Grid, List, Search, Filter,
    Calendar, Tag, Folder, Image, Bold, Italic, Send,
    Link as LinkIcon, Code, Quote, ListOrdered, Heading1,
    ChevronDown, Check, Loader2, AlertCircle, Sparkles,
    BarChart3, Globe, Monitor, Smartphone, Users, Activity, Clock, MapPin
} from 'lucide-react';
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
    status: 'draft' | 'published' | 'archived';
    views: number;
    featured: boolean;
    created_at: string;
    updated_at: string;
    published_at?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon: string;
    post_count: number;
}

interface Stats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalCategories: number;
}

type ViewMode = 'dashboard' | 'posts' | 'editor' | 'categories' | 'analytics';

export default function BlogAdmin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    // Login state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // View state
    const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [listView, setListView] = useState<'grid' | 'list'>('grid');

    // Editor state
    const [editorTitle, setEditorTitle] = useState('');
    const [editorExcerpt, setEditorExcerpt] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [editorCategory, setEditorCategory] = useState('General');
    const [editorIcon, setEditorIcon] = useState('📝');
    const [editorCoverImage, setEditorCoverImage] = useState('');
    const [editorTags, setEditorTags] = useState('');
    const [editorStatus, setEditorStatus] = useState<'draft' | 'published'>('draft');
    const [editorFeatured, setEditorFeatured] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Notifications
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Category creation state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#4F46E5');
    const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    // Analytics state
    const [analyticsData, setAnalyticsData] = useState<{
        overview: {
            totals: { pageViews: number; uniqueVisitors: number; sessions: number; avgTimeOnPage: number; bounceRate: number };
            today: { pageViews: number; uniqueVisitors: number };
            realtime: { activeUsers: number };
            dailyTrend: { date: string; page_views: number; unique_visitors: number }[];
        } | null;
        pages: { page_path: string; page_title: string; page_views: number; unique_visitors: number }[];
        sources: { referrers: { source: string; visits: number }[]; utmSources: { source: string; medium: string; visits: number }[] };
        geo: { countries: { country: string; country_code: string; visits: number }[]; cities: { city: string; country: string; visits: number }[] };
        devices: { devices: { device_type: string; visits: number }[]; browsers: { browser: string; visits: number }[]; operatingSystems: { os: string; visits: number }[] };
        live: { page_path: string; country: string; device_type: string; browser: string; created_at: string }[];
    }>({
        overview: null,
        pages: [],
        sources: { referrers: [], utmSources: [] },
        geo: { countries: [], cities: [] },
        devices: { devices: [], browsers: [], operatingSystems: [] },
        live: [],
    });
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsDays, setAnalyticsDays] = useState(7);

    const icons = ['📝', '🏆', '🎮', '🚀', '⭐', '📰', '💡', '🔥', '🎯', '🎨', '🎬', '🎵'];
    const categoryIcons = ['📁', '🏆', '🎮', '🚀', '⭐', '📰', '💡', '🔥', '🎯', '🎨', '🎬', '🎵', '💎', '🌟', '🎪', '🎭'];
    const colors = ['#4F46E5', '#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = blogApi.getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }
            const data = await blogApi.getMe();
            setUser(data.user);
            setIsAuthenticated(true);
            loadDashboardData();
        } catch {
            blogApi.setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        try {
            const data = await blogApi.login(loginUsername, loginPassword);
            setUser(data.user);
            setIsAuthenticated(true);
            loadDashboardData();
        } catch (err) {
            setLoginError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = async () => {
        await blogApi.logout();
        setIsAuthenticated(false);
        setUser(null);
        setViewMode('dashboard');
    };

    const loadDashboardData = async () => {
        try {
            const [statsData, postsData, categoriesData] = await Promise.all([
                blogApi.getStats(),
                blogApi.getAdminPosts({ limit: 50 }),
                blogApi.getCategories(),
            ]);
            setStats(statsData);
            setPosts(postsData.posts);
            setCategories(categoriesData.categories);
        } catch (err) {
            showNotification('error', 'Failed to load data');
            console.error(err);
        }
    };

    const loadAnalyticsData = async () => {
        setAnalyticsLoading(true);
        try {
            const [overview, pages, sources, geo, devices, live] = await Promise.all([
                blogApi.getAnalyticsOverview(analyticsDays),
                blogApi.getAnalyticsPages(analyticsDays, 10),
                blogApi.getAnalyticsSources(analyticsDays),
                blogApi.getAnalyticsGeo(analyticsDays),
                blogApi.getAnalyticsDevices(analyticsDays),
                blogApi.getAnalyticsLive(10),
            ]);
            setAnalyticsData({
                overview,
                pages: pages.pages || [],
                sources: sources || { referrers: [], utmSources: [] },
                geo: geo || { countries: [], cities: [] },
                devices: devices || { devices: [], browsers: [], operatingSystems: [] },
                live: live.visitors || [],
            });
        } catch (err) {
            console.error('Failed to load analytics:', err);
            showNotification('error', 'Failed to load analytics data');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // Load analytics when switching to analytics view
    useEffect(() => {
        if (viewMode === 'analytics' && isAuthenticated) {
            loadAnalyticsData();
        }
    }, [viewMode, analyticsDays, isAuthenticated]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const openEditor = (post?: Post) => {
        if (post) {
            setSelectedPost(post);
            setEditorTitle(post.title);
            setEditorExcerpt(post.excerpt);
            setEditorContent(post.content);
            setEditorCategory(post.category);
            setEditorIcon(post.icon);
            setEditorCoverImage(post.cover_image || '');
            setEditorStatus(post.status === 'published' ? 'published' : 'draft');
            setEditorFeatured(post.featured);
            setEditorTags('');
        } else {
            setSelectedPost(null);
            setEditorTitle('');
            setEditorExcerpt('');
            setEditorContent('');
            setEditorCategory('General');
            setEditorIcon('📝');
            setEditorCoverImage('');
            setEditorStatus('draft');
            setEditorFeatured(false);
            setEditorTags('');
        }
        setViewMode('editor');
    };

    const savePost = async () => {
        if (!editorTitle.trim() || !editorExcerpt.trim() || !editorContent.trim()) {
            showNotification('error', 'Please fill in title, excerpt, and content');
            return;
        }

        setIsSaving(true);
        setSaveMessage('');

        try {
            const postData = {
                title: editorTitle,
                excerpt: editorExcerpt,
                content: editorContent,
                category: editorCategory,
                icon: editorIcon,
                cover_image: editorCoverImage || undefined,
                status: editorStatus,
                featured: editorFeatured,
                tags: editorTags.split(',').map(t => t.trim()).filter(Boolean),
            };

            if (selectedPost) {
                await blogApi.updatePost(selectedPost.id, postData);
                showNotification('success', 'Post updated successfully!');
            } else {
                await blogApi.createPost(postData);
                showNotification('success', 'Post created successfully!');
            }

            loadDashboardData();
            setViewMode('posts');
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Failed to save post');
        } finally {
            setIsSaving(false);
        }
    };

    const deletePost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await blogApi.deletePost(id);
            showNotification('success', 'Post deleted successfully');
            loadDashboardData();
        } catch (err) {
            showNotification('error', 'Failed to delete post');
            console.error(err);
        }
    };

    const createCategory = async () => {
        if (!newCategoryName.trim()) {
            showNotification('error', 'Category name is required');
            return;
        }

        setIsCreatingCategory(true);
        try {
            await blogApi.createCategory({
                name: newCategoryName,
                description: newCategoryDescription,
                color: newCategoryColor,
                icon: newCategoryIcon,
            });
            showNotification('success', 'Category created successfully!');
            setShowCategoryModal(false);
            setNewCategoryName('');
            setNewCategoryDescription('');
            setNewCategoryColor('#4F46E5');
            setNewCategoryIcon('📁');
            loadDashboardData();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Failed to create category');
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category? Posts will be moved to "General".')) return;

        try {
            await blogApi.deleteCategory(id);
            showNotification('success', 'Category deleted successfully');
            loadDashboardData();
        } catch (err) {
            showNotification('error', 'Failed to delete category');
            console.error(err);
        }
    };

    const togglePostStatus = async (post: Post) => {
        const newStatus = post.status === 'published' ? 'draft' : 'published';
        try {
            await blogApi.updatePost(post.id, { status: newStatus });
            showNotification('success', newStatus === 'published' ? 'Post published!' : 'Post unpublished');
            loadDashboardData();
        } catch (err) {
            showNotification('error', 'Failed to update post status');
            console.error(err);
        }
    };

    const insertMarkdown = (syntax: string, wrap = false) => {
        const textarea = document.getElementById('editor-content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);

        let newText: string;
        if (wrap && selectedText) {
            newText = editorContent.substring(0, start) + syntax + selectedText + syntax + editorContent.substring(end);
        } else {
            newText = editorContent.substring(0, start) + syntax + editorContent.substring(end);
        }

        setEditorContent(newText);
    };

    // Helper to get flag emoji from country code
    const getFlagEmoji = (countryCode: string): string => {
        if (!countryCode || countryCode.length !== 2) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Loading screen
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading admin panel...</p>
                </motion.div>
            </div>
        );
    }

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md relative"
                >
                    <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl shadow-primary/10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold font-heading mb-2">Blog Admin</h1>
                            <p className="text-gray-400">Sign in to manage your blog</p>
                        </div>

                        <form onSubmit={login} className="space-y-6">
                            {loginError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                                >
                                    <AlertCircle size={18} />
                                    <span>{loginError}</span>
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-gray-500"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-gray-500"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Default: admin / admin123
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Main admin interface
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${notification.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/20 border border-red-500/30 text-red-400'
                            }`}
                    >
                        {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 z-40">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold font-heading">Blog Admin</h2>
                            <p className="text-xs text-gray-500">{user?.username}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', icon: Grid, label: 'Dashboard' },
                            { id: 'posts', icon: FileText, label: 'Posts' },
                            { id: 'categories', icon: Folder, label: 'Categories' },
                            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setViewMode(item.id as ViewMode)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${viewMode === item.id
                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 p-8">
                <AnimatePresence mode="wait">
                    {/* Dashboard View */}
                    {viewMode === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold font-heading mb-2">Dashboard</h1>
                                    <p className="text-gray-400">Welcome back, {user?.username}!</p>
                                </div>
                                <button
                                    onClick={() => openEditor()}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    <Plus size={20} />
                                    New Post
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[
                                    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'from-blue-500 to-cyan-500' },
                                    { label: 'Published', value: stats?.publishedPosts || 0, icon: Check, color: 'from-emerald-500 to-green-500' },
                                    { label: 'Drafts', value: stats?.draftPosts || 0, icon: Edit3, color: 'from-amber-500 to-orange-500' },
                                    { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'from-purple-500 to-pink-500' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass rounded-2xl p-6 border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <p className="text-3xl font-bold font-heading">{stat.value.toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Posts */}
                            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-white/10">
                                    <h3 className="text-xl font-bold font-heading">Recent Posts</h3>
                                </div>
                                <div className="divide-y divide-white/10">
                                    {posts.slice(0, 5).map((post) => (
                                        <div key={post.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{post.icon}</span>
                                                <div>
                                                    <h4 className="font-semibold hover:text-primary transition-colors cursor-pointer" onClick={() => openEditor(post)}>
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                            }`}>
                                                            {post.status}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye size={12} /> {post.views}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => togglePostStatus(post)}
                                                    title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                                                    className={`p-2 rounded-lg transition-all ${post.status === 'published'
                                                        ? 'hover:bg-amber-500/10 text-gray-400 hover:text-amber-400'
                                                        : 'hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400'
                                                        }`}
                                                >
                                                    {post.status === 'published' ? <EyeOff size={18} /> : <Send size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => openEditor(post)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Posts View */}
                    {viewMode === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold font-heading mb-2">All Posts</h1>
                                    <p className="text-gray-400">{posts.length} total posts</p>
                                </div>
                                <button
                                    onClick={() => openEditor()}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    <Plus size={20} />
                                    New Post
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="glass rounded-2xl p-4 border border-white/10 mb-6 flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                                    <button
                                        onClick={() => setListView('grid')}
                                        className={`p-2 rounded-lg transition-all ${listView === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setListView('list')}
                                        className={`p-2 rounded-lg transition-all ${listView === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Posts Grid/List */}
                            {listView === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPosts.map((post, i) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all"
                                        >
                                            <div className="h-32 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative">
                                                <span className="text-5xl group-hover:scale-110 transition-transform">{post.icon}</span>
                                                {post.featured && (
                                                    <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1">
                                                        <Sparkles size={12} /> Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{post.category}</span>
                                                </div>
                                                <h3 className="font-bold font-heading mb-2 line-clamp-2">{post.title}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Eye size={12} /> {post.views}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => togglePostStatus(post)}
                                                            title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                                                            className={`p-2 rounded-lg transition-all ${post.status === 'published'
                                                                ? 'hover:bg-amber-500/10 text-gray-400 hover:text-amber-400'
                                                                : 'hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400'
                                                                }`}
                                                        >
                                                            {post.status === 'published' ? <EyeOff size={16} /> : <Send size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => openEditor(post)}
                                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deletePost(post.id)}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="divide-y divide-white/10">
                                        {filteredPosts.map((post) => (
                                            <div key={post.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-3xl">{post.icon}</span>
                                                    <div>
                                                        <h4 className="font-semibold">{post.title}</h4>
                                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                                }`}>
                                                                {post.status}
                                                            </span>
                                                            <span>{post.category}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Eye size={12} /> {post.views}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => togglePostStatus(post)}
                                                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                                                        className={`p-2 rounded-lg transition-all ${post.status === 'published'
                                                            ? 'hover:bg-amber-500/10 text-gray-400 hover:text-amber-400'
                                                            : 'hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400'
                                                            }`}
                                                    >
                                                        {post.status === 'published' ? <EyeOff size={18} /> : <Send size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => openEditor(post)}
                                                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePost(post.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Editor View */}
                    {viewMode === 'editor' && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setViewMode('posts')}
                                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                    <div>
                                        <h1 className="text-3xl font-bold font-heading">
                                            {selectedPost ? 'Edit Post' : 'New Post'}
                                        </h1>
                                        <p className="text-gray-400">
                                            {selectedPost ? 'Update your article' : 'Create a new article'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setEditorStatus('draft'); savePost(); }}
                                        disabled={isSaving}
                                        className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        onClick={() => { setEditorStatus('published'); savePost(); }}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                        {selectedPost ? 'Update' : 'Publish'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {/* Main Editor */}
                                <div className="col-span-2 space-y-6">
                                    <div className="glass rounded-2xl p-6 border border-white/10">
                                        <input
                                            type="text"
                                            placeholder="Post title..."
                                            value={editorTitle}
                                            onChange={(e) => setEditorTitle(e.target.value)}
                                            className="w-full text-3xl font-bold font-heading bg-transparent border-none outline-none placeholder-gray-600 mb-4"
                                        />
                                        <textarea
                                            placeholder="Write a short excerpt..."
                                            value={editorExcerpt}
                                            onChange={(e) => setEditorExcerpt(e.target.value)}
                                            rows={2}
                                            className="w-full bg-transparent border-none outline-none placeholder-gray-600 text-gray-300 resize-none"
                                        />
                                    </div>

                                    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                                        {/* Toolbar */}
                                        <div className="p-3 border-b border-white/10 flex items-center gap-1 flex-wrap">
                                            {[
                                                { icon: Bold, action: () => insertMarkdown('**', true), title: 'Bold' },
                                                { icon: Italic, action: () => insertMarkdown('*', true), title: 'Italic' },
                                                { icon: Heading1, action: () => insertMarkdown('## '), title: 'Heading' },
                                                { icon: Quote, action: () => insertMarkdown('> '), title: 'Quote' },
                                                { icon: Code, action: () => insertMarkdown('`', true), title: 'Code' },
                                                { icon: LinkIcon, action: () => insertMarkdown('[text](url)'), title: 'Link' },
                                                { icon: ListOrdered, action: () => insertMarkdown('1. '), title: 'List' },
                                                { icon: Image, action: () => insertMarkdown('![alt](url)'), title: 'Image' },
                                            ].map((tool, i) => (
                                                <button
                                                    key={i}
                                                    onClick={tool.action}
                                                    title={tool.title}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                >
                                                    <tool.icon size={18} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            id="editor-content"
                                            placeholder="Write your content here... (Markdown supported)"
                                            value={editorContent}
                                            onChange={(e) => setEditorContent(e.target.value)}
                                            rows={20}
                                            className="w-full p-6 bg-transparent border-none outline-none placeholder-gray-600 resize-none font-mono text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Status & Options */}
                                    <div className="glass rounded-2xl p-6 border border-white/10">
                                        <h3 className="font-bold font-heading mb-4">Settings</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                                                <select
                                                    value={editorCategory}
                                                    onChange={(e) => setEditorCategory(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">Icon</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {icons.map((icon) => (
                                                        <button
                                                            key={icon}
                                                            onClick={() => setEditorIcon(icon)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${editorIcon === icon
                                                                ? 'bg-primary/20 border border-primary'
                                                                : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                                }`}
                                                        >
                                                            {icon}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">Cover Image URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    value={editorCoverImage}
                                                    onChange={(e) => setEditorCoverImage(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">Tags (comma separated)</label>
                                                <input
                                                    type="text"
                                                    placeholder="gaming, tips, news"
                                                    value={editorTags}
                                                    onChange={(e) => setEditorTags(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editorFeatured}
                                                    onChange={(e) => setEditorFeatured(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-all ${editorFeatured ? 'bg-primary' : 'bg-white/10'}`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform mt-0.5 ${editorFeatured ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'
                                                        }`} />
                                                </div>
                                                <span className="text-sm">Feature this post</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="glass rounded-2xl p-6 border border-white/10">
                                        <h3 className="font-bold font-heading mb-4">Preview</h3>
                                        <div className="bg-gradient-to-br from-primary/30 to-secondary/30 h-32 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-5xl">{editorIcon}</span>
                                        </div>
                                        <h4 className="font-bold font-heading line-clamp-2 mb-2">
                                            {editorTitle || 'Post Title'}
                                        </h4>
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {editorExcerpt || 'Post excerpt will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Categories View */}
                    {viewMode === 'categories' && (
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold font-heading mb-2">Categories</h1>
                                    <p className="text-gray-400">{categories.length} categories</p>
                                </div>
                                <button
                                    onClick={() => setShowCategoryModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    <Plus size={20} />
                                    New Category
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((category, i) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass rounded-2xl p-6 border border-white/10 group hover:border-primary/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                                    style={{ backgroundColor: `${category.color}20` }}
                                                >
                                                    {category.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold font-heading">{category.name}</h3>
                                                    <p className="text-sm text-gray-400">{category.post_count} posts</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div
                                            className="h-1 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Analytics View */}
                    {viewMode === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold font-heading mb-2">Analytics</h1>
                                    <p className="text-gray-400">Visitor insights and traffic data</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={analyticsDays}
                                        onChange={(e) => setAnalyticsDays(parseInt(e.target.value))}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={7}>Last 7 days</option>
                                        <option value={14}>Last 14 days</option>
                                        <option value={30}>Last 30 days</option>
                                        <option value={90}>Last 90 days</option>
                                    </select>
                                    <button
                                        onClick={loadAnalyticsData}
                                        disabled={analyticsLoading}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                                    >
                                        {analyticsLoading ? <Loader2 size={20} className="animate-spin" /> : <Activity size={20} />}
                                    </button>
                                </div>
                            </div>

                            {analyticsLoading && !analyticsData.overview ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Real-time & Today Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {/* Real-time */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-sm text-gray-400">Live</span>
                                            </div>
                                            <p className="text-3xl font-bold font-heading text-emerald-400">
                                                {analyticsData.overview?.realtime.activeUsers || 0}
                                            </p>
                                            <p className="text-sm text-gray-500">Active users (30m)</p>
                                        </motion.div>

                                        {/* Today's views */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye size={16} className="text-blue-400" />
                                                <span className="text-sm text-gray-400">Today</span>
                                            </div>
                                            <p className="text-3xl font-bold font-heading">
                                                {analyticsData.overview?.today.pageViews || 0}
                                            </p>
                                            <p className="text-sm text-gray-500">Page views</p>
                                        </motion.div>

                                        {/* Total page views */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp size={16} className="text-purple-400" />
                                                <span className="text-sm text-gray-400">{analyticsDays}d Total</span>
                                            </div>
                                            <p className="text-3xl font-bold font-heading">
                                                {(analyticsData.overview?.totals.pageViews || 0).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">Page views</p>
                                        </motion.div>

                                        {/* Unique visitors */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users size={16} className="text-amber-400" />
                                                <span className="text-sm text-gray-400">Visitors</span>
                                            </div>
                                            <p className="text-3xl font-bold font-heading">
                                                {(analyticsData.overview?.totals.uniqueVisitors || 0).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">Unique visitors</p>
                                        </motion.div>

                                        {/* Bounce rate */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity size={16} className="text-red-400" />
                                                <span className="text-sm text-gray-400">Bounce</span>
                                            </div>
                                            <p className="text-3xl font-bold font-heading">
                                                {analyticsData.overview?.totals.bounceRate || 0}%
                                            </p>
                                            <p className="text-sm text-gray-500">Bounce rate</p>
                                        </motion.div>
                                    </div>

                                    {/* Daily Trend Chart */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="glass rounded-2xl p-6 border border-white/10"
                                    >
                                        <h3 className="text-lg font-bold font-heading mb-4">Daily Traffic</h3>
                                        <div className="h-48 flex items-end gap-1">
                                            {(analyticsData.overview?.dailyTrend || []).length > 0 ? (
                                                analyticsData.overview?.dailyTrend.map((day, i) => {
                                                    const maxViews = Math.max(...(analyticsData.overview?.dailyTrend.map(d => d.page_views) || [1]));
                                                    const height = maxViews > 0 ? (day.page_views / maxViews * 100) : 0;
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                            <div
                                                                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                                                                style={{ height: `${Math.max(height, 2)}%` }}
                                                                title={`${day.page_views} views`}
                                                            />
                                                            <span className="text-[10px] text-gray-500">
                                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                                    No data available
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Grid: Devices, Countries, Pages */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Devices */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                                                <Monitor size={18} /> Devices
                                            </h3>
                                            <div className="space-y-3">
                                                {(analyticsData.devices?.devices || []).length > 0 ? (
                                                    analyticsData.devices.devices.map((device, i) => {
                                                        const total = analyticsData.devices.devices.reduce((a, b) => a + b.visits, 0);
                                                        const percentage = total > 0 ? Math.round((device.visits / total) * 100) : 0;
                                                        return (
                                                            <div key={i} className="space-y-1">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="flex items-center gap-2">
                                                                        {device.device_type === 'mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                                                        {device.device_type}
                                                                    </span>
                                                                    <span className="text-gray-400">{percentage}%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                                        style={{ width: `${percentage}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No device data</p>
                                                )}
                                            </div>

                                            <h4 className="text-sm font-semibold mt-6 mb-3 text-gray-400">Top Browsers</h4>
                                            <div className="space-y-2">
                                                {(analyticsData.devices?.browsers || []).slice(0, 4).map((browser, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span>{browser.browser}</span>
                                                        <span className="text-gray-400">{browser.visits}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Countries */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                                                <Globe size={18} /> Countries
                                            </h3>
                                            <div className="space-y-3">
                                                {(analyticsData.geo?.countries || []).slice(0, 8).map((country, i) => {
                                                    const total = (analyticsData.geo?.countries || []).reduce((a, b) => a + b.visits, 0);
                                                    const percentage = total > 0 ? Math.round((country.visits / total) * 100) : 0;
                                                    return (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <span className="text-lg">{getFlagEmoji(country.country_code)}</span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between text-sm mb-1">
                                                                    <span>{country.country}</span>
                                                                    <span className="text-gray-400">{country.visits}</span>
                                                                </div>
                                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-emerald-500 rounded-full"
                                                                        style={{ width: `${percentage}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {(analyticsData.geo?.countries || []).length === 0 && (
                                                    <p className="text-gray-500 text-sm">No location data</p>
                                                )}
                                            </div>
                                        </motion.div>

                                        {/* Top Pages */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                                                <FileText size={18} /> Top Pages
                                            </h3>
                                            <div className="space-y-3">
                                                {(analyticsData.pages || []).slice(0, 8).map((page, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span className="truncate flex-1 mr-2" title={page.page_path}>
                                                            {page.page_title || page.page_path}
                                                        </span>
                                                        <span className="text-gray-400 flex items-center gap-1">
                                                            <Eye size={12} /> {page.page_views}
                                                        </span>
                                                    </div>
                                                ))}
                                                {(analyticsData.pages || []).length === 0 && (
                                                    <p className="text-gray-500 text-sm">No page data</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Traffic Sources & Live Feed */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Traffic Sources */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.45 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                                                <LinkIcon size={18} /> Traffic Sources
                                            </h3>
                                            <div className="space-y-3">
                                                {(analyticsData.sources?.referrers || []).slice(0, 8).map((ref, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span className="truncate flex-1 mr-2">
                                                            {ref.source === 'Direct' ? '🏠 Direct' : `🔗 ${ref.source}`}
                                                        </span>
                                                        <span className="text-gray-400">{ref.visits}</span>
                                                    </div>
                                                ))}
                                                {(analyticsData.sources?.referrers || []).length === 0 && (
                                                    <p className="text-gray-500 text-sm">No referrer data</p>
                                                )}
                                            </div>
                                        </motion.div>

                                        {/* Live Feed */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="glass rounded-2xl p-6 border border-white/10"
                                        >
                                            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                                                <Activity size={18} /> Recent Visitors
                                            </h3>
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {(analyticsData.live || []).map((visitor, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/5">
                                                        <span className="text-lg">{getFlagEmoji(visitor.country)}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-gray-300">{visitor.page_path}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {visitor.device_type} • {visitor.browser}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {new Date(visitor.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                ))}
                                                {(analyticsData.live || []).length === 0 && (
                                                    <p className="text-gray-500 text-sm text-center py-4">No recent visitors</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Category Creation Modal */}
            <AnimatePresence>
                {showCategoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        onClick={() => setShowCategoryModal(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold font-heading">New Category</h2>
                                <button
                                    onClick={() => setShowCategoryModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Category name"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Optional description"
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryIcons.map((icon) => (
                                            <button
                                                key={icon}
                                                onClick={() => setNewCategoryIcon(icon)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${newCategoryIcon === icon
                                                    ? 'bg-primary/20 border border-primary'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewCategoryColor(color)}
                                                className={`w-10 h-10 rounded-xl transition-all ${newCategoryColor === color
                                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                                                    : ''
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-xs text-gray-500 mb-3">Preview</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                            style={{ backgroundColor: `${newCategoryColor}30` }}
                                        >
                                            {newCategoryIcon}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{newCategoryName || 'Category Name'}</p>
                                            <div className="h-1 w-20 rounded-full mt-1" style={{ backgroundColor: newCategoryColor }} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={createCategory}
                                    disabled={isCreatingCategory || !newCategoryName.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCreatingCategory ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            Create Category
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
