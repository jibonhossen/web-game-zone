import { Card } from '@/components/ui/Card';
import { Users, Shield } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                        About <span className="text-primary">Game Zone</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We are building the future of mobile gaming tournaments. Our mission is to create a fair, competitive, and rewarding platform for gamers worldwide.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-20">
                    {[
                        // { label: "Active Players", value: "50K+" },
                        { label: "Tournaments", value: "100+" },
                        { label: "Prize Pool", value: "5K+" },
                        // { label: "Countries", value: "20+" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4 sm:p-6 text-center bg-white/5">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1 sm:mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 sm:mb-20">
                    {/* Mobile: Image first, Desktop: Text first */}
                    <div className="order-last md:order-first space-y-4 sm:space-y-6 text-gray-300">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">Our Story</h2>
                        <p className="text-sm sm:text-base leading-relaxed">
                            Started in 2025, Game Zone emerged from a simple idea: Mobile gamers deserve a professional competitive platform. We saw the gap between casual play and professional esports, and we built Game Zone to bridge it.
                        </p>
                        <p className="text-sm sm:text-base leading-relaxed">
                            Today, we host daily tournaments across multiple game titles, providing a seamless experience with automated matchmaking and instant rewards.
                        </p>
                    </div>
                    <div className="relative h-52 sm:h-64 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                        <div className="text-6xl sm:text-7xl md:text-9xl">🚀</div>
                    </div>
                </div>

                {/* Values */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    <Card className="p-5 sm:p-6 md:p-8">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3 sm:mb-4 text-primary">
                            <Users size={20} className="sm:hidden" />
                            <Users size={24} className="hidden sm:block" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Community First</h3>
                        <p className="text-gray-400 text-sm sm:text-base">We listen to our players. Every feature we build is driven by community feedback and needs.</p>
                    </Card>
                    <Card className="p-5 sm:p-6 md:p-8">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-3 sm:mb-4 text-secondary">
                            <Shield size={20} className="sm:hidden" />
                            <Shield size={24} className="hidden sm:block" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Fair Play</h3>
                        <p className="text-gray-400 text-sm sm:text-base">Integrity is everything. We invest heavily in anti-cheat technology to ensure a level playing field.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
