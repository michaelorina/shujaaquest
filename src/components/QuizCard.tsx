'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from '@/lib/gemini';
import GuruAvatar from './GuruAvatar';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer 
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Normalize correctAnswer to a stable type for comparisons
  const normalizedCorrectAnswer: string | boolean = useMemo(() => {
    if (question.type === 'true_false') {
      const value = question.correctAnswer;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const s = value.trim().toLowerCase();
        if (['true', 't', 'yes', 'y', '1'].includes(s)) return true;
        if (['false', 'f', 'no', 'n', '0'].includes(s)) return false;
      }
      // default fallback if ambiguous
      return false;
    }

    // multiple choice: prefer letter A-D; fall back by matching option text
    if (typeof question.correctAnswer === 'string') {
      const s = question.correctAnswer.trim();
      if (/^[A-D]$/i.test(s)) return s.toUpperCase();
      if (question.options && question.options.length) {
        const idx = question.options.findIndex(
          (opt) => opt.trim().toLowerCase() === s.toLowerCase()
        );
        if (idx >= 0) {
          return String.fromCharCode(65 + idx);
        }
      }
      return s;
    }
    return typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
  }, [question]);

  const handleAnswerSelect = (answer: string | boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === normalizedCorrectAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-300 bg-emerald-900/30 border border-emerald-800';
      case 'medium': return 'text-yellow-300 bg-yellow-900/30 border border-yellow-800';
      case 'hard': return 'text-red-300 bg-red-900/30 border border-red-800';
      default: return 'text-zinc-300 bg-zinc-900/30 border border-zinc-800';
    }
  };

  const getAnswerButtonClass = (option: string | boolean, isSelected: boolean) => {
    const baseClass = "w-full p-4 rounded-lg font-semibold text-lg transition-all duration-300 border";
    
    if (!showFeedback) {
      return `${baseClass} border-zinc-700 bg-zinc-900/60 hover:border-emerald-500 hover:bg-zinc-800 text-zinc-100`;
    }
    
    if (option === normalizedCorrectAnswer) {
      return `${baseClass} border-emerald-500 bg-emerald-600 text-white`;
    }
    
    if (isSelected && option !== question.correctAnswer) {
      return `${baseClass} border-red-500 bg-red-600 text-white`;
    }
    
    return `${baseClass} border-zinc-800 bg-zinc-900/30 text-zinc-400`;
  };

  const getGuruReaction = () => {
    if (isCorrect) {
      const reactions = [
        "Hongera sana! You know your stuff! 🎉",
        "Sawa! That's the right answer, mshujaa! 💪",
        "Eeh! Exactly right! You're on fire! 🔥",
        "Kweli kabisa! Correct answer, keep going! ✨",
      ];
      return reactions[Math.floor(Math.random() * reactions.length)];
    } else {
      const reactions = [
        "Ai! Not quite, lakini you tried! Keep learning! 📚",
        "Pole! Wrong answer, but don't give up! 💪",
        "Sawa tu! That's not it, but you'll get the next one! 🎯",
        "Aki! So close! Better luck next time! 💫",
      ];
      return reactions[Math.floor(Math.random() * reactions.length)];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="max-w-4xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-300">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.toUpperCase()}
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-r from-emerald-500 to-red-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="glass-card p-8 mb-6"
      >
        {/* Question */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-zinc-100 mb-8 leading-relaxed"
        >
          {question.question}
        </motion.h2>

        {/* Answer Options */}
        <div className="space-y-4 mb-6">
          {question.type === 'multiple_choice' && question.options ? (
            question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === optionLetter;
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  disabled={selectedAnswer !== null}
                  className={getAnswerButtonClass(optionLetter, isSelected)}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mr-4 font-bold">
                      {optionLetter}
                    </span>
                    {option}
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map((option) => {
                const isSelected = selectedAnswer === option;
                const optionText = option ? 'TRUE' : 'FALSE';
                
                return (
                  <motion.button
                    key={option.toString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    whileHover={!showFeedback ? { scale: 1.05 } : {}}
                    whileTap={!showFeedback ? { scale: 0.95 } : {}}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={getAnswerButtonClass(option, isSelected)}
                  >
                    <span className="text-2xl font-bold">
                      {optionText}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`p-5 rounded-lg border ${
                isCorrect 
                  ? 'bg-emerald-900/30 border-emerald-500/50' 
                  : 'bg-red-900/30 border-red-500/50'
              }`}>
                <p className="text-zinc-200 mb-2">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
                <p className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {question.funnyCommentary}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-right"
          >
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Next →
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Guru Reaction */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GuruAvatar message={getGuruReaction()} position="bottom" size="medium" />
        </motion.div>
      )}
    </motion.div>
  );
}
