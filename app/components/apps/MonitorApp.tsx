'use client';

import { useState, useEffect } from 'react';

export default function MonitorApp() {
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(0));
  const [memHistory, setMemHistory] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory(prev => [...prev.slice(1), Math.random() * 100]);
      setMemHistory(prev => [...prev.slice(1), 30 + Math.random() * 40]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-6 bg-black/30 overflow-auto">
      <h2 className="text-white text-xl font-bold mb-6">System Monitor</h2>
      
      {/* CPU Usage */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">CPU Usage</span>
          <span className="text-cyan-400">{cpuHistory[cpuHistory.length - 1]?.toFixed(1)}%</span>
        </div>
        <div className="h-24 bg-black/40 rounded-lg p-2 flex items-end gap-1">
          {cpuHistory.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-sm transition-all"
              style={{ height: `${val}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Memory Usage */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Memory Usage</span>
          <span className="text-purple-400">{memHistory[memHistory.length - 1]?.toFixed(1)}%</span>
        </div>
        <div className="h-24 bg-black/40 rounded-lg p-2 flex items-end gap-1">
          {memHistory.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm transition-all"
              style={{ height: `${val}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 rounded-lg p-4">
          <div className="text-white/60 text-sm">Processes</div>
          <div className="text-white text-2xl font-bold">247</div>
        </div>
        <div className="bg-black/40 rounded-lg p-4">
          <div className="text-white/60 text-sm">Uptime</div>
          <div className="text-white text-2xl font-bold">3d 14h</div>
        </div>
      </div>
    </div>
  );
}
