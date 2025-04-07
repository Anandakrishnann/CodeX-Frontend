export default function Loading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center p-8 rounded-lg bg-white bg-opacity-10 shadow-2xl">
          {/* Spinner */}
          <div className="relative h-24 w-24 mb-6">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-white border-b-transparent border-l-transparent animate-spin"></div>
  
            {/* Middle ring - opposite direction */}
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-white border-l-white animate-[spin_2s_linear_reverse_infinite]"></div>
  
            {/* Inner pulse */}
            <div className="absolute inset-5 rounded-full bg-white animate-pulse"></div>
          </div>
  
          {/* Text */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2 tracking-wider">LOADING</h3>
            <div className="flex space-x-1 justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  