'use client';

export default function MusicIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 背景圆形 */}
      <circle cx="12" cy="12" r="11" fill="url(#musicGradient)" />
      
      {/* 音符 */}
      <path
        d="M9 18V8.5L15 7V16.5M9 18C9 19.1046 8.10457 20 7 20C5.89543 20 5 19.1046 5 18C5 16.8954 5.89543 16 7 16C8.10457 16 9 16.8954 9 18ZM15 16.5C15 17.6046 14.1046 18.5 13 18.5C11.8954 18.5 11 17.6046 11 16.5C11 15.3954 11.8954 14.5 13 14.5C14.1046 14.5 15 15.3954 15 16.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
      />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="musicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#C239F9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF0080', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
