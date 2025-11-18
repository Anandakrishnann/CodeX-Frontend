export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Orbital rings system */}
      <div className="relative w-32 h-32">
        {/* Outer orbit */}
        <div className="absolute inset-0 border-2 border-green-500/20 rounded-full"></div>
        
        {/* Rotating orbit 1 */}
        <div className="absolute inset-2 border-2 border-transparent border-t-green-500 border-l-green-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        
        {/* Rotating orbit 2 - reverse direction */}
        <div className="absolute inset-4 border-2 border-transparent border-r-green-500 border-b-green-400 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
        
        {/* Inner rotating orbit 3 */}
        <div className="absolute inset-6 border-2 border-transparent border-t-green-300 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
        
        {/* Center core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Orbiting particles */}
        <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 bg-green-400 rounded-full shadow-lg shadow-green-500/50 animate-spin" style={{ animationDuration: '1.5s', transformOrigin: '0 64px' }}></div>
        <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 bg-green-300 rounded-full shadow-lg shadow-green-400/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse', transformOrigin: '-64px 0' }}></div>
      </div>
      
      {/* Glowing text */}
      <div className="mt-12 text-center">
        <p className="text-white text-xl font-bold tracking-widest relative">
          <span className="relative z-10">Please Wait...</span>
          <span className="absolute inset-0 blur-sm text-green-500 animate-pulse">Please Wait...</span>
        </p>
        
        {/* Progress bar effect */}
        <div className="mt-4 w-48 h-1 bg-green-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full animate-pulse" style={{ animation: 'pulse 1.5s ease-in-out infinite, shimmer 2s linear infinite' }}></div>
        </div>
      </div>
      
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}