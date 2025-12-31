import { Card } from '@/components/ui/Card';
import { Users, Globe, Award, Shield } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="font-heading text-5xl font-bold mb-6">About <span className="text-primary">Game Zone</span></h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We are building the future of mobile gaming tournaments. Our mission is to create a fair, competitive, and rewarding platform for gamers worldwide.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {[
                        { label: "Active Players", value: "50K+" },
                        { label: "Tournaments", value: "1000+" },
                        { label: "Prize Pool", value: "$500K+" },
                        { label: "Countries", value: "20+" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 text-center bg-white/5">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6 text-gray-300">
                        <h2 className="font-heading text-3xl font-bold text-white">Our Story</h2>
                        <p>
                            Started in 2024, Game Zone emerged from a simple idea: Mobile gamers deserve a professional competitive platform. We saw the gap between casual play and professional esports, and we built Game Zone to bridge it.
                        </p>
                        <p>
                            Today, we host daily tournaments across multiple game titles, providing a seamless experience with automated matchmaking and instant rewards.
                        </p>
                    </div>
                    <div className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                        <div className="text-9xl">🚀</div>
                    </div>
                </div>

                {/* Values */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-8">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Community First</h3>
                        <p className="text-gray-400">We listen to our players. Every feature we build is driven by community feedback and needs.</p>
                    </Card>
                    <Card className="p-8">
                        <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Fair Play</h3>
                        <p className="text-gray-400">Integrity is everything. We invest heavily in anti-cheat technology to ensure a level playing field.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
