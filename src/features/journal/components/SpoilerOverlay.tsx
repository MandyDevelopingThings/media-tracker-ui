'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpoilerOverlayProps = {
  children: React.ReactNode;
  revealText: string;
};

export const SpoilerOverlay = ({ children, revealText }: SpoilerOverlayProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-md">
      <div className={cn(
        "transition-all duration-500",
        !isRevealed ? "blur-md opacity-40 select-none pointer-events-none" : "blur-0 opacity-100"
      )}>
        {children}
      </div>
      
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10">
          <button
            onClick={() => setIsRevealed(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 text-white/90 hover:bg-black/80 hover:border-white/20 transition-all shadow-lg backdrop-blur-sm group"
          >
            <Eye className="w-4 h-4 text-[#39FF14] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium tracking-wide">{revealText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
