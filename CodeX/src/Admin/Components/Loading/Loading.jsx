export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white mt-4 text-lg font-semibold">
        Loading...
      </p>
    </div>
  );
}
