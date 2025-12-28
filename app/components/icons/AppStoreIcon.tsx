export default function AppStoreIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外层圆角矩形背景 */}
      <rect 
        x="2" 
        y="2" 
        width="20" 
        height="20" 
        rx="5" 
        fill="url(#appStoreGradient)"
      />
      
      {/* 网格图案 - 代表应用商店 */}
      <rect x="5.5" y="5.5" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
      <rect x="13.5" y="5.5" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
      <rect x="5.5" y="13.5" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
      <rect x="13.5" y="13.5" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="appStoreGradient" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
