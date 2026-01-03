'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import blogApi from '@/lib/blogApi';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTimeRef = useRef<number>(Date.now());
    const hasTrackedRef = useRef<boolean>(false);

    useEffect(() => {
        // Reset state on path change
        startTimeRef.current = Date.now();
        hasTrackedRef.current = false;

        // Track page view
        const trackView = async () => {
            if (hasTrackedRef.current) return;

            // Generate or get session ID
            let sessionId = '';
            if (typeof window !== 'undefined') {
                sessionId = sessionStorage.getItem('blog_session_id') || '';
                if (!sessionId) {
                    sessionId = crypto.randomUUID();
                    sessionStorage.setItem('blog_session_id', sessionId);
                }
            }

            try {
                await blogApi.trackPageView({
                    page_path: pathname,
                    page_title: document.title,
                    referrer: document.referrer,
                    page_url: window.location.href,
                    session_id: sessionId,
                    is_bounce: true, // Initially assume bounce until interaction/time
                });
                hasTrackedRef.current = true;
            } catch (err) {
                console.error('Failed to track page view:', err);
            }
        };

        // Small delay to ensure title is updated
        const timeoutId = setTimeout(trackView, 500);

        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams]);

    return null;
}
