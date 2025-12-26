'use client';

import { useState, useRef } from 'react';

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    '╔═══════════════════════════════════════════════╗',
    '║         NeoLinux Terminal v2.0                ║',
    '║         Type "help" for commands              ║',
    '╚═══════════════════════════════════════════════╝',
    '',
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, () => string[]> = {
    help: () => [
      'Available commands:',
      '  help     - Show this help message',
      '  ls       - List directory contents',
      '  whoami   - Display current user',
      '  date     - Show current date and time',
      '  neofetch - Display system information',
      '  clear    - Clear the terminal',
      '  cowsay   - Make the cow say something',
    ],
    ls: () => ['Documents/', 'Downloads/', 'Pictures/', 'Desktop/', 'config.txt', 'readme.md'],
    whoami: () => ['neo@neolinux'],
    date: () => [new Date().toString()],
    neofetch: () => [
      '        _____        neo@neolinux',
      '       /     \\       ---------------',
      '      | ^   ^ |      OS: NeoLinux 2024.12',
      '      |   >   |      Kernel: 6.x.x-neo',
      '       \\ ___ /       Shell: neosh 5.1',
      '                     CPU: Virtual x86_64',
      '    NeoLinux OS      Memory: 8192MB',
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    cowsay: () => [
      ' _________________',
      '< Hello from Neo! >',
      ' -----------------',
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ],
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory([...history, trimmed]);
    const newLines = [...lines, `$ ${trimmed}`];

    const [command] = trimmed.split(' ');
    if (commands[command]) {
      const output = commands[command]();
      setLines([...newLines, ...output, '']);
    } else {
      setLines([...newLines, `Command not found: ${command}`, '']);
    }
    setInput('');
  };

  return (
    <div className="h-full bg-black/50 p-4 font-mono text-sm text-green-400 overflow-auto" onClick={() => inputRef.current?.focus()}>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-cyan-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(input);
          }}
          className="flex-1 bg-transparent outline-none text-green-400"
          autoFocus
        />
        <span className="animate-pulse">▊</span>
      </div>
    </div>
  );
}
