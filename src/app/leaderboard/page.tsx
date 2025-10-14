'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  heroName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  createdAt: string;
}

interface LeaderboardData {
  scores: LeaderboardEntry[];
  totalCount: number;
  filter: string;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/leaderboard?filter=${filter}&limit=50`, {
        cache: 'no-store', // Disable caching to always get fresh data
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getAccuracyColor = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Loading Leaderboard...</h2>
          <p className="text-zinc-400">Fetching the top shujaas...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md glass-card p-8"
        >
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Oops!</h2>
          <p className="text-zinc-300 mb-6">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-2">
            <span className="text-emerald-400">Shujaa</span>
            <span className="text-red-500">Quest</span>
            <span className="text-3xl ml-4">🏆</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-6">Hall of Fame</p>
          
          {/* Filter Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            {(['all', 'today', 'week'] as const).map((filterOption) => (
              <motion.button
                key={filterOption}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-emerald-600 to-red-600 text-white'
                    : 'bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {filterOption === 'all' ? 'All Time' : 
                 filterOption === 'today' ? 'Today' : 'This Week'}
              </motion.button>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Back Home
          </Link>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data && data.scores.length > 0 ? (
            <div className="glass-card overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-red-600 p-4">
                <div className="grid grid-cols-6 gap-4 font-bold text-sm uppercase tracking-wide text-white">
                  <div>Rank</div>
                  <div>Player</div>
                  <div>Hero</div>
                  <div>Score</div>
                  <div>Accuracy</div>
                  <div>Time</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-zinc-800">
                {data.scores.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`grid grid-cols-6 gap-4 p-4 hover:bg-zinc-800/50 transition-colors ${
                      index < 3 ? 'bg-zinc-900/80' : 'bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center font-bold text-lg">
                      <span className="text-2xl">{getRankIcon(index)}</span>
                    </div>
                    
                    <div className="flex items-center font-semibold text-zinc-100 truncate">
                      {entry.playerName}
                    </div>
                    
                    <div className="flex items-center text-zinc-300 truncate">
                      {entry.heroName}
                    </div>
                    
                    <div className="flex items-center font-bold text-emerald-400 text-lg">
                      {entry.score}
                    </div>
                    
                    <div className={`flex items-center font-semibold ${getAccuracyColor(entry.correctAnswers, entry.totalQuestions)}`}>
                      {Math.round((entry.correctAnswers / entry.totalQuestions) * 100)}%
                      <span className="text-xs text-zinc-500 ml-1">
                        ({entry.correctAnswers}/{entry.totalQuestions})
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-zinc-400">
                      {formatDate(entry.createdAt)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-zinc-900/50 p-4 text-center text-sm text-zinc-400 border-t border-zinc-800">
                Showing {data.scores.length} of {data.totalCount} total players • Auto-refreshes every 10s
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 glass-card"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">No Scores Yet</h3>
              <p className="text-zinc-400 mb-6">
                Be the first to complete a quest for {filter === 'today' ? 'today' : filter === 'week' ? 'this week' : 'all time'}!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Start Your Quest
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
