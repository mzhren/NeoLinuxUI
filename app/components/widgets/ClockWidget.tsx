'use client';

import { useState, useEffect } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-5xl font-bold text-white mb-2 font-mono">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-lg text-white/60">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}
