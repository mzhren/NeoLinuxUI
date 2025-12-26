'use client';

import { useState, useEffect, useRef } from 'react';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';
import CalendarWidget from './CalendarWidget';
import MusicWidget from './MusicWidget';
import SystemInfoWidget from './SystemInfoWidget';
import NotesWidget from './NotesWidget';

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'calendar' | 'music' | 'system-info' | 'notes';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggableWidgetProps {
  widget: Widget;
  onRemove: () => void;
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
}

export default function DraggableWidget({ widget, onRemove, setWidgets }: DraggableWidgetProps) {
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setWidgets(prev => prev.map(w => 
          w.id === widget.id 
            ? { ...w, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : w
        ));
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, dragOffset, widget.id, setWidgets]);

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
      default:
        return null;
    }
  };

  return (
    <div
      ref={widgetRef}
      className="absolute bg-black/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden group cursor-move"
      style={{ 
        top: widget.y, 
        left: widget.x, 
        width: widget.width, 
        height: widget.height,
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
    </div>
  );
}
