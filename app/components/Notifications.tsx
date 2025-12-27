'use client';

import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: string;
}

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export default function Notifications({ notifications, setNotifications }: NotificationsProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // 点击外部关闭通知面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showNotifications && !target.closest('.notification-panel') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="notification-button flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer relative"
      >
        <span className="text-base">🔔</span>
        {notifications.some(n => n.unread) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      {showNotifications && (
        <div className="notification-panel absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden w-80 z-50">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="font-semibold text-white">通知</span>
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              全部已读
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/50 text-sm">
                暂无通知
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 ${
                    notification.unread ? 'bg-white/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{notification.title}</span>
                        {notification.unread && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-white/70 text-xs mt-1">{notification.message}</p>
                      <span className="text-white/50 text-xs mt-1 block">{notification.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-white/10">
            <button 
              onClick={clearAllNotifications}
              className="w-full text-center text-xs text-white/70 hover:text-white transition-colors py-1"
            >
              清空所有通知
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
