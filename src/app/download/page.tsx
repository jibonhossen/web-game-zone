import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, CheckCircle, Smartphone } from 'lucide-react';

export default function DownloadPage() {
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl sm:text-6xl font-bold mb-6">Download <span className="text-primary">Game Zone</span></h1>
                    <p className="text-xl text-gray-400">Get the app and start competing today.</p>
                </div>

                <Card glow className="p-8 sm:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Android Version</h3>
                                <p className="text-gray-400 text-sm">Latest Version 1.0.0 • Updated Dec 2025</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    "Compete in Daily Tournaments",
                                    "Instant Withdrawals",
                                    "Secure & Fair Play",
                                    "24/7 Support"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <a href="https://gqmfdoapiuecboeyajih.supabase.co/storage/v1/object/public/game-zone/game-zone-v1.0.3.apk">
                                <Button size="lg" className="w-full">
                                    <Download className="mr-2" /> Download APK
                                </Button>
                            </a>

                            <p className="text-center text-xs text-gray-500">Requires Android 5.0+</p>
                        </div>

                        <div className="flex justify-center">
                            {/* Mockup Phone */}
                            <div className="relative w-64 h-[500px] border-8 border-gray-800 rounded-[3rem] bg-dark overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-col gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                        <span className="font-heading font-bold text-4xl text-white">G</span>
                                    </div>
                                    <span className="font-heading font-bold text-xl">Game Zone</span>
                                </div>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
