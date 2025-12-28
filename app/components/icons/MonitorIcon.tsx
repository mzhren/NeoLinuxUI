export default function MonitorIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 显示器外框 */}
      <rect 
        x="2" 
        y="3" 
        width="20" 
        height="14" 
        rx="1.5" 
        stroke="url(#monitorGradient)" 
        strokeWidth="1.5"
        fill="rgba(59, 130, 246, 0.1)"
      />
      
      {/* 显示器屏幕 */}
      <rect 
        x="3.5" 
        y="4.5" 
        width="17" 
        height="11" 
        rx="0.5" 
        fill="url(#screenGradient)"
      />
      
      {/* CPU/系统监控图表线条 */}
      <path 
        d="M 6 10 L 8 8 L 10 11 L 12 7 L 14 9 L 16 6 L 18 8" 
        stroke="#10B981" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* 底部支架 */}
      <path 
        d="M 10 17 L 10 19 L 14 19 L 14 17" 
        stroke="url(#monitorGradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* 底座 */}
      <line 
        x1="8" 
        y1="21" 
        x2="16" 
        y2="21" 
        stroke="url(#monitorGradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="monitorGradient" x1="2" y1="3" x2="22" y2="21">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="3.5" y1="4.5" x2="20.5" y2="15.5">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
