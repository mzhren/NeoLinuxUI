'use client';

import { useState } from 'react';

export default function AppCard({ app }: { app: any }) {
  const [isInstalled, setIsInstalled] = useState(app.installed);

  return (
    <div className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl shadow-lg`}>
          {app.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold">{app.name}</h3>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>⭐ {app.rating}</span>
            <span>•</span>
            <span>{app.downloads}</span>
          </div>
        </div>
      </div>
      
      <p className="text-white/80 text-sm mb-3">{app.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">{app.size}</span>
        <button
          onClick={() => setIsInstalled(!isInstalled)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isInstalled
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105'
          }`}
        >
          {isInstalled ? 'Uninstall' : 'Install'}
        </button>
      </div>
    </div>
  );
}
