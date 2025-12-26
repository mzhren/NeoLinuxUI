'use client';

import { useState, useEffect } from 'react';

export default function MusicWidget() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [playing]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
          🎵
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">Neon Dreams</div>
          <div className="text-white/60 text-sm">Synthwave Artist</div>
        </div>
      </div>
      
      <div>
        <div className="w-full bg-white/20 rounded-full h-1 mb-3">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button className="widget-interactive text-white/80 hover:text-white text-xl cursor-pointer">⏮️</button>
          <button 
            onClick={() => setPlaying(!playing)}
            className="widget-interactive w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl text-white transition-colors cursor-pointer"
          >
            {playing ? '⏸️' : '▶️'}
          </button>
          <button className="widget-interactive text-white/80 hover:text-white text-xl cursor-pointer">⏭️</button>
        </div>
      </div>
    </div>
  );
}
