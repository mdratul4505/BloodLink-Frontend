export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute h-16 w-16 rounded-full bg-red-500/20 animate-ping" />
        <div className="relative h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-red-500/30">
          <svg
            className="w-6 h-6 text-white animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">
        BloodLink
      </p>
    </div>
  );
}
