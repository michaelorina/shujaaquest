'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GuruAvatar from '@/components/GuruAvatar';
import MiniLeaderboard from '@/components/MiniLeaderboard';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [heroName, setHeroName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroName.trim()) {
      sessionStorage.setItem('selectedHero', heroName.trim());
      router.push('/game');
    }
  };

  const funFacts = [
    { fact: "🏔️ Mt. Kenya is Africa's 2nd highest peak", position: "top-32 left-10" },
    { fact: "🏃‍♂️ Eliud Kipchoge broke the 2-hour marathon barrier", position: "top-32 right-20" },
    { fact: "🌳 Wangari Maathai planted 30M+ trees", position: "top-[45%] left-5" },
    { fact: "🎓 Kenya's literacy rate: 81%", position: "bottom-32 right-10" },
    { fact: "🦁 Kenya has 50+ national parks", position: "top-[60%] right-16" },
    { fact: "📚 Ngugi wa Thiong'o writes in Gikuyu", position: "bottom-20 left-16" },
  ];

  const timelineEvents = [
    { year: '1963', title: 'Independence', color: 'emerald' },
    { year: '2002', title: 'New Era', color: 'red' },
    { year: '2010', title: 'Constitution', color: 'emerald' },
    { year: '2025', title: 'Today', color: 'red' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Kenyan flag color accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-2 kenyan-flag-colors opacity-80" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      {/* Floating fun facts */}
      {funFacts.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
          className={`hidden lg:block absolute ${item.position} glass-card px-4 py-2 text-xs text-zinc-400 max-w-[200px] z-0`}
        >
          {item.fact}
        </motion.div>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Top Left (desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block absolute top-8 left-8 md:left-16"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            <span className="text-emerald-400">Shujaa</span>
            <span className="text-red-500">Quest</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Celebrating Kenya&apos;s Heroes 🇰🇪</p>
        </motion.div>

        {/* Header - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-4 pt-6"
        >
          <h1 className="text-4xl font-black text-center">
            <span className="text-emerald-400">Shujaa</span>
            <span className="text-red-500">Quest</span>
          </h1>
          <p className="text-zinc-500 text-center text-sm mt-1">Celebrating Kenya&apos;s Heroes 🇰🇪</p>
        </motion.div>

        {/* Main Content - Center */}
        <div className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Guru Introduction */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GuruAvatar
                message="Habari! How well do you know your Shujaas? Enter a hero&apos;s name and I&apos;ll test your knowledge. Are you ready for the challenge? Kaa rada!"
                size="large"
              />
            </motion.div>

            {/* Right: Terminal Input */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className="glass-card p-8">
                <div className="mb-4 flex items-center gap-2 text-emerald-400 font-mono text-sm">
                  <span>$ shujaa-quest</span>
                  <span className="animate-pulse">▊</span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => {
                      setHeroName(e.target.value);
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 300);
                    }}
                    placeholder="Enter hero name..."
                    className="terminal-input"
                    autoFocus
                  />
                  {isTyping && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 animate-pulse">
                      ▊
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!heroName.trim()}
                  className={`mt-4 w-full py-3 px-6 rounded-lg font-mono font-bold transition-all ${
                    heroName.trim()
                      ? 'bg-gradient-to-r from-emerald-600 to-red-600 text-white hover:shadow-lg hover:shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {heroName.trim() ? '> START QUEST' : '> AWAITING INPUT...'}
                </button>

                <div className="mt-4 text-xs text-zinc-500">
                  <p className="mb-1">Popular heroes:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Wangari Maathai', 'Jomo Kenyatta', 'Eliud Kipchoge'].map(hero => (
                      <button
                        key={hero}
                        type="button"
                        onClick={() => setHeroName(hero)}
                        className="px-2 py-1 bg-zinc-800/50 hover:bg-zinc-800 rounded text-zinc-400 hover:text-emerald-400 transition-colors"
                      >
                        {hero}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Mobile Fun Facts scroller */}
        <div className="md:hidden px-4 -mt-4 mb-6">
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {funFacts.map((item, index) => (
                <div key={index} className="glass-card px-3 py-2 text-xs text-zinc-400">
                  {item.fact}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Leaderboard & Timeline */}
        <div className="w-full px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Left: Mini Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="md:col-span-1"
            >
              <MiniLeaderboard />
              <div className="text-center mt-3">
                <Link href="/leaderboard" className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold">
                  View All →
                </Link>
              </div>
            </motion.div>

            {/* Right: Kenya Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="md:col-span-2"
            >
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  🇰🇪 Kenya&apos;s Journey
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={event.year}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className={`p-4 rounded-lg bg-zinc-900/50 border-l-4 hover:bg-zinc-800/50 transition-colors ${
                        event.color === 'emerald' ? 'border-l-emerald-500' : 'border-l-red-500'
                      }`}
                    >
                      <div className={`text-2xl font-black mb-1 ${
                        event.color === 'emerald' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {event.year}
                      </div>
                      <div className="text-sm text-zinc-300">{event.title}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-zinc-500 text-center">
                  From independence to today, celebrating our heroes&apos; contributions
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
