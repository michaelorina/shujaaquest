'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/lib/gemini';
import QuizCard from '@/components/QuizCard';
import ScoreDisplay from '@/components/ScoreDisplay';
import Confetti from '@/components/Confetti';
import GuruAvatar from '@/components/GuruAvatar';
import { getRandomFact } from '@/lib/kenya-facts';

interface GameState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  heroName: string;
  isGameComplete: boolean;
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
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFact, setLoadingFact] = useState(getRandomFact());
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  useEffect(() => {
    const selectedHero = sessionStorage.getItem('selectedHero');
    if (!selectedHero) {
      router.push('/');
      return;
    }
    initializeGame(selectedHero);
  }, [router]);

  // Rotate fun facts while loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingFact(getRandomFact());
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const initializeGame = async (heroName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const quizResponse = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroName }),
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to generate questions');
      }

      const quizData = await quizResponse.json();

      setGameState(prev => ({
        ...prev,
        questions: quizData.questions,
        heroName: quizData.heroName ?? heroName,
        isGameComplete: false,
      }));
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing game:', err);
      setError('Failed to load game. Please try again.');
      setIsLoading(false);
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
      const isGameComplete = nextQuestionIndex >= prev.questions.length;

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
      setShowScoreSubmission(false);
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
          <div className="glass-card p-8 mb-6">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Preparing Your Quest...</h2>
            <div className="bg-zinc-900/50 p-4 rounded-lg border-l-4 border-l-emerald-500">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingFact}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-zinc-300 text-sm"
                >
                  💡 {loadingFact}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          
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
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">
              Quest Complete!
            </h1>
          </div>
          
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
              {gameState.heroName}
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-400">{gameState.score}</div>
                <div className="text-sm text-zinc-400">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-red-400">
                  {gameState.correctAnswers}/{gameState.questions.length}
                </div>
                <div className="text-sm text-zinc-400">Correct</div>
              </div>
            </div>
            
            <div className="text-center text-lg font-semibold text-zinc-200 mb-4">
              Accuracy: {Math.round((gameState.correctAnswers / gameState.questions.length) * 100)}%
            </div>
            
            {submittedRank && (
              <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4 mb-4">
                <p className="text-emerald-300 font-semibold text-center">
                  🏆 Rank #{submittedRank} on the leaderboard!
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <GuruAvatar
              message={gameState.correctAnswers > 7 ? "Wueh! You're a true historian! Hongera sana! 🎓" : gameState.correctAnswers > 5 ? "Poa! Good effort, keep learning about our shujaas! 📚" : "Sawa tu! More practice needed, lakini you tried! 💪"}
              size="medium"
            />
          </div>
          
          {!submittedRank && !showScoreSubmission ? (
            <button
              onClick={() => setShowScoreSubmission(true)}
              className="w-full mb-4 py-4 bg-gradient-to-r from-emerald-600 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              🏆 Submit to Leaderboard
            </button>
          ) : showScoreSubmission ? (
            <div className="glass-card p-6 mb-4">
              <h3 className="text-xl font-bold text-zinc-100 mb-4">Enter Your Name</h3>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name..."
                className="terminal-input mb-4"
                maxLength={50}
              />
              <div className="flex gap-3">
                <button
                  onClick={submitScore}
                  disabled={!playerName.trim() || isSubmittingScore}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-zinc-700 transition-colors"
                >
                  {isSubmittingScore ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => setShowScoreSubmission(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          
          <div className="flex gap-4">
            <button
              onClick={restartGame}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              🚀 Play Again
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="flex-1 py-3 border-2 border-emerald-600 text-emerald-400 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              🏆 Leaderboard
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
