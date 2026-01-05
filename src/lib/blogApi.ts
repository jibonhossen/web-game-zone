// Blog API client for game-zone-web

const API_BASE = process.env.NEXT_PUBLIC_BLOG_API_URL ;

class BlogApi {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('blog_token', token);
            } else {
                localStorage.removeItem('blog_token');
            }
        }
    }

    getToken(): string | null {
        if (this.token) return this.token;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('blog_token');
        }
        return this.token;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    // Auth
    async login(username: string, password: string) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async logout() {
        await this.request('/api/auth/logout', { method: 'POST' });
        this.setToken(null);
    }

    async getMe() {
        return this.request('/api/auth/me');
    }

    // Posts (Public)
    async getPosts(params?: { page?: number; limit?: number; category?: string; featured?: boolean; search?: string }) {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.category) searchParams.set('category', params.category);
        if (params?.featured) searchParams.set('featured', 'true');
        if (params?.search) searchParams.set('search', params.search);

        return this.request(`/api/posts?${searchParams.toString()}`);
    }

    async getPostBySlug(slug: string) {
        return this.request(`/api/posts/slug/${slug}`);
    }

    // Posts (Admin)
    async getAdminPosts(params?: { page?: number; limit?: number; status?: string }) {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.status) searchParams.set('status', params.status);

        return this.request(`/api/posts/admin/all?${searchParams.toString()}`);
    }

    async getAdminPost(id: number) {
        return this.request(`/api/posts/admin/${id}`);
    }

    async createPost(post: {
        title: string;
        excerpt: string;
        content: string;
        category?: string;
        icon?: string;
        cover_image?: string;
        author_name?: string;
        status?: 'draft' | 'published';
        featured?: boolean;
        tags?: string[];
    }) {
        return this.request('/api/posts', {
            method: 'POST',
            body: JSON.stringify(post),
        });
    }

    async updatePost(id: number, post: Partial<{
        title: string;
        excerpt: string;
        content: string;
        category: string;
        icon: string;
        cover_image: string;
        author_name: string;
        status: 'draft' | 'published' | 'archived';
        featured: boolean;
        tags: string[];
    }>) {
        return this.request(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(post),
        });
    }

    async deletePost(id: number) {
        return this.request(`/api/posts/${id}`, { method: 'DELETE' });
    }

    async getStats() {
        return this.request('/api/posts/admin/stats');
    }

    // Categories
    async getCategories() {
        return this.request('/api/categories');
    }

    async createCategory(category: { name: string; description?: string; color?: string; icon?: string }) {
        return this.request('/api/categories', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    }

    async deleteCategory(id: number) {
        return this.request(`/api/categories/${id}`, { method: 'DELETE' });
    }

    // Tags
    async getTags() {
        return this.request('/api/tags');
    }

    async createTag(name: string) {
        return this.request('/api/tags', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async deleteTag(id: number) {
        return this.request(`/api/tags/${id}`, { method: 'DELETE' });
    }

    // Analytics
    async trackPageView(data: {
        page_path: string;
        page_title?: string;
        post_id?: number;
        session_id?: string;
        referrer?: string;
        page_url?: string;
        time_on_page?: number;
        scroll_depth?: number;
        is_bounce?: boolean;
    }) {
        return this.request('/api/analytics/track', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAnalyticsOverview(days = 7) {
        return this.request(`/api/analytics/overview?days=${days}`);
    }

    async getAnalyticsPages(days = 7, limit = 10) {
        return this.request(`/api/analytics/pages?days=${days}&limit=${limit}`);
    }

    async getAnalyticsSources(days = 7) {
        return this.request(`/api/analytics/sources?days=${days}`);
    }

    async getAnalyticsGeo(days = 7) {
        return this.request(`/api/analytics/geo?days=${days}`);
    }

    async getAnalyticsDevices(days = 7) {
        return this.request(`/api/analytics/devices?days=${days}`);
    }

    async getAnalyticsLive(limit = 20) {
        return this.request(`/api/analytics/live?limit=${limit}`);
    }
}

export const blogApi = new BlogApi();
export default blogApi;

