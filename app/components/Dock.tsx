'use client';

import { useState, useEffect, useRef } from 'react';

interface Window {
  id: string;
  title: string;
  type: 'terminal' | 'files' | 'monitor' | 'about' | 'appstore' | 'applist' | 'browser';
  minimized: boolean;
}

interface DockProps {
  windows: Window[];
  openWindow: (type: Window['type']) => void;
  restoreWindow: (id: string) => void;
}

export default function Dock({ windows, openWindow, restoreWindow }: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const dockApps = [
    { icon: '💻', label: 'Terminal', type: 'terminal' as const },
    { icon: '📁', label: 'Files', type: 'files' as const },
    { icon: '🌐', label: 'Chrome', type: 'browser' as const },
    { icon: '📊', label: 'Monitor', type: 'monitor' as const },
    { icon: '🛍️', label: 'App Store', type: 'appstore' as const },
    { icon: 'ℹ️', label: 'About', type: 'about' as const },
  ];

  const minimizedWindows = windows.filter(w => w.minimized);

  return (
    <div 
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/20 z-[9998] overflow-visible"
    >
      {dockApps.map((app, index) => (
        <DockIcon
          key={app.type}
          icon={app.icon}
          label={app.label}
          onClick={() => openWindow(app.type)}
          mouseX={mouseX}
          mouseY={mouseY}
          index={index}
        />
      ))}
      
      {minimizedWindows.length > 0 && (
        <div className="w-px h-8 bg-white/20 mx-1"></div>
      )}
      
      {minimizedWindows.map((w, index) => (
        <DockIcon
          key={w.id}
          icon={getWindowIcon(w.type)}
          label={w.title}
          onClick={() => restoreWindow(w.id)}
          minimized
          mouseX={mouseX}
          mouseY={mouseY}
          index={dockApps.length + 1 + index}
        />
      ))}
    </div>
  );
}

function getWindowIcon(type: Window['type']): string {
  const iconMap: Record<Window['type'], string> = {
    terminal: '💻',
    files: '📁',
    monitor: '📊',
    appstore: '🛍️',
    applist: '📱',
    browser: '🌐',
    about: 'ℹ️',
  };
  return iconMap[type] || 'ℹ️';
}

interface DockIconProps {
  icon: string;
  label: string;
  onClick: () => void;
  minimized?: boolean;
  mouseX?: number | null;
  mouseY?: number | null;
  index?: number;
}

function DockIcon({ 
  icon, 
  label, 
  onClick, 
  minimized,
  mouseX,
  mouseY,
  index
}: DockIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [gradientColor] = useState(() => {
    // 随机生成渐变颜色
    const colors = [
      'from-blue-400 to-cyan-400',
      'from-purple-400 to-pink-400',
      'from-green-400 to-emerald-400',
      'from-orange-400 to-red-400',
      'from-yellow-400 to-amber-400',
      'from-indigo-400 to-purple-400',
      'from-pink-400 to-rose-400',
      'from-teal-400 to-cyan-400',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    if (mouseX !== null && mouseX !== undefined && mouseY !== null && mouseY !== undefined && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      
      // 计算图标中心点
      const iconCenterX = rect.left + rect.width / 2;
      const iconCenterY = rect.top + rect.height / 2;
      
      // 计算鼠标到图标中心的距离
      const deltaX = mouseX - iconCenterX;
      const deltaY = mouseY - iconCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // macOS 风格的磁性放大效果
      const maxDistance = 120; // 影响范围
      const maxScale = 1.6; // 最大放大倍数
      const maxTranslateY = -16; // 最大上移距离
      
      if (distance < maxDistance) {
        const influence = 1 - distance / maxDistance;
        const easeInfluence = Math.pow(influence, 0.8); // 缓动函数
        
        const newScale = 1 + (maxScale - 1) * easeInfluence;
        const newTranslateY = maxTranslateY * easeInfluence;
        
        setScale(newScale);
        setTranslateY(newTranslateY);
      } else {
        setScale(1);
        setTranslateY(0);
      }
    } else {
      setScale(1);
      setTranslateY(0);
    }
  }, [mouseX, mouseY]);

  return (
    <div className="relative group flex items-center" style={{ height: '48px' }}>
      <button
        ref={iconRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`text-3xl p-1.5 transition-all duration-300 ease-out origin-bottom ${minimized ? 'opacity-60' : ''}`}
        style={{
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        title={label}
      >
        {icon}
      </button>
      <div 
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        style={{ zIndex: 10000 }}
      >
        {label} 
      </div>
      {/* 运行中指示器 */}
      {!minimized && (
        <div 
          className={`absolute bottom-[2px] left-1/2 transform -translate-x-1/2 h-1 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-300 ease-out`}
          style={{
            width: isHovered ? '24px' : '4px',
          }}
        ></div>
      )}
    </div>
  );
}
