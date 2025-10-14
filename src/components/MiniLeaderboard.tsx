'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  heroName: string;
  score: number;
}

export default function MiniLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard?filter=today&limit=5')
      .then(res => res.json())
      .then(data => {
        setEntries(data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-zinc-100 mb-4">🏆 Today's Champions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-zinc-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
        🏆 Today's Champions
      </h3>
      
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-zinc-400 text-sm">Be the first to play today!</p>
        ) : (
          entries.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-zinc-900' :
                  index === 1 ? 'bg-zinc-400 text-zinc-900' :
                  index === 2 ? 'bg-amber-700 text-zinc-100' :
                  'bg-zinc-700 text-zinc-300'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-100 font-semibold truncate">{entry.playerName}</div>
                  <div className="text-zinc-400 text-xs truncate">{entry.heroName}</div>
                </div>
              </div>
              <div className="text-emerald-400 font-bold text-sm ml-2">{entry.score}</div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

