import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, CheckCircle, Smartphone } from 'lucide-react';

export default function DownloadPage() {
    return (
        <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                        Download <span className="text-primary">Game Zone</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400">Get the app and start competing today.</p>
                </div>

                <Card glow className="p-6 sm:p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Mobile: Phone mockup first, Desktop: second */}
                        <div className="flex justify-center order-first md:order-last">
                            {/* Mockup Phone - Responsive sizing */}
                            <div className="relative w-48 h-[380px] sm:w-56 sm:h-[440px] md:w-64 md:h-[500px] border-[6px] sm:border-8 border-gray-800 rounded-[2.5rem] sm:rounded-[3rem] bg-dark overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-col gap-3 sm:gap-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                        <span className="font-heading font-bold text-3xl sm:text-4xl text-white">G</span>
                                    </div>
                                    <span className="font-heading font-bold text-lg sm:text-xl">Game Zone</span>
                                </div>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-6 bg-gray-800 rounded-b-xl"></div>
                            </div>
                        </div>

                        {/* Download info */}
                        <div className="space-y-6 sm:space-y-8">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Android Version</h3>
                                <p className="text-gray-400 text-sm">Latest Version 1.0.0 • Updated Dec 2025</p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    "Compete in Daily Tournaments",
                                    "Instant Withdrawals",
                                    "Secure & Fair Play",
                                    "24/7 Support"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                            <CheckCircle size={12} className="sm:hidden" />
                                            <CheckCircle size={14} className="hidden sm:block" />
                                        </div>
                                        <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <a href="https://gqmfdoapiuecboeyajih.supabase.co/storage/v1/object/public/game-zone/game-zone.apk">
                                <Button size="lg" className="w-full">
                                    <Download className="mr-2 w-5 h-5" /> Download APK
                                </Button>
                            </a>

                            <p className="text-center text-xs text-gray-500">Requires Android 5.0+</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
