'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface ConfettiComponentProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiComponent({ trigger, onComplete }: ConfettiComponentProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
      
      // Hide confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!showConfetti || windowDimensions.width === 0) {
    return null;
  }

  return (
    <Confetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      colors={['#10b981', '#ef4444', '#000000', '#ffffff']} // Kenyan flag colors
      numberOfPieces={150}
      recycle={false}
      gravity={0.3}
      initialVelocityY={20}
      wind={0.02}
      friction={0.99}
    />
  );
}
