'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const tips = [
  "💡 Did you know? Kenya has over 42 ethnic groups with diverse cultures!",
  "🏔️ Mount Kenya is Africa's second-highest peak at 5,199 meters!",
  "🦁 The 'Big Five' animals were named by big-game hunters as the most dangerous to hunt!",
  "☕ Kenya is the world's 3rd largest exporter of coffee!",
  "🏃‍♂️ Kenya dominates long-distance running - holding world records in multiple events!",
  "🌍 Kenya is home to the Great Rift Valley, visible from space!",
  "🎨 Kenyan art includes beautiful Maasai beadwork and Kikuyu basket weaving!",
  "🌱 Kenya generates 90% of its electricity from renewable sources!",
  "📚 Swahili is Kenya's national language alongside English!",
  "🦒 Kenya has over 25 national parks and reserves!",
  "🏆 Kenyan athletes have won Olympic medals in every Summer Games since 1964!",
  "🌊 Lake Victoria, the world's second-largest freshwater lake, borders Kenya!",
  "🎭 Traditional Kenyan music includes benga, genge, and kapuka styles!",
  "🌾 Kenya is a major producer of tea, coffee, and flowers!",
  "🏛️ Kenya gained independence from Britain in 1963!"
];

const gameTips = [
  "🎯 Pro tip: Read each question carefully before choosing!",
  "💪 Don't rush - you have time to think through each answer!",
  "🧠 Use context clues in the question to help you decide!",
  "🎲 If unsure, make your best educated guess!",
  "🏆 Each difficulty level gives different points - harder = more points!",
  "⭐ Easy questions: 10 points | Medium: 20 points | Hard: 30 points!",
  "🎉 Correct answers trigger confetti - enjoy the celebration!",
  "📚 Learn from explanations to improve your knowledge!",
  "🔄 You can always play again to beat your score!",
  "🏅 Check the leaderboard to see how you rank!"
];

export default function LoadingTips() {
  const allTips = [...tips, ...gameTips];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % allTips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [allTips.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-6 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(39, 39, 42, 0.6) 50%, rgba(24, 24, 27, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-red-500/5 animate-pulse" />
      
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/30 rounded-full animate-ping" />
      <div className="absolute bottom-6 left-8 w-1 h-1 bg-red-400/40 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-bounce delay-500" />

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
          <motion.span 
            className="text-3xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            💡
          </motion.span>
          <span className="bg-gradient-to-r from-emerald-400 to-red-400 bg-clip-text text-transparent">
            While You Wait...
          </span>
        </h3>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative"
          >
            <p className="text-zinc-200 text-sm leading-relaxed font-medium">
              {allTips[currentTipIndex]}
            </p>
            
            {/* Progress indicator */}
            <div className="mt-3 flex justify-center">
              <div className="flex gap-1">
                {allTips.slice(0, 5).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === (currentTipIndex % 5) 
                        ? 'bg-gradient-to-r from-emerald-400 to-red-400' 
                        : 'bg-zinc-600/50'
                    }`}
                    animate={{
                      scale: index === (currentTipIndex % 5) ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
