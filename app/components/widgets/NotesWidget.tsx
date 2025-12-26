'use client';

import { useState } from 'react';

export default function NotesWidget() {
  const [note, setNote] = useState('Click to add a note...');

  return (
    <div className="h-full">
      <div className="text-white font-medium mb-3 flex items-center gap-2">
        <span>📝</span>
        Quick Notes
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onFocus={(e) => note === 'Click to add a note...' && setNote('')}
        className="widget-interactive w-full h-[calc(100%-2rem)] bg-black/30 rounded-lg p-3 text-white text-sm resize-none outline-none border border-white/10 focus:border-white/30 transition-colors cursor-text"
        placeholder="Type your notes here..."
      />
    </div>
  );
}
