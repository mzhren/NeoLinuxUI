'use client';

import { useState, useEffect, useRef } from 'react';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';
import CalendarWidget from './CalendarWidget';
import MusicWidget from './MusicWidget';
import SystemInfoWidget from './SystemInfoWidget';
import NotesWidget from './NotesWidget';
import TodoWidget from './TodoWidget';
import FlipClockWidget from './FlipClockWidget';

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'calendar' | 'music' | 'system-info' | 'notes' | 'todo' | 'flipclock';
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number; // 背景透明度 0-1
}

interface DraggableWidgetProps {
  widget: Widget;
  onRemove: () => void;
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
}

export default function DraggableWidget({ widget, onRemove, setWidgets }: DraggableWidgetProps) {
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // 只允许从拖动手柄或边缘区域拖动
    const target = e.target as HTMLElement;
    if (
      target.closest('.widget-interactive') || 
      target.closest('button') || 
      target.closest('input') || 
      target.closest('textarea')
    ) {
      return;
    }

    setDragging(true);
    setDragOffset({
      x: e.clientX - widget.x,
      y: e.clientY - widget.y
    });
    e.stopPropagation();
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: widget.width,
      height: widget.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setWidgets(prev => prev.map(w => 
          w.id === widget.id 
            ? { ...w, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : w
        ));
      }

      if (resizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        setWidgets(prev => prev.map(w => {
          if (w.id === widget.id) {
            const updates: Partial<Widget> = {};
            
            // weather widget 的最小高度为 220px，其他为 150px
            const minHeight = w.type === 'weather' ? 220 : 150;
            
            if (resizing.includes('e')) {
              updates.width = Math.max(200, resizeStart.width + deltaX);
            }
            if (resizing.includes('s')) {
              updates.height = Math.max(minHeight, resizeStart.height + deltaY);
            }
            if (resizing.includes('w')) {
              const newWidth = Math.max(200, resizeStart.width - deltaX);
              if (newWidth >= 200) {
                updates.x = w.x + (resizeStart.width - newWidth);
                updates.width = newWidth;
              }
            }
            if (resizing.includes('n')) {
              const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
              if (newHeight >= minHeight) {
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
  }, [dragging, resizing, dragOffset, resizeStart, widget.id, setWidgets]);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget />;
      case 'weather':
        return <WeatherWidget />;
      case 'calendar':
        return <CalendarWidget />;
      case 'music':
        return <MusicWidget />;
      case 'system-info':
        return <SystemInfoWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'todo':
        return <TodoWidget onRemove={onRemove} />;
      case 'flipclock':
        return <FlipClockWidget />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={widgetRef}
      className="absolute backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden group cursor-move"
      style={{ 
        top: widget.y, 
        left: widget.x, 
        width: widget.width, 
        height: widget.height,
        backgroundColor: `rgba(0, 0, 0, ${widget.opacity ?? 0.4})`,
        zIndex: 500
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle - Top Area */}
      <div className="absolute top-0 left-0 right-0 h-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
        <div className="w-12 h-1 bg-white/40 rounded-full"></div>
      </div>

      {/* Widget Close Button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center text-white text-xs cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Widget Content */}
      <div className="h-full p-4">
        {renderWidgetContent()}
      </div>

      {/* Resize Handles */}
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
    </div>
  );
}
