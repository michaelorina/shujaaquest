'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/lib/gemini';
import QuizCard from '@/components/QuizCard';
import ScoreDisplay from '@/components/ScoreDisplay';
import Confetti from '@/components/Confetti';
import GuruAvatar from '@/components/GuruAvatar';
import LoadingTips from '@/components/LoadingTips';

interface GameState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  heroName: string;
  isGameComplete: boolean;
  isGeneratingMore: boolean;
  totalQuestionsExpected: number;
}

export default function GamePage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    heroName: '',
    isGameComplete: false,
    isGeneratingMore: false,
    totalQuestionsExpected: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  // removed old multi-step submit toggle
  const [playerName, setPlayerName] = useState('');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  const initializeGame = useCallback(async (heroName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First, get initial 3 questions quickly
      const initialResponse = await fetch('/api/generate-initial-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroName }),
      });

      if (!initialResponse.ok) {
        throw new Error('Failed to generate initial questions');
      }

      const initialData = await initialResponse.json();

      setGameState(prev => ({
        ...prev,
        questions: initialData.questions,
        heroName: initialData.heroName ?? heroName,
        isGameComplete: false,
        isGeneratingMore: true,
        totalQuestionsExpected: 10,
      }));
      
      setIsLoading(false);

      // Then, generate remaining questions in background
      generateRemainingQuestions(heroName);
      
    } catch (err) {
      console.error('Error initializing game:', err);
      setError('Failed to load game. Please try again.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const selectedHero = sessionStorage.getItem('selectedHero');
    if (!selectedHero) {
      router.push('/');
      return;
    }
    initializeGame(selectedHero);
  }, [router, initializeGame]);


  const generateRemainingQuestions = async (heroName: string) => {
    try {
      const quizResponse = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroName }),
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to generate remaining questions');
      }

      const quizData = await quizResponse.json();
      
      // Replace with full quiz data
      setGameState(prev => ({
        ...prev,
        questions: quizData.questions,
        isGeneratingMore: false,
      }));
    } catch (err) {
      console.error('Error generating remaining questions:', err);
      // Keep the initial 3 questions, mark as complete
      setGameState(prev => ({
        ...prev,
        isGeneratingMore: false,
        totalQuestionsExpected: prev.questions.length,
      }));
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    let pointsEarned = 0;

    switch (currentQuestion.difficulty) {
      case 'easy':
        pointsEarned = isCorrect ? 10 : 0;
        break;
      case 'medium':
        pointsEarned = isCorrect ? 20 : 0;
        break;
      case 'hard':
        pointsEarned = isCorrect ? 30 : 0;
        break;
    }

    if (isCorrect) {
      setShowConfetti(true);
    }

    setGameState(prev => {
      const newScore = prev.score + pointsEarned;
      const newCorrectAnswers = prev.correctAnswers + (isCorrect ? 1 : 0);
      const nextQuestionIndex = prev.currentQuestionIndex + 1;
      const isGameComplete = nextQuestionIndex >= prev.questions.length && !prev.isGeneratingMore;

      return {
        ...prev,
        score: newScore,
        correctAnswers: newCorrectAnswers,
        currentQuestionIndex: nextQuestionIndex,
        isGameComplete,
      };
    });

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const restartGame = () => {
    sessionStorage.removeItem('selectedHero');
    router.push('/');
  };

  const submitScore = async () => {
    if (!playerName.trim()) return;
    
    try {
      setIsSubmittingScore(true);
      
      const response = await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          heroName: gameState.heroName,
          score: gameState.score,
          totalQuestions: gameState.questions.length,
          correctAnswers: gameState.correctAnswers,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      
      const result = await response.json();
      setSubmittedRank(result.rank);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsSubmittingScore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-800/70 to-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(39, 39, 42, 0.7) 50%, rgba(24, 24, 27, 0.9) 100%)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Animated background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-red-500/10 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-400 opacity-60" />
            
            {/* Floating elements */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400/20 rounded-full animate-ping" />
            <div className="absolute bottom-8 left-6 w-2 h-2 bg-red-400/30 rounded-full animate-bounce delay-700" />
            
            <div className="relative z-10 text-center">
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-white to-red-400 bg-clip-text text-transparent mb-2"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Preparing Your Quest...
              </motion.h2>
              <p className="text-zinc-300 text-sm">
                Crafting personalized questions about your chosen hero
              </p>
            </div>
          </motion.div>
          
          <LoadingTips />
          
          <GuruAvatar message="Ngoja kidogo... I'm preparing some tough questions for you! 😄" size="medium" />
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
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Oops!</h2>
          <p className="text-zinc-300 mb-6">{error}</p>
          <button onClick={restartGame} className="btn-primary">
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!gameState.questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (gameState.isGameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="glass-card p-6 mb-4 text-center">
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Quest Complete!</h1>
            <p className="text-zinc-400 mb-4">{gameState.heroName}</p>
            <div className="text-4xl font-black text-emerald-400">{gameState.score}</div>
            <div className="text-sm text-zinc-400 mt-1">
              {gameState.correctAnswers}/{gameState.questions.length} correct • {Math.round((gameState.correctAnswers / gameState.questions.length) * 100)}%
            </div>
          </div>

          {/* Single input to submit name */}
          {!submittedRank && (
            <div className="glass-card p-6 mb-4">
              <h3 className="text-lg font-bold text-zinc-100 mb-3">Enter Your Name</h3>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name..."
                className="terminal-input mb-3"
                maxLength={50}
                autoFocus
              />
              <button
                onClick={submitScore}
                disabled={!playerName.trim() || isSubmittingScore}
                className="w-full py-3 bg-emerald-600 text-white rounded font-mono text-sm hover:bg-emerald-700 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
              >
                {isSubmittingScore ? 'Submitting...' : 'Submit to Leaderboard'}
              </button>
            </div>
          )}

          {/* After submit: show actions */}
          {submittedRank && (
            <div className="glass-card p-4 mb-4 text-center text-emerald-300">
              🏆 Submitted! You ranked #{submittedRank}.
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={restartGame}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              🚀 Play Again
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg font-bold hover:bg-zinc-800 transition-all"
            >
              🏆 View Leaderboard
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg font-bold hover:bg-zinc-800 transition-all"
            >
              ← Back Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const maxScore = gameState.questions.reduce((total, q) => {
    const points = q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 20 : 30;
    return total + points;
  }, 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{gameState.heroName}</h1>
            <p className="text-zinc-400">ShujaaQuest</p>
          </div>
          
          <button
            onClick={restartGame}
            className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Score Display */}
          <div className="lg:col-span-1">
            <ScoreDisplay
              score={gameState.score}
              maxScore={maxScore}
              questionNumber={gameState.currentQuestionIndex + 1}
              totalQuestions={gameState.questions.length}
            />
          </div>

          {/* Quiz Card */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <QuizCard
                key={gameState.currentQuestionIndex}
                question={currentQuestion}
                questionNumber={gameState.currentQuestionIndex + 1}
                totalQuestions={gameState.questions.length}
                onAnswer={handleAnswer}
                isGeneratingMore={gameState.isGeneratingMore}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Confetti */}
      <Confetti trigger={showConfetti} />
    </div>
  );
}
