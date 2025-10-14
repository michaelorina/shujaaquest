'use client';

import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  questionNumber: number;
  totalQuestions: number;
}

export default function ScoreDisplay({ 
  score, 
  maxScore, 
  questionNumber, 
  totalQuestions 
}: ScoreDisplayProps) {
  const percentage = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;
  const scorePercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 sticky top-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Current Score</h3>
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-black text-emerald-400"
          >
            {score}
          </motion.div>
          <p className="text-xs text-zinc-500">out of {maxScore}</p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-sm font-medium text-zinc-400">Progress</div>
          <div className="text-lg font-bold text-red-400">
            {questionNumber}/{totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Completed</span>
          <span className="font-semibold text-zinc-300">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-r from-emerald-500 to-red-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-zinc-900/50 p-2 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Easy</div>
            <div className="text-sm font-bold text-emerald-400">10pts</div>
          </div>
          <div className="bg-zinc-900/50 p-2 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Medium</div>
            <div className="text-sm font-bold text-yellow-400">20pts</div>
          </div>
          <div className="bg-zinc-900/50 p-2 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Hard</div>
            <div className="text-sm font-bold text-red-400">30pts</div>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      {questionNumber > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-gradient-to-r from-emerald-900/30 to-red-900/30 rounded-lg border border-zinc-800"
        >
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-300">
              {scorePercentage >= 80 ? '🔥 On Fire!' : 
               scorePercentage >= 60 ? '👍 Doing Great!' : 
               scorePercentage >= 40 ? '💪 Keep Going!' : 
               '🎯 You Got This!'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
