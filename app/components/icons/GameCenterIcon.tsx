export default function GameCenterIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gameCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      
      {/* Game controller body */}
      <path
        d="M 12 22 Q 8 22 8 26 L 8 38 Q 8 42 12 42 L 20 42 Q 22 42 24 44 L 28 48 Q 30 50 32 50 Q 34 50 36 48 L 40 44 Q 42 42 44 42 L 52 42 Q 56 42 56 38 L 56 26 Q 56 22 52 22 L 12 22 Z"
        fill="url(#gameCenterGradient)"
        opacity="0.9"
      />
      
      {/* Left D-pad */}
      <g transform="translate(16, 28)">
        {/* Horizontal bar */}
        <rect x="-4" y="2" width="8" height="4" rx="1" fill="white" opacity="0.9" />
        {/* Vertical bar */}
        <rect x="-2" y="0" width="4" height="8" rx="1" fill="white" opacity="0.9" />
      </g>
      
      {/* Right buttons */}
      <g transform="translate(44, 28)">
        {/* Top button */}
        <circle cx="0" cy="0" r="2.5" fill="white" opacity="0.9" />
        {/* Right button */}
        <circle cx="4" cy="4" r="2.5" fill="white" opacity="0.9" />
        {/* Bottom button */}
        <circle cx="0" cy="8" r="2.5" fill="white" opacity="0.9" />
        {/* Left button */}
        <circle cx="-4" cy="4" r="2.5" fill="white" opacity="0.9" />
      </g>
      
      {/* Center buttons */}
      <rect x="28" y="30" width="3" height="1.5" rx="0.5" fill="white" opacity="0.7" />
      <rect x="33" y="30" width="3" height="1.5" rx="0.5" fill="white" opacity="0.7" />
      
      {/* Accent shine */}
      <ellipse cx="32" cy="20" rx="20" ry="8" fill="white" opacity="0.15" />
    </svg>
  );
}
