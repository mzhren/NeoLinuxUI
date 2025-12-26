'use client';

import { useState, useEffect, useRef } from 'react';
import { DraggableWidget, type Widget } from './components/widgets';

interface Window {
  id: string;
  title: string;
  type: 'terminal' | 'files' | 'monitor' | 'about';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <LinuxDesktop />
    </div>
  );
}

function LinuxDesktop() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memUsage, setMemUsage] = useState(0);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  // 初始化默认 widgets（避免 SSR 错误）
  useEffect(() => {
    if (widgets.length === 0 && typeof window !== 'undefined') {
      setWidgets([
        { id: '1', type: 'clock', x: window.innerWidth - 320, y: 50, width: 280, height: 120 },
        { id: '2', type: 'weather', x: window.innerWidth - 320, y: 190, width: 280, height: 160 },
      ]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const cpuTimer = setInterval(() => {
      setCpuUsage(Math.random() * 100);
      setMemUsage(30 + Math.random() * 40);
    }, 2000);
    return () => {
      clearInterval(timer);
      clearInterval(cpuTimer);
    };
  }, []);

  const openWindow = (type: Window['type']) => {
    const newWindow: Window = {
      id: Date.now().toString(),
      title: type === 'terminal' ? 'Terminal' : type === 'files' ? 'Files' : type === 'monitor' ? 'System Monitor' : 'About',
      type,
      x: 100 + windows.length * 30,
      y: 80 + windows.length * 30,
      width: type === 'terminal' ? 700 : type === 'monitor' ? 500 : 600,
      height: type === 'terminal' ? 450 : type === 'monitor' ? 400 : 500,
      zIndex: nextZIndex,
      minimized: false,
      maximized: false,
    };
    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w));
  };

  const restoreWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w));
    setNextZIndex(nextZIndex + 1);
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(nextZIndex + 1);
  };

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      x: 100 + widgets.length * 20,
      y: 100 + widgets.length * 20,
      width: type === 'clock' ? 280 : type === 'weather' ? 280 : type === 'calendar' ? 300 : type === 'music' ? 320 : type === 'notes' ? 280 : 260,
      height: type === 'clock' ? 120 : type === 'weather' ? 160 : type === 'calendar' ? 320 : type === 'music' ? 180 : type === 'notes' ? 200 : 140,
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetMenu(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center px-4 z-[9999]">
        <div className="flex items-center gap-4">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded"></div>
            NeoLinux
          </div>
          <button className="text-white/80 hover:text-white text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors">
            Applications
          </button>
          <button className="text-white/80 hover:text-white text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors">
            System
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowWidgetMenu(!showWidgetMenu)}
              className="text-white/80 hover:text-white text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            >
              <span>🧩</span> Widgets
            </button>
            {showWidgetMenu && (
              <div className="absolute top-full left-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden min-w-[160px] z-[10000]">
                <button onClick={() => addWidget('clock')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  🕐 Clock
                </button>
                <button onClick={() => addWidget('weather')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  🌤️ Weather
                </button>
                <button onClick={() => addWidget('calendar')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  📅 Calendar
                </button>
                <button onClick={() => addWidget('music')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  🎵 Music
                </button>
                <button onClick={() => addWidget('system-info')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  💻 System Info
                </button>
                <button onClick={() => addWidget('notes')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  📝 Notes
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 text-white text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>CPU: {cpuUsage.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>MEM: {memUsage.toFixed(0)}%</span>
          </div>
          <span>{time.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-12 left-4 flex flex-col gap-4 z-10">
        <DesktopIcon icon="📁" label="Home" onClick={() => openWindow('files')} />
        <DesktopIcon icon="🗂️" label="Documents" onClick={() => openWindow('files')} />
        <DesktopIcon icon="🖼️" label="Pictures" onClick={() => openWindow('files')} />
      </div>

      {/* Widgets */}
      {widgets.map(widget => (
        <DraggableWidget
          key={widget.id}
          widget={widget}
          onRemove={() => removeWidget(widget.id)}
          setWidgets={setWidgets}
        />
      ))}

      {/* Windows */}
      {windows.map(window => (
        !window.minimized && (
          <DraggableWindow
            key={window.id}
            window={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => toggleMaximize(window.id)}
            onFocus={() => focusWindow(window.id)}
            setWindows={setWindows}
          />
        )
      ))}

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-end gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 z-[9998]">
        <DockIcon icon="💻" label="Terminal" onClick={() => openWindow('terminal')} />
        <DockIcon icon="📁" label="Files" onClick={() => openWindow('files')} />
        <DockIcon icon="📊" label="Monitor" onClick={() => openWindow('monitor')} />
        <DockIcon icon="ℹ️" label="About" onClick={() => openWindow('about')} />
        <div className="w-px h-12 bg-white/20 mx-1"></div>
        {windows.filter(w => w.minimized).map(w => (
          <DockIcon
            key={w.id}
            icon={w.type === 'terminal' ? '💻' : w.type === 'files' ? '📁' : w.type === 'monitor' ? '📊' : 'ℹ️'}
            label={w.title}
            onClick={() => restoreWindow(w.id)}
            minimized
          />
        ))}
      </div>
    </div>
  );
}

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-all group cursor-pointer"
    >
      <div className="text-4xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-white text-xs font-medium drop-shadow-lg">{label}</span>
    </button>
  );
}

function DockIcon({ icon, label, onClick, minimized }: { icon: string; label: string; onClick: () => void; minimized?: boolean }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`text-3xl hover:scale-125 transition-all duration-200 p-2 hover:-translate-y-2 ${minimized ? 'opacity-60' : ''}`}
        title={label}
      >
        {icon}
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

function DraggableWindow({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  setWindows
}: {
  window: Window;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
}) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-content')) return;
    onFocus();
    setDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    onFocus();
    setResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && !window.maximized) {
        setWindows(prev => prev.map(w => 
          w.id === window.id 
            ? { ...w, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : w
        ));
      }

      if (resizing && !window.maximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        setWindows(prev => prev.map(w => {
          if (w.id === window.id) {
            const updates: Partial<Window> = {};
            
            // 处理不同方向的调整
            if (resizing.includes('e')) {
              updates.width = Math.max(300, resizeStart.width + deltaX);
            }
            if (resizing.includes('s')) {
              updates.height = Math.max(200, resizeStart.height + deltaY);
            }
            if (resizing.includes('w')) {
              const newWidth = Math.max(300, resizeStart.width - deltaX);
              if (newWidth > 300) {
                updates.x = w.x + (resizeStart.width - newWidth);
                updates.width = newWidth;
              }
            }
            if (resizing.includes('n')) {
              const newHeight = Math.max(200, resizeStart.height - deltaY);
              if (newHeight > 200) {
                updates.y = w.y + (resizeStart.height - newHeight);
                updates.height = newHeight;
              }
            }
            
            return { ...w, ...updates };
          }
          return w;
        }));
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(null);
    };

    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, resizing, dragOffset, resizeStart, window.id, window.maximized, setWindows]);

  const style = window.maximized
    ? { top: 32, left: 0, right: 0, bottom: 0, width: '100%', height: 'calc(100% - 32px)' }
    : { top: window.y, left: window.x, width: window.width, height: window.height };

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-900/80 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden"
      style={{ ...style, zIndex: window.zIndex }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-gradient-to-r from-purple-600/40 to-blue-600/40 backdrop-blur-xl border-b border-white/10 flex items-center px-4 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-white font-medium text-sm flex-1">{window.title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
          ></button>
          <button
            onClick={onMaximize}
            className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          ></button>
          <button
            onClick={onClose}
            className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          ></button>
        </div>
      </div>

      {/* Content */}
      <div className="window-content h-[calc(100%-2.5rem)] overflow-auto">
        {window.type === 'terminal' && <TerminalApp />}
        {window.type === 'files' && <FilesApp />}
        {window.type === 'monitor' && <MonitorApp />}
        {window.type === 'about' && <AboutApp />}
      </div>

      {/* Resize Handles - 只在非最大化时显示 */}
      {!window.maximized && (
        <>
          {/* 四角 */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10"
          />
          
          {/* 四边 */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            className="absolute top-3 bottom-3 left-0 w-1 cursor-w-resize z-10"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            className="absolute top-3 bottom-3 right-0 w-1 cursor-e-resize z-10"
          />
        </>
      )}
    </div>
  );
}

// ============================================
// 应用组件
// ============================================

function TerminalApp() {
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

function FilesApp() {
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

function MonitorApp() {
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

function AboutApp() {
  return (
    <div className="h-full p-8 bg-black/30 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse"></div>
      <h1 className="text-white text-3xl font-bold mb-2">NeoLinux OS</h1>
      <p className="text-white/60 mb-6">Version 2024.12.0</p>
      <p className="text-white/80 max-w-md mb-4">
        A modern, beautiful Linux desktop experience built with cutting-edge web technologies.
      </p>
      <div className="flex flex-col gap-2 text-sm text-white/60">
        <div>Kernel: 6.x.x-neo</div>
        <div>Shell: NeoShell 5.1</div>
        <div>Desktop: NeoDE 3.0</div>
      </div>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium cursor-pointer hover:scale-105 transition-transform">
          Documentation
        </div>
        <div className="px-4 py-2 bg-white/10 rounded-lg text-white font-medium cursor-pointer hover:bg-white/20 transition-colors">
          GitHub
        </div>
      </div>
    </div>
  );
}
