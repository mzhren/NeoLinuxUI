export default function PaintIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 调色板主体 */}
      <path 
        d="M 12 2 C 6.5 2 2 6.5 2 12 C 2 14 2.5 15.8 3.5 17.3 C 4 18 5 18 5.5 17.5 C 6 17 6 16 5.5 15.3 C 4.8 14.2 4.5 13 4.5 12 C 4.5 7.8 7.8 4.5 12 4.5 C 16.2 4.5 19.5 7.8 19.5 12 C 19.5 13.5 19.5 14 18.5 14 L 16 14 C 15 14 14 15 14 16 C 14 16.5 14.2 17 14.5 17.5 C 15 18 15 19 14.5 19.5 C 14 20 13 20 12.5 19.5 C 11.5 18.5 11 17.3 11 16 C 11 13.8 12.8 12 15 12 L 18.5 12 C 20.5 12 22 10.5 22 8.5 C 22 5 17.5 2 12 2 Z" 
        fill="url(#paletteGradient)"
        stroke="url(#paletteStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* 颜料孔 - 红色 */}
      <circle cx="8" cy="8" r="1.8" fill="#FF4444" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      
      {/* 颜料孔 - 黄色 */}
      <circle cx="12" cy="7" r="1.8" fill="#FFD700" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      
      {/* 颜料孔 - 绿色 */}
      <circle cx="16" cy="8" r="1.8" fill="#44FF88" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      
      {/* 颜料孔 - 蓝色 */}
      <circle cx="7" cy="12" r="1.8" fill="#4444FF" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      
      {/* 颜料孔 - 紫色 */}
      <circle cx="11" cy="11" r="1.8" fill="#B844FF" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      
      {/* 高光效果 */}
      <circle cx="9" cy="9" r="0.5" fill="white" opacity="0.6" />
      <circle cx="13" cy="8" r="0.5" fill="white" opacity="0.6" />
      <circle cx="17" cy="9" r="0.5" fill="white" opacity="0.6" />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="paletteGradient" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#F0F0F0" />
          <stop offset="100%" stopColor="#D0D0D0" />
        </linearGradient>
        <linearGradient id="paletteStroke" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
