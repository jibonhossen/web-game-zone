'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Trophy, Target, Sword, Flame, ChevronRight, Gamepad2, Users, Shield } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: i * 0.2
      }
    })
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-darker to-dark z-0" />
        <div className="absolute inset-0 opacity-30 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full filter blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.span variants={itemVariants} className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20">
              🎮 The Ultimate Gaming Platform
            </motion.span>

            <motion.h1 variants={itemVariants} className="font-heading text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              Level Up Your <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Gaming Experience
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Join thousands of gamers competing in tournaments, earning rewards, and becoming legends. Your next victory awaits!
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download">
                <Button size="lg" className="group">
                  Download App <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Floating Cards */}
            <motion.div variants={itemVariants} className="mt-20 flex justify-center gap-6 flex-wrap">
              {[
                { icon: <Flame className="w-8 h-8 text-orange-500" />, color: "from-orange-500 to-red-600" },
                { icon: <Sword className="w-8 h-8 text-blue-500" />, color: "from-blue-500 to-cyan-600" },
                { icon: <Trophy className="w-8 h-8 text-yellow-500" />, color: "from-yellow-400 to-yellow-600" },
                { icon: <Target className="w-8 h-8 text-green-500" />, color: "from-green-500 to-emerald-600" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={floatingVariants}
                  animate="animate"
                  className={`w-32 h-44 rounded-2xl bg-gradient-to-br ${item.color} p-1`}
                >
                  <div className="w-full h-full rounded-xl bg-dark/90 flex items-center justify-center backdrop-blur-sm">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-medium">WHY CHOOSE US</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mt-2">Built for Gamers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Lightning Fast", icon: <Gamepad2 />, desc: "Find matches instantly with our smart matchmaking system." },
              { title: "Real Rewards", icon: <Trophy />, desc: "Compete in tournaments and win exciting prizes." },
              { title: "Active Community", icon: <Users />, desc: "Join a thriving community. Make friends, form teams!" },
              { title: "Secure & Fair", icon: <Shield />, desc: "Anti-cheat protection ensures fair play for everyone." },
              { title: "Live Updates", icon: <Flame />, desc: "Get real-time alerts for tournaments and invites." },
              { title: "Leaderboards", icon: <Target />, desc: "Climb the ranks and showcase your skills." },
            ].map((feature, i) => (
              <Card key={i} glow className="p-8 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon as any, { size: 28 })}
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-400 mb-10">Download Game Zone now and join the ultimate mobile gaming community.</p>
          <Link href="/download">
            <Button size="lg" className="w-full sm:w-auto">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
