'use client';

import { motion } from 'framer-motion';

interface GuruAvatarProps {
  message: string;
  position?: 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large';
}

export default function GuruAvatar({ message, position = 'top', size = 'medium' }: GuruAvatarProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  return (
    <div className={`flex items-start gap-3 ${position === 'bottom' ? 'flex-row' : 'flex-row'}`}>
      {/* Guru Avatar - bearded wise man */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 overflow-hidden`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/avatars/guru.png" 
          alt="Guru" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1"
      >
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
          <p className="text-zinc-100 text-sm md:text-base leading-relaxed">{message}</p>
          
          {/* Speech bubble tail */}
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-zinc-900/80" />
        </div>
      </motion.div>
    </div>
  );
}

