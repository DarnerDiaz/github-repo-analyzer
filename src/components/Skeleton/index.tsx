'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-full mb-2" />;
}

export function SkeletonCard() {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <Skeleton className="h-6 w-2/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
