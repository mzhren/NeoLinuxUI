'use client';

export default function VideoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 背景圆角矩形 */}
      <rect x="1" y="4" width="22" height="16" rx="3" fill="url(#videoGradient)" />
      
      {/* 播放按钮三角形 */}
      <path
        d="M10 8.5L16 12L10 15.5V8.5Z"
        fill="white"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* 装饰性高光 */}
      <path
        d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7H4V6Z"
        fill="white"
        fillOpacity="0.3"
      />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FF3366', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF0066', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
