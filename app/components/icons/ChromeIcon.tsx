export default function ChromeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2"/>
      
      {/* Red segment */}
      <path 
        d="M12 2C6.48 2 2 6.48 2 12c0 2.43.87 4.66 2.32 6.39L9.5 9.5h9c0-2.76-2.24-5-5-5-1.66 0-3.13.81-4.05 2.05L12 2z" 
        fill="#EA4335"
      />
      
      {/* Yellow segment */}
      <path 
        d="M4.32 18.39C6.05 20.55 8.85 22 12 22c3.87 0 7.13-2.21 8.78-5.44L15.5 9.5H9.5L4.32 18.39z" 
        fill="#FBBC04"
      />
      
      {/* Green segment */}
      <path 
        d="M22 12c0-.34-.02-.68-.05-1.01L20.78 16.56c1.23-1.28 2-3 2.22-4.89v.33c0-3.87-2.21-7.13-5.44-8.78L12 12l8.05 0C21.19 11.34 22 10.74 22 12z" 
        fill="#34A853"
      />
      
      {/* Blue center circle */}
      <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
      <circle cx="12" cy="12" r="2.5" fill="#fff"/>
      
      {/* Outer stroke */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
}
