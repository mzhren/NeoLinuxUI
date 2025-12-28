'use client';

import { useEffect, useRef } from 'react';

export default function FlipClockWidget() {
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 动态导入 flipclock 避免 SSR 问题
    if (typeof window !== 'undefined' && clockRef.current) {
      import('flipclock').then(({ flipClock, clock, theme, css }) => {
        // 清除之前的时钟实例
        if (clockRef.current) {
          clockRef.current.innerHTML = '';
          
          // 创建新的 FlipClock 实例
          flipClock({
            parent: clockRef.current,
            face: clock(),
            theme: theme({
              dividers: ':',
              css: css({
                fontSize: '5rem',
              })
            })
          });
        }
      });
    }
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      {/* FlipClock 容器 */}
      <div ref={clockRef} id="clock" className="flipclock-container"></div>
      
      {/* 日期显示 */}
      <div className="text-white/70 text-3xl font-light tracking-wide">
        {new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}
      </div>
    </div>
  );
}
