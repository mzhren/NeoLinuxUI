'use client';

import { useState } from 'react';

export default function FilesApp() {
  const [currentPath, setCurrentPath] = useState('/home/neo');
  const files = [
    { name: 'Documents', type: 'folder', icon: '📁', size: '-' },
    { name: 'Downloads', type: 'folder', icon: '📁', size: '-' },
    { name: 'Pictures', type: 'folder', icon: '🖼️', size: '-' },
    { name: 'Music', type: 'folder', icon: '🎵', size: '-' },
    { name: 'Videos', type: 'folder', icon: '🎬', size: '-' },
    { name: 'config.json', type: 'file', icon: '📄', size: '2.4 KB' },
    { name: 'readme.md', type: 'file', icon: '📝', size: '1.1 KB' },
    { name: 'script.sh', type: 'file', icon: '⚙️', size: '856 B' },
  ];

  return (
    <div className="h-full flex flex-col bg-black/30">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10">
        <button className="px-3 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">←</button>
        <button className="px-3 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">→</button>
        <div className="flex-1 bg-black/40 rounded px-3 py-1 text-white text-sm">{currentPath}</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{file.icon}</div>
              <div className="text-white text-xs text-center truncate w-full">{file.name}</div>
              <div className="text-white/50 text-xs">{file.size}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
