'use client';

import { useState, useEffect, useRef } from 'react';
import { DraggableWidget, type Widget } from './components/widgets';
import { 
  TerminalApp, 
  FilesApp, 
  MonitorApp, 
  AboutApp, 
  AppStoreApp, 
  AppListApp, 
  BrowserApp,
  SettingsApp 
} from './components/apps';
import MusicPlayerApp from './components/apps/MusicPlayerApp';
import VideoPlayerApp from './components/apps/VideoPlayerApp';
import TextEditorApp from './components/apps/TextEditorApp';
import PaintApp from './components/apps/PaintApp';
import Dock from './components/Dock';
import { useTheme } from './contexts/ThemeContext';
import LoginScreen from './components/LoginScreen';
import Notifications, { type Notification } from './components/Notifications';

interface Window {
  id: string;
  title: string;
  type: 'terminal' | 'files' | 'monitor' | 'about' | 'appstore' | 'applist' | 'browser' | 'settings' | 'music' | 'video' | 'texteditor' | 'paint';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: '系统更新', message: 'NeoLinux 有可用更新', time: '5分钟前', unread: true, icon: '🔄' },
    { id: 2, title: '新邮件', message: '您有3封未读邮件', time: '1小时前', unread: true, icon: '📧' },
    { id: 3, title: '日历提醒', message: '会议将在30分钟后开始', time: '2小时前', unread: false, icon: '📅' },
  ]);
  
  const { 
    theme, 
    accentColor, 
    getFontSizeClass, 
    getBackdropBlurClass,
    getBackgroundGradient,
    transparencyEnabled,
    backgroundType,
    backgroundImage,
    scaling,
    nightMode 
  } = useTheme();

  // 检查本地存储的登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loginData = localStorage.getItem('neolinux-login');
      if (loginData) {
        try {
          const { username, loginTime } = JSON.parse(loginData);
          const now = new Date().getTime();
          const oneWeek = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数
          
          // 检查登录时间是否在一周内
          if (now - loginTime < oneWeek) {
            setCurrentUser(username);
            setIsLoggedIn(true);
          } else {
            // 超过一周，清除登录状态
            localStorage.removeItem('neolinux-login');
          }
        } catch (e) {
          console.error('Failed to load login data:', e);
          localStorage.removeItem('neolinux-login');
        }
      }
    }
  }, []);

  // 初始化默认 widgets（避免 SSR 错误）
  useEffect(() => {
    if (widgets.length === 0 && typeof window !== 'undefined') {
      const centerX = (window.innerWidth - 800) / 2;
      const centerY = (window.innerHeight - 400) / 2;
      setWidgets([
        { id: '1', type: 'flipclock', x: centerX, y: centerY, width: 800, height: 400, opacity: 0.1 },
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

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    
    // 保存登录状态到 localStorage，记录登录时间
    if (typeof window !== 'undefined') {
      const loginData = {
        username,
        loginTime: new Date().getTime()
      };
      localStorage.setItem('neolinux-login', JSON.stringify(loginData));
    }
  };

  // 如果未登录，显示登录界面
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 窗口配置
  const WINDOW_CONFIG: Record<Window['type'], { title: string; width: number; height: number }> = {
    terminal: { title: 'Terminal', width: 700, height: 450 },
    files: { title: 'Files', width: 600, height: 500 },
    monitor: { title: 'System Monitor', width: 500, height: 400 },
    appstore: { title: 'App Store', width: 800, height: 600 },
    applist: { title: 'Applications', width: 600, height: 500 },
    browser: { title: 'Chrome Browser', width: 1000, height: 700 },
    settings: { title: 'Settings', width: 900, height: 600 },
    about: { title: 'About', width: 600, height: 500 },
    music: { title: 'Music Player', width: 600, height: 700 },
    video: { title: 'Video Player', width: 900, height: 700 },
    texteditor: { title: 'Text Editor', width: 800, height: 600 },
    paint: { title: 'Paint', width: 1000, height: 700 },
  };

  const openWindow = (type: Window['type']) => {
    const config = WINDOW_CONFIG[type];
    const newWindow: Window = {
      id: Date.now().toString(),
      title: config.title,
      type,
      x: 100 + windows.length * 30,
      y: 80 + windows.length * 30,
      width: config.width,
      height: config.height,
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
      width: type === 'clock' ? 280 : type === 'weather' ? 240 : type === 'calendar' ? 300 : type === 'music' ? 320 : type === 'notes' ? 280 : type === 'todo' ? 320 : type === 'flipclock' ? 800 : 260,
      height: type === 'clock' ? 120 : type === 'weather' ? 340 : type === 'calendar' ? 320 : type === 'music' ? 180 : type === 'notes' ? 200 : type === 'todo' ? 400 : type === 'flipclock' ? 400 : 140,
      opacity: type === 'flipclock' ? 0.9 : 0.4, // flipclock默认90%透明度,其他40%
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetMenu(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  return (
    <div 
      className={`relative h-full w-full ${backgroundType === 'gradient' ? `bg-gradient-to-br ${getBackgroundGradient()}` : ''} overflow-hidden ${getFontSizeClass()} theme-${theme} accent-${accentColor} transition-all duration-300`}
      style={{ 
        transform: `scale(${scaling / 100})`,
        transformOrigin: 'top left',
        width: `${10000 / scaling}%`,
        height: `${10000 / scaling}%`,
        filter: nightMode ? 'sepia(0.2) saturate(0.8)' : 'none',
        ...(backgroundType === 'image' && backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {}),
      }}
    >
      {/* Background Overlay for Image Mode */}
      {backgroundType === 'image' && backgroundImage && (
        <div className="absolute inset-0 bg-black/30"></div>
      )}
      
      {/* Animated Background - Only show in gradient mode */}
      {backgroundType === 'gradient' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 h-8 bg-black/40 ${getBackdropBlurClass()} border-b border-white/10 flex items-center px-4 z-[9999] transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded"></div>
            NeoLinux
          </div>
          <button 
            onClick={() => openWindow('applist')}
            className="text-white/80 hover:text-white text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
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
              <div className={`absolute top-full left-0 mt-1 bg-black/90 ${getBackdropBlurClass()} border border-white/20 rounded-lg shadow-2xl overflow-hidden min-w-[160px] z-[10000] transition-all duration-300`}>
                <button onClick={() => addWidget('flipclock')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  🕙 Flip Clock
                </button>
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
                <button onClick={() => addWidget('todo')} className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                  ✓ Todo
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
          <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer">
            <span className="text-base">📶</span>
            <span>WiFi</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span>{time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
            <span>{time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <Notifications notifications={notifications} setNotifications={setNotifications} />
          <div className="relative group">
            <button className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer">
              <span className="text-base">👤</span>
              <span>{currentUser}</span>
            </button>
            <div className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUser('');
                  localStorage.removeItem('neolinux-login');
                }}
                className="w-full text-left px-4 py-2 text-white text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                🚪 注销
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-12 left-4 flex flex-col gap-4 z-10">
        <DesktopIcon icon="🏠" label="Home" onClick={() => openWindow('files')} />
        <DesktopIcon icon="🗂️" label="Documents" onClick={() => openWindow('files')} />
        <DesktopIcon icon="🖼️" label="Pictures" onClick={() => openWindow('files')} />
        <DesktopIcon icon="⚙️" label="Settings" onClick={() => openWindow('settings')} />
        <DesktopIcon icon="📱" label="Applications" onClick={() => openWindow('applist')} />
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
      <Dock 
        windows={windows}
        openWindow={openWindow}
        restoreWindow={restoreWindow}
      />
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
  const { getBackdropBlurClass, accentColor } = useTheme();

  const getTitleBarGradient = () => {
    const gradients: Record<string, string> = {
      blue: 'from-blue-600/40 to-cyan-600/40',
      purple: 'from-purple-600/40 to-pink-600/40',
      pink: 'from-pink-600/40 to-rose-600/40',
      green: 'from-green-600/40 to-emerald-600/40',
      orange: 'from-orange-600/40 to-amber-600/40',
      red: 'from-red-600/40 to-rose-600/40',
    };
    return gradients[accentColor] || 'from-purple-600/40 to-blue-600/40';
  };

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
      className={`absolute bg-gray-900/80 ${getBackdropBlurClass()} rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300`}
      style={{ ...style, zIndex: window.zIndex }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`h-10 bg-gradient-to-r ${getTitleBarGradient()} ${getBackdropBlurClass()} border-b border-white/10 flex items-center px-4 cursor-move transition-all duration-300`}
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
        {window.type === 'appstore' && <AppStoreApp />}
        {window.type === 'applist' && <AppListApp />}
        {window.type === 'browser' && <BrowserApp />}
        {window.type === 'settings' && <SettingsApp windowId={window.id} />}
        {window.type === 'about' && <AboutApp />}
        {window.type === 'music' && <MusicPlayerApp />}
        {window.type === 'video' && <VideoPlayerApp />}
        {window.type === 'texteditor' && <TextEditorApp />}
        {window.type === 'paint' && <PaintApp />}
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
