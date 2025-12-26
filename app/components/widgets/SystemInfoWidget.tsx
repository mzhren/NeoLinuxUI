'use client';

import { useState, useEffect } from 'react';

export default function SystemInfoWidget() {
  const [cpu, setCpu] = useState(0);
  const [mem, setMem] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.random() * 100);
      setMem(30 + Math.random() * 40);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm">CPU</span>
          <span className="text-cyan-400 text-sm font-bold">{cpu.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${cpu}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm">Memory</span>
          <span className="text-purple-400 text-sm font-bold">{mem.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${mem}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 bg-black/30 rounded-lg p-3 flex flex-col justify-center gap-2 text-sm text-white/60">
        <div>💾 Disk: 234GB / 512GB</div>
        <div>🌐 Network: 45.2 MB/s</div>
        <div>⚡ Uptime: 3d 14h 27m</div>
      </div>
    </div>
  );
}
